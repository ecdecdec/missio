import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();

    if (!rawText?.trim()) {
      return NextResponse.json({ error: "rawText is required" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: `Извлекай структурированные данные о грантах и образовательных программах из текста.
Отвечай ТОЛЬКО валидным JSON без markdown блоков.
Если данных нет — используй null.`,
      messages: [
        {
          role: "user",
          content: `Извлеки данные из этого текста о программе:

${rawText}

Верни JSON:
{
  "name": string,
  "organization": string,
  "type": "grant" | "exchange" | "olympiad" | "internship" | "summer_school",
  "country": string,
  "deadline": string (ISO date or null),
  "gradeMin": number,
  "gradeMax": number,
  "englishLevel": string or null,
  "description": string (на русском, 2-3 предложения),
  "requirements": string[],
  "benefits": string[],
  "applicationUrl": string or null
}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Parse program error:", error);
    return NextResponse.json({ error: "Failed to parse program" }, { status: 500 });
  }
}
