import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { azureChat } from "@/lib/azure-openai";
import type { Program } from "@/lib/program-types";

type StudentProfile = Record<string, unknown>;

type SlimProgram = Pick<
  Program,
  "id" | "nameRu" | "type" | "country" | "gradeMin" | "gradeMax" | "englishLevel" | "deadline" | "tags" | "difficulty"
>;

type MatchResult = {
  programId: string;
  score: number;
  reasons: string[];
  warnings: string[];
};

type MatchResponse = {
  matches: MatchResult[];
};

const SYSTEM_PROMPT = `You are Missio's matching engine for Kazakhstan school students (grades 8–11), including NIS, BIL, and regular schools.

Input JSON has:
- studentProfile: interests, grades, English level, school type, city, subjects, achievements, goals, etc.
- programs: array of programs with id, nameRu, type, country, gradeMin, gradeMax, englishLevel (CEFR), deadline (ISO), tags, difficulty.

Output ONLY valid JSON (no markdown) with this exact shape:
{
  "matches": [
    {
      "programId": string,
      "score": number (0-100, one decimal max),
      "reasons": string[] (2-5 short bullets in Russian),
      "warnings": string[] (gaps or risks in Russian, can be empty)
    }
  ]
}

Rules:
- Include every input program exactly once.
- Higher score = better realistic fit for a motivated KZ student.
- Mention English gap, grade mismatch, or deadline stress in warnings when relevant.
- Consider Bolashak/FLEX/NIS olympiad culture when helpful.
- Return JSON only.`;

function validateInput(body: unknown): body is { studentProfile: StudentProfile; programs: SlimProgram[] } {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;
  if (!obj.studentProfile || !Array.isArray(obj.programs)) return false;
  return true;
}

function profileHash(student: StudentProfile, programIds: string[]): string {
  const raw = JSON.stringify({ student, programIds: programIds.sort() });
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return `h_${(h >>> 0).toString(16)}_${programIds.length}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);

    if (!validateInput(body)) {
      return NextResponse.json({ error: "Invalid request body. Expected { studentProfile, programs[] }" }, { status: 400 });
    }

    const { studentProfile, programs } = body;

    if (!process.env.AZURE_OPENAI_API_KEY) {
      return NextResponse.json({ error: "Azure OpenAI API key is not configured." }, { status: 500 });
    }

    const cacheKey = profileHash(studentProfile, programs.map((p) => p.id));
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && serviceKey && !url.includes("your_supabase")) {
      const supabase = createClient(url, serviceKey);
      const { data: cached } = await supabase.from("match_cache").select("payload").eq("profile_hash", cacheKey).maybeSingle();
      if (cached?.payload && typeof cached.payload === "object") {
        const payload = cached.payload as MatchResponse;
        if (Array.isArray(payload.matches)) {
          return NextResponse.json({ matches: payload.matches, cached: true }, { status: 200 });
        }
      }
    }

    const textContent = await azureChat({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ studentProfile, programs }) },
      ],
      temperature: 0.25,
      maxTokens: 4096,
    });

    let parsed: MatchResponse | null = null;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      const start = textContent.indexOf("{");
      const end = textContent.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        parsed = JSON.parse(textContent.slice(start, end + 1));
      }
    }

    if (!parsed || !Array.isArray(parsed.matches)) {
      return NextResponse.json({ error: "Model response missing matches array." }, { status: 502 });
    }

    const validProgramIds = new Set(programs.map((p) => p.id));
    const sanitizedMatches: MatchResult[] = parsed.matches
      .filter((m) => m && typeof m.programId === "string" && validProgramIds.has(m.programId))
      .map((m) => ({
        programId: m.programId,
        score: typeof m.score === "number" ? Math.min(100, Math.max(0, m.score)) : 0,
        reasons: Array.isArray(m.reasons) ? m.reasons.map(String) : [],
        warnings: Array.isArray(m.warnings) ? m.warnings.map(String) : [],
      }));

    if (url && serviceKey && !url.includes("your_supabase") && sanitizedMatches.length) {
      const supabase = createClient(url, serviceKey);
      await supabase.from("match_cache").upsert(
        {
          profile_hash: cacheKey,
          payload: { matches: sanitizedMatches } satisfies MatchResponse,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_hash" }
      );
    }

    return NextResponse.json({ matches: sanitizedMatches, cached: false }, { status: 200 });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json({ error: "Internal server error while generating matches." }, { status: 500 });
  }
}
