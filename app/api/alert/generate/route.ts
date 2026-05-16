import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

type Urgency = "critical" | "soon" | "ok";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const student = body.student as { name?: string; grade?: string; school?: string } | undefined;
    const program = body.program as { name?: string; org?: string; deadline?: string } | undefined;
    const score = typeof body.score === "number" ? body.score : 0;
    const reasons: string[] = Array.isArray(body.reasons) ? body.reasons.map(String) : [];
    const urgency = (body.urgency as Urgency) || "ok";

    if (!student?.name || !program?.name) {
      return NextResponse.json({ error: "student and program required" }, { status: 400 });
    }

    const tone =
      urgency === "critical"
        ? "Тон: очень срочно, короткие фразы, без паники но с ясным дедлайном."
        : urgency === "soon"
          ? "Тон: деловой но дружеский, напомни про время на документы."
          : "Тон: спокойный, вдохновляющий, с фокусом на подготовке.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: `Ты пишешь персональные алерты для школьников Казахстана о грантах и программах.
${tone}
Язык: разговорный русский. 2–3 коротких абзаца. Начни с имени. Без канцелярита.`,
      messages: [
        {
          role: "user",
          content: `Напиши алерт для ${student.name} (${student.grade || "?"} класс, ${student.school || "школа"}).
Программа: ${program.name}
Организация: ${program.org || ""}
Совместимость: ${score}%
Дедлайн: ${program.deadline || "уточняется"}
Срочность: ${urgency}
Причины совместимости: ${reasons.join(", ") || "общий хороший профиль"}

Объясни, почему программа «про него/неё», и чем заняться в ближайшие дни.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ alert: text });
  } catch (error) {
    console.error("Alert generate error:", error);
    return NextResponse.json({ error: "Failed to generate alert" }, { status: 500 });
  }
}
