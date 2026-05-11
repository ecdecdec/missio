import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { student, program, score, reasons } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: `Ты пишешь персональные алерты для школьников о грантах и программах.
Тон: дружелюбный, мотивирующий, конкретный. Без лишних слов.
Язык: русский. Максимум 3 абзаца. Начни с имени студента.`,
      messages: [
        {
          role: "user",
          content: `Напиши алерт для ${student.name} (${student.grade} класс, ${student.school}).
Программа: ${program.name}
Организация: ${program.org}
Совместимость: ${score}%
Дедлайн: ${program.deadline}
Причины совместимости: ${reasons.join(", ")}

Алерт должен быть личным, объяснять ПОЧЕМУ эта программа подходит именно этому школьнику.
Заканчивай призывом к действию с ссылкой на дедлайн.`,
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
