"use client";

import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Напиши мотивационное письмо для FLEX",
  "Сравни FLEX и YES: что лучше для меня?",
  "Какие у меня шансы на Болашак Youth?",
  "Что писать в эссе про лидерство?",
  "Объясни как подаётся заявка на MIT PRIMES",
];

function loadProfile(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("missio_profile");
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function ChatContent() {
  const searchParams = useSearchParams();
  const profile = useMemo(() => loadProfile(), []);
  const welcome: Message = useMemo(() => {
    const name = typeof profile.name === "string" ? profile.name : "друг";
    const grade = typeof profile.grade === "string" ? profile.grade : "?";
    const school = typeof profile.schoolType === "string" ? profile.schoolType : "школа";
    return {
      role: "assistant",
      content: `Привет, ${name}. Я вижу твой профиль: ${grade} класс, ${school}. Помогу с мотивационными, сравнением программ и дедлайнами. С чего начнём?`,
    };
  }, [profile]);

  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      inputRef.current?.focus();
    }
  }, [searchParams]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const studentProfile = loadProfile();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, studentProfile, stream: true }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Ошибка сети");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && last.content === "") next.pop();
        return [
          ...next,
          { role: "assistant", content: "Извини, не удалось получить ответ. Проверь ключ API или попробуй позже." },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <div className="shrink-0 border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--green-50)]">
            <Bot size={18} className="text-[var(--green-600)]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">AI-ассистент Missio</h1>
            <p className="text-xs text-[var(--text-tertiary)]">Claude · стриминг · профиль с устройства</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "assistant" ? "bg-[var(--green-50)] text-[var(--green-600)]" : "bg-[var(--gray-100)] text-[var(--text-secondary)]"
                }`}
              >
                {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-[var(--green-400)] text-white"
                    : "rounded-tl-sm border border-[var(--border)] bg-white text-[var(--text-primary)]"
                }`}
              >
                {msg.content || (msg.role === "assistant" && loading ? "…" : "")}
              </div>
            </motion.div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--green-50)]">
                <Bot size={14} className="text-[var(--green-600)]" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-white px-4 py-3">
                <Loader2 size={14} className="animate-spin text-[var(--text-tertiary)]" />
                <span className="text-sm text-[var(--text-tertiary)]">Печатает...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <p className="mb-2 text-xs text-[var(--text-tertiary)]">Быстрые вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs transition-all hover:border-[var(--green-400)]/30 hover:bg-[var(--green-50)] hover:text-[var(--green-600)]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-[var(--border)] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напиши вопрос или запрос..."
            rows={1}
            className="max-h-32 min-h-[48px] flex-1 resize-none overflow-y-auto rounded-xl border border-[var(--border)] px-4 py-3 text-sm leading-relaxed outline-none transition-all focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20"
          />
          <Button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl p-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--text-tertiary)]">Enter — отправить · Shift+Enter — новая строка</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex-1 bg-[var(--bg-secondary)]" />}>
      <ChatContent />
    </Suspense>
  );
}
