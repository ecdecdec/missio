"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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

const WELCOME: Message = {
  role: "assistant",
  content:
    "Привет, Аружан! 👋 Я знаю твой профиль: ты в 11 классе НИШ Алматы, твои сильные стороны — математика и физика, уровень английского C1. Я помогу написать мотивационное письмо, оценить шансы на программу или сравнить варианты. С чего начнём?",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Извини, что-то пошло не так. Попробуй ещё раз." },
      ]);
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
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--green-50)] flex items-center justify-center">
            <Bot size={18} className="text-[var(--green-600)]" />
          </div>
          <div>
            <h1 className="font-semibold text-[var(--text-primary)] text-sm">AI-ассистент Missio</h1>
            <p className="text-xs text-[var(--text-tertiary)]">Powered by Claude · знает твой профиль</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-[var(--green-50)] text-[var(--green-600)]"
                    : "bg-[var(--gray-100)] text-[var(--text-secondary)]"
                }`}
              >
                {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[var(--green-400)] text-white rounded-tr-sm"
                    : "bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--green-50)] flex items-center justify-center shrink-0">
                <Bot size={14} className="text-[var(--green-600)]" />
              </div>
              <div className="bg-white border border-[var(--border)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[var(--text-tertiary)]" />
                <span className="text-sm text-[var(--text-tertiary)]">Печатает...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
          <p className="text-xs text-[var(--text-tertiary)] mb-2">Быстрые вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] hover:bg-[var(--green-50)] hover:border-[var(--green-400)]/30 hover:text-[var(--green-600)] transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-[var(--border)] px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напиши вопрос или запрос..."
            rows={1}
            className="flex-1 resize-none border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: 48 }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="h-12 w-12 rounded-xl p-0 flex items-center justify-center shrink-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] text-center mt-2">
          Enter — отправить · Shift+Enter — перенос строки
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-[var(--bg-secondary)]" />}>
      <ChatContent />
    </Suspense>
  );
}
