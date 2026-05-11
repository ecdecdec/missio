import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { studentProfile, programs } = await req.json();

    if (!studentProfile || !programs?.length) {
      return NextResponse.json({ error: "studentProfile and programs are required" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: `Ты система матчинга образовательной платформы Missio.
Анализируй профиль школьника и список программ.
Для каждой программы выдай:
- score: число от 0 до 100 (совместимость)
- reasons: массив из 2-3 строк (почему подходит, на русском, конкретно)
- warnings: массив строк (что нужно улучшить или чего не хватает)
Отвечай ТОЛЬКО валидным JSON без markdown блоков.`,
      messages: [
        {
          role: "user",
          content: `Профиль школьника: ${JSON.stringify(studentProfile)}

Программы для анализа: ${JSON.stringify(programs)}

Верни JSON: { "matches": [{ "programId": string, "score": number, "reasons": string[], "warnings": string[] }] }`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json({ error: "Failed to compute matches" }, { status: 500 });
  }
}
