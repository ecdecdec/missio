import { NextRequest } from "next/server";

const MISSIO_SYSTEM = `Ты — Missio AI, помощник казахстанских школьников в поиске международных образовательных программ.

Твои возможности:
- Консультация по грантам, обменам, стипендиям, олимпиадам, летним школам
- Помощь с подготовкой документов (мотивационное письмо, CV, рекомендации)
- Информация о дедлайнах и требованиях
- Советы по развитию профиля для поступления

Правила:
- Отвечай на русском языке
- Будь конкретным и полезным
- Не выдумывай информацию о программах — если не уверен, скажи об этом
- Упоминай реальные программы из базы Missio (580+ программ)
- Учитывай профиль ученика при ответе`;

function buildSystem(studentProfile: Record<string, unknown> | null | undefined): string {
  if (!studentProfile || typeof studentProfile !== "object") return MISSIO_SYSTEM;
  const sp = studentProfile as Record<string, unknown>;
  const subjects = Array.isArray(sp.subjects) ? (sp.subjects as string[]).join(", ") : "не указаны";
  const achievements = Array.isArray(sp.achievements) ? (sp.achievements as string[]).join(", ") : "не указаны";
  return `${MISSIO_SYSTEM}

Профиль студента:
Имя: ${String(sp.name || "неизвестно")}
Школа: ${String(sp.schoolType || sp.school || "неизвестно")}, ${String(sp.city || "КЗ")}
Класс: ${String(sp.grade || "неизвестно")}
Предметы: ${subjects}
Английский: ${String(sp.englishLevel || "не указан")}
Достижения: ${achievements}
Цели (типы программ): ${Array.isArray(sp.targetTypes) ? (sp.targetTypes as string[]).join(", ") : "не указаны"}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message : "";
    const studentProfile = body.studentProfile as Record<string, unknown> | undefined;
    const stream = Boolean(body.stream);

    if (!message.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    if (!process.env.AZURE_OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Azure OpenAI API key is not configured" }), { status: 500 });
    }

    const system = buildSystem(studentProfile);

    if (stream) {
      // Azure OpenAI streaming
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, "") || "";
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5.1";
      const apiVersion = process.env.AZURE_API_VERSION || "2025-03-01-preview";
      const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: system },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          max_completion_tokens: 2048,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        return new Response(JSON.stringify({ error: "Azure API streaming failed" }), { status: 502 });
      }

      // Transform SSE stream to plain text stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip unparseable SSE chunks
            }
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // Non-streaming
    const url = `${process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, "") || ""}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5.1"}/chat/completions?api-version=${process.env.AZURE_API_VERSION || "2025-03-01-preview"}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_completion_tokens: 2048,
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Azure API failed" }), { status: 502 });
    }

    const data = await res.json();
    return Response.json({ response: data.choices?.[0]?.message?.content || "" });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}
