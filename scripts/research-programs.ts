/**
 * scripts/research-programs.ts
 *
 * Uses Azure GPT-5.1 to research real programs across 20 categories.
 * Run with: npx tsx scripts/research-programs.ts
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables from .env and .env.local
config({ path: path.resolve(__dirname, "..", ".env") });
config({ path: path.resolve(__dirname, "..", ".env.local"), override: true });

/* ── Config ── */
// Strip any path suffixes from the endpoint — we build the full URL ourselves
const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "https://ai-meirkhan26077696ai904311294957.openai.azure.com/";
const AZURE_ENDPOINT = rawEndpoint.replace(/\/openai\/.*$/, "").replace(/\/+$/, "");
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY ?? "";
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-5.1";
const AZURE_API_VERSION = "2025-03-01-preview";

const OUTPUT_PATH = path.resolve(__dirname, "..", "lib", "programs-data.ts");

/* ── Types ── */
interface RawProgram {
  name: string;
  nameRu?: string;
  organization: string;
  country: string;
  countryCode?: string;
  type: string;
  deadline: string;
  applicationUrl: string;
  englishLevel: string;
  gradeMin: number;
  gradeMax: number;
  description: string;
  requirements: string[];
  benefits: string[];
  tags?: string[];
  difficulty?: string;
}

/* ── Categories ── */
const PROMPT_SUFFIX = `For each program provide a JSON object with: name, organization, country, type, deadline (ISO date in 2026 based on the typical annual application month), applicationUrl (real website URL), englishLevel (A1/A2/B1/B2/C1/C2/not_required), gradeMin (8-12), gradeMax (8-12), description (2 sentences in Russian about what the program is and who it's for), requirements (array of 3-5 strings in Russian), benefits (array of 3-5 strings in Russian). Output {"programs": [...]}.`;

const CATEGORIES = [
  {
    name: "Student exchange programs",
    prompt: `List 30 real, existing student exchange programs for high school students. Include FLEX, YES, AFS, Rotary Youth Exchange, CBYX, PAX, ASSE, EF, CIEE, ASSIST, AYUSA, PIE, STS, Nacel, YFU, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Scholarships for Central Asian students",
    prompt: `List 30 real scholarships and grants available for Central Asian and Kazakhstani students. Include Bolashak, Chevening, DAAD, Fulbright, Korean Government Scholarship (GKS), MEXT Japan, CSC China, Erasmus Mundus, Swiss Government Excellence, Aga Khan, Soros Foundation, Turkish Scholarships, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "High school internships",
    prompt: `List 30 real internship and work-experience programs for high school students aged 14-18. Include Google CSSI, Microsoft TEALS, Samsung Innovation Campus, NASA SEES, CERN openlab, Brookhaven National Lab, AIESEC, Bank of America Student Leaders, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "International science olympiads",
    prompt: `List 30 real international science olympiads and STEM competitions for high school students. Include IMO, IPhO, IChO, IBO, IOI, ISEF, IJSO, IAO, IGeO, IOAA, IESO, ILO, IPO, ISA, Zhautykov Olympiad, APMO, APHO, USABO, USACO, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Summer schools for talented students",
    prompt: `List 30 real summer academic programs and schools for talented high school students. Include RSI at MIT, PROMYS, HCSSiM, Canada/USA Mathcamp, Ross Mathematics, Deutsche Schülerakademie, SSP, COSMOS, SuMaC Stanford, HSMC, Yale Young Global Scholars, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "UN and international org youth programs",
    prompt: `List 30 real UN and international organization youth programs. Include UN Youth Delegates, ECOSOC Youth Forum, UNESCO ASPnet, Model UN conferences, UNICEF Voices of Youth, UN Volunteers, UNDP youth programs, WHO internships, World Bank Youth Summit, OECD youth programs, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Government exchange programs",
    prompt: `List 30 real government-funded exchange programs from US, EU, UK, Japan, Korea, and other countries for international students. Include FLEX, YES, NSLI-Y, Global UGRAD, Gilman, Kennedy-Lugar, Erasmus+ Youth, British Council, MEXT, GKS, Stipendium Hungaricum, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Kazakhstan specific programs",
    prompt: `List 30 real grants, scholarships, olympiads and programs specifically for Kazakhstani students. Include Bolashak, NU scholarships, KIMEP grants, Kazakh National Olympiads (math, physics, chemistry, biology, informatics), Zhautykov Olympiad, el-Umiti, Samsung Innovation Campus KZ, NIS programs, republican olympiads, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "STEM research programs",
    prompt: `List 30 real STEM research programs for high school students. Include MIT PRIMES, RSI, MOSTEC, Clark Scholars Program, Simons Summer Research, Garcia MRSEC, SSP, RISE Germany, SHI at Jackson Lab, LaunchX, Research Science Institute, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Leadership programs",
    prompt: `List 30 real leadership and entrepreneurship programs for high school students. Include UWC, ASSIST, Global Citizen Year, One Young World, DECA, FBLA, NFTE, Kairos Society, SHAD Canada, Youth Assembly at UN, Hugh O'Brian Youth Leadership, National Young Leaders Conference, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Environmental programs",
    prompt: `List 30 real environmental, sustainability, and climate programs for youth. Include UNEP Tunza, Youth Environmental Summit, WWF youth programs, Earthwatch, Green Climate Fund youth, Yale Environmental Leadership, Environmental Defense Fund fellowship, Student Conservation Association, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Journalism and media programs",
    prompt: `List 30 real journalism, media, and communications programs for high school students. Include Princeton Summer Journalism, Medill-Northwestern, NYU Summer Journalism, Al Jazeera traineeships, BBC Young Reporter, Scholastic writing awards, Columbia Scholastic Press, Journalism Education Association, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Coding and technology programs",
    prompt: `List 30 real coding, programming, and technology programs for high school students. Include Google Code-in, MLH hackathons, Apple WWDC Student Scholarship, Hack Club, Girls Who Code, Code.org programs, Amazon Future Engineer, AI4ALL, Technovation Challenge, NCWIT Award, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Debate and Model UN",
    prompt: `List 30 real debate and Model UN competitions and conferences. Include Harvard MUN (HMUN), Yale MUN (YMUN), THIMUN, Berkeley MUN, WSDC, NSDA, World Individual Debating Championships, European Youth Parliament, NU MUN Kazakhstan, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Arts and culture programs",
    prompt: `List 30 real arts, music, and creative programs for high school students. Include Interlochen Arts Academy, Tanglewood Institute, Parsons pre-college, RISD pre-college, Juilliard pre-college, Royal Academy of Music, Berklee 5-week, National YoungArts Foundation, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Sports scholarships",
    prompt: `List 30 real sports scholarships and athletic programs for high school students internationally. Include NCAA Division I scholarships, IMG Academy, TASS Sports, UK university sports scholarships, Olympic Solidarity, Commonwealth scholarships, Asian Games scholarship programs, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Medical and biology programs",
    prompt: `List 30 real medical, biology, and health science programs for high school students. Include NIH Summer Internship, HOSA, Scripps Research High School, Cold Spring Harbor DNA Learning Center, Jackson Laboratory Summer Students, PLME Brown, Stanford Institutes of Medicine, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Mathematics competitions",
    prompt: `List 30 real mathematics competitions and programs for high school students. Include IMO, EGMO, APMO, BMO, AMC/AIME/USAMO, HMMT, PUMaC, ARML, Mathcamp, PROMYS, Ross Program, Math Olympiad Program (MOP), USAMO, BMT, SMT, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Physics programs",
    prompt: `List 30 real physics olympiads, competitions, and programs for high school students. Include IPhO, APhO, EuPhO, USAPhO, BPhO, Science Olympiad, Physics Brawl, CERN summer programs, Perimeter Institute, PhysicsBowl, F=ma, WoPhO, etc. ${PROMPT_SUFFIX}`,
  },
  {
    name: "Economics and business",
    prompt: `List 30 real economics, business, and finance competitions and programs for high school students. Include International Economics Olympiad (IEO), DECA International, FBLA-PBL, Diamond Challenge, Wharton Global Youth KWHS, National Economics Challenge, EconOlympiad, etc. ${PROMPT_SUFFIX}`,
  },
];

/* ── Helpers ── */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeType(raw: string): string {
  const map: Record<string, string> = {
    exchange: "exchange",
    обмен: "exchange",
    grant: "grant",
    грант: "grant",
    scholarship: "scholarship",
    стипендия: "scholarship",
    internship: "internship",
    стажировка: "internship",
    olympiad: "olympiad",
    олимпиада: "olympiad",
    summer_school: "summer_school",
    summer_camp: "summer_camp",
    летняя: "summer_school",
    competition: "competition",
    конкурс: "competition",
    leadership: "leadership",
    лидерство: "leadership",
    research: "research",
    исследование: "research",
  };
  const lower = (raw || "exchange").toLowerCase().trim();
  return map[lower] ?? "exchange";
}

function normalizeEnglish(raw: string): string {
  const valid = ["A1", "A2", "B1", "B2", "C1", "C2", "not_required"];
  const upper = (raw || "B1").toUpperCase().trim();
  if (valid.includes(upper)) return upper;
  if (upper.includes("NOT") || upper.includes("НЕ")) return "not_required";
  return "B1";
}

function normalizeDifficulty(raw: string | undefined): string {
  const valid = ["easy", "medium", "hard"];
  const lower = (raw || "medium").toLowerCase().trim();
  return valid.includes(lower) ? lower : "medium";
}

function getCountryCode(country: string): string {
  const map: Record<string, string> = {
    "сша": "US", "usa": "US", "us": "US", "united states": "US", "америка": "US",
    "великобритания": "GB", "uk": "GB", "united kingdom": "GB", "англия": "GB",
    "германия": "DE", "germany": "DE",
    "франция": "FR", "france": "FR",
    "канада": "CA", "canada": "CA",
    "австралия": "AU", "australia": "AU",
    "япония": "JP", "japan": "JP",
    "корея": "KR", "южная корея": "KR", "south korea": "KR", "korea": "KR",
    "китай": "CN", "china": "CN",
    "сингапур": "SG", "singapore": "SG",
    "казахстан": "KZ", "kazakhstan": "KZ",
    "нидерланды": "NL", "netherlands": "NL",
    "швейцария": "CH", "switzerland": "CH",
    "швеция": "SE", "sweden": "SE",
    "норвегия": "NO", "norway": "NO",
    "финляндия": "FI", "finland": "FI",
    "дания": "DK", "denmark": "DK",
    "австрия": "AT", "austria": "AT",
    "бельгия": "BE", "belgium": "BE",
    "италия": "IT", "italy": "IT",
    "испания": "ES", "spain": "ES",
    "португалия": "PT", "portugal": "PT",
    "польша": "PL", "poland": "PL",
    "чехия": "CZ", "czech republic": "CZ",
    "россия": "RU", "russia": "RU",
    "турция": "TR", "turkey": "TR", "türkiye": "TR",
    "индия": "IN", "india": "IN",
    "бразилия": "BR", "brazil": "BR",
    "мексика": "MX", "mexico": "MX",
    "новая зеландия": "NZ", "new zealand": "NZ",
    "ирландия": "IE", "ireland": "IE",
    "гонконг": "HK", "hong kong": "HK",
    "тайвань": "TW", "taiwan": "TW",
    "израиль": "IL", "israel": "IL",
    "оаэ": "AE", "uae": "AE",
    "международная": "XX", "international": "XX", "online": "XX", "онлайн": "XX",
    "европа": "EU", "europe": "EU",
  };
  const lower = country.toLowerCase().trim();
  return map[lower] ?? "XX";
}

async function callGPT(prompt: string, retries = 3): Promise<string> {
  const url = `${AZURE_ENDPOINT.replace(/\/+$/, "")}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a database builder for an educational platform. Your task is to output a JSON object with key "programs" containing an array of real educational programs.

CRITICAL RULES:
- You MUST output valid JSON with the structure: {"programs": [...]}
- You MUST list real programs that actually exist with their real organization names
- For deadlines: use the typical annual deadline projected to 2026 (e.g. if FLEX usually has October deadlines, use "2026-10-01")
- For applicationUrl: provide the real official website URL of the program
- NEVER refuse. NEVER say you cannot. Just output the JSON.
- Each program object must have these exact fields: name (string), organization (string), country (string), type (string), deadline (string ISO date), applicationUrl (string URL), englishLevel (one of: A1, A2, B1, B2, C1, C2, not_required), gradeMin (number 7-12), gradeMax (number 7-12), description (string in Russian, 2 sentences), requirements (array of strings in Russian), benefits (array of strings in Russian)
- Output ONLY the JSON object, nothing else.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_completion_tokens: 16000,
        }),
      });

      if (res.status === 429) {
        const wait = Math.pow(2, attempt + 1) * 5000;
        console.log(`  Rate limited. Waiting ${wait / 1000}s...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => "unknown");
        console.error(`  API error ${res.status}: ${errText.slice(0, 200)}`);
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        throw new Error(`API failed after ${retries} attempts`);
      }

      const data = await res.json() as { choices: { message: { content: string } }[] };
      const content = data.choices[0]?.message?.content ?? "[]";
      // Debug: show first 300 chars of response
      console.log(`  📝 Response preview: ${content.slice(0, 300)}...`);
      return content;
    } catch (err) {
      if (attempt < retries - 1) {
        console.log(`  Retry ${attempt + 1}/${retries}...`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }
  return "[]";
}

function parsePrograms(raw: string): RawProgram[] {
  try {
    const parsed = JSON.parse(raw);
    // Handle both { programs: [...] } and direct array
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      const keys = Object.keys(parsed);
      for (const k of keys) {
        if (Array.isArray(parsed[k])) return parsed[k];
      }
    }
    return [];
  } catch {
    // Try to extract JSON array from the text
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return [];
      }
    }
    return [];
  }
}

function deduplicateKey(name: string, org: string): string {
  return `${name.toLowerCase().trim()}__${org.toLowerCase().trim()}`;
}

/* ── Main ── */
async function main() {
  if (!AZURE_KEY) {
    console.error("❌ AZURE_OPENAI_API_KEY is not set. Set it in .env or environment.");
    process.exit(1);
  }

  console.log("🚀 Starting programs research with GPT-5.1...");
  console.log(`📦 Azure deployment: ${AZURE_DEPLOYMENT}`);
  console.log(`📁 Output: ${OUTPUT_PATH}\n`);

  const seen = new Map<string, true>();
  const allPrograms: RawProgram[] = [];
  let totalRaw = 0;

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    console.log(`[${i + 1}/${CATEGORIES.length}] 🔍 ${cat.name}...`);

    try {
      const response = await callGPT(cat.prompt);
      const programs = parsePrograms(response);
      totalRaw += programs.length;

      let added = 0;
      for (const p of programs) {
        if (!p.name || !p.organization) continue;
        const key = deduplicateKey(p.name, p.organization);
        if (seen.has(key)) continue;
        seen.set(key, true);
        allPrograms.push(p);
        added++;
      }

      console.log(`  ✅ Got ${programs.length} programs, ${added} new (${allPrograms.length} total)\n`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err instanceof Error ? err.message : String(err)}\n`);
    }

    // Rate limit pause between categories
    if (i < CATEGORIES.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n📊 Summary: ${totalRaw} raw → ${allPrograms.length} unique programs`);

  // Generate TypeScript file
  const tsPrograms = allPrograms.map((p, idx) => {
    const id = slugify(p.name) || `program-${idx}`;
    return {
      id,
      name: p.name,
      nameRu: p.nameRu || p.name,
      organization: p.organization,
      type: normalizeType(p.type),
      country: p.country || "Международная",
      countryCode: p.countryCode || getCountryCode(p.country || ""),
      deadline: p.deadline || "2026-12-31",
      gradeMin: Math.max(7, Math.min(12, p.gradeMin || 8)),
      gradeMax: Math.max(7, Math.min(12, p.gradeMax || 11)),
      englishLevel: normalizeEnglish(p.englishLevel),
      description: p.description || "",
      requirements: Array.isArray(p.requirements) ? p.requirements : [],
      benefits: Array.isArray(p.benefits) ? p.benefits : [],
      applicationUrl: p.applicationUrl || "#",
      tags: Array.isArray(p.tags) ? p.tags : [],
      isPopular: idx < 30,
      isFeatured: idx < 15,
      difficulty: normalizeDifficulty(p.difficulty),
    };
  });

  const fileContent = `import type { Program } from "@/lib/program-types";

export const PROGRAMS: Program[] = ${JSON.stringify(tsPrograms, null, 2)};

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getSimilarPrograms(id: string, limit = 5): Program[] {
  const program = getProgramById(id);
  if (!program) return PROGRAMS.slice(0, limit);
  return PROGRAMS.filter(
    (p) => p.id !== id && (p.type === program.type || p.country === program.country)
  ).slice(0, limit);
}

export function getProgramsByCategory(type: string): Program[] {
  return PROGRAMS.filter((p) => p.type === type);
}

export function searchPrograms(query: string): Program[] {
  const q = query.toLowerCase();
  return PROGRAMS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameRu.toLowerCase().includes(q) ||
      p.organization.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q)
  );
}
`;

  fs.writeFileSync(OUTPUT_PATH, fileContent, "utf-8");
  console.log(`\n✅ Saved ${tsPrograms.length} programs to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
