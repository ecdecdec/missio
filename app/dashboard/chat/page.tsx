"use client";

import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";

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
      content: `Привет, ${name}. Я вижу твой профиль: ${grade} класс, ${school}. Помогу подготовить мотивационные эссе, сравнить программы и разобрать дедлайны. С чего начнём?`,
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
          { role: "assistant", content: "Извини, не удалось получить ответ. Попробуй позже." },
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
    <div className="flex h-screen max-h-screen flex-col font-mono-c bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="shrink-0 border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)] bg-[var(--bg-secondary)] text-[#1B3BFF]">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">AI-ассистент POAM</h1>
            <p className="text-[10px] uppercase opacity-55">Персональная языковая модель · Контекст профиля подключен</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                  msg.role === "assistant"
                    ? "border-[#1B3BFF]/20 bg-[#1B3BFF]/[0.05] text-[#1B3BFF]"
                    : "border-[var(--border)] bg-white text-[var(--foreground)]"
                }`}
              >
                {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap border p-4 text-xs leading-relaxed uppercase ${
                  msg.role === "user"
                    ? "border-[#1B3BFF] bg-[#1B3BFF] text-white"
                    : "border-[var(--border)] bg-white text-[var(--foreground)]"
                }`}
              >
                {msg.content || (msg.role === "assistant" && loading ? "…" : "")}
              </div>
            </motion.div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#1B3BFF]/20 bg-[#1B3BFF]/[0.05] text-[#1B3BFF]">
                <Bot size={14} />
              </div>
              <div className="flex items-center gap-3 border border-[var(--border)] bg-white px-4 py-3 text-xs uppercase opacity-75">
                <Loader2 size={12} className="animate-spin text-[#1B3BFF]" />
                <span>Анализирую требования...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="mx-auto w-full max-w-3xl px-6 pb-6">
          <p className="mb-2 text-[10px] uppercase opacity-45">Быстрые запросы к ассистенту:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
                className="border border-[var(--border)] bg-white px-3 py-2 text-[10px] uppercase hover:border-[#1B3BFF] hover:text-[#1B3BFF] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t border-[var(--border)] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Задай вопрос по твоим возможностям..."
            rows={1}
            className="max-h-32 min-h-[48px] flex-1 resize-none border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3.5 text-xs uppercase outline-none focus:border-[#1B3BFF] transition-colors"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-white hover:bg-[#1B3BFF] disabled:opacity-30 transition-colors border border-transparent"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] uppercase opacity-40">Enter — отправить · Shift+Enter — новая строка</p>
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
