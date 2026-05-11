import { NextRequest, NextResponse } from "next/server";
import { anthropic, MISSIO_SYSTEM } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { message, studentProfile } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const system = studentProfile
      ? `${MISSIO_SYSTEM}

Профиль студента с которым ты работаешь:
Имя: ${studentProfile.name || "неизвестно"}
Школа: ${studentProfile.school || "неизвестно"}, ${studentProfile.city || "КЗ"}
Класс: ${studentProfile.grade || "неизвестно"}
Предметы: ${studentProfile.subjects?.join(", ") || "не указаны"}
Английский: ${studentProfile.englishLevel || "не указан"}
Достижения: ${studentProfile.achievements?.join(", ") || "не указаны"}
Интересы: ${studentProfile.interests?.join(", ") || "не указаны"}`
      : MISSIO_SYSTEM;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: message }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
