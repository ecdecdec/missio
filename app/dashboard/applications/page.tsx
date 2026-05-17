"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Clock, CheckCircle2, Circle, Trophy, Plus } from "lucide-react";
import CountryCodeBadge from "@/components/ui/CountryCodeBadge";

interface ApplicationCard {
  id: string;
  programName: string;
  type: string;
  flag: string;
  daysLeft: number;
  docsComplete: number;
  docsTotal: number;
  status: "planning" | "applying" | "submitted" | "result";
  result?: "accepted" | "rejected" | "waitlist";
}

const INITIAL_CARDS: ApplicationCard[] = [
  { id: "1", programName: "FLEX Program", type: "exchange", flag: "US", daysLeft: 21, docsComplete: 2, docsTotal: 5, status: "planning" },
  { id: "2", programName: "Deutsche Schülerakademie", type: "summer_school", flag: "DE", daysLeft: 60, docsComplete: 1, docsTotal: 4, status: "planning" },
  { id: "3", programName: "Болашак Youth", type: "grant", flag: "KZ", daysLeft: 18, docsComplete: 3, docsTotal: 5, status: "applying" },
  { id: "4", programName: "Science Olympiad KZ", type: "olympiad", flag: "KZ", daysLeft: 5, docsComplete: 5, docsTotal: 5, status: "submitted" },
  { id: "5", programName: "MIT PRIMES", type: "internship", flag: "US", daysLeft: 0, docsComplete: 5, docsTotal: 5, status: "result", result: "accepted" },
];

const COLUMNS = [
  { key: "planning", label: "Планирую", icon: Circle, color: "var(--text-tertiary)" },
  { key: "applying", label: "Пишу заявку", icon: Clock, color: "#F59E0B" },
  { key: "submitted", label: "Отправил", icon: CheckCircle2, color: "#1B3BFF" },
  { key: "result", label: "Результат", icon: Trophy, color: "#1B3BFF" },
] as const;

function ApplicationCardComponent({
  card,
  onMove,
}: {
  card: ApplicationCard;
  onMove: (id: string, dir: "left" | "right") => void;
}) {
  const statusOrder = ["planning", "applying", "submitted", "result"];
  const idx = statusOrder.indexOf(card.status);
  const pct = Math.round((card.docsComplete / card.docsTotal) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-[var(--border)] p-5 hover:border-[var(--foreground)] transition-colors group cursor-grab active:cursor-grabbing font-mono-c"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold">
          <CountryCodeBadge code={card.flag} />
          <span className="opacity-50">
            {card.type === "exchange" ? "Обмен" : card.type === "grant" ? "Грант" : card.type === "olympiad" ? "Олимп." : card.type === "internship" ? "Стажир." : "Летн.ш."}
          </span>
        </div>
        <GripVertical size={12} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="font-display font-bold text-xs text-[var(--foreground)] leading-snug mb-4">{card.programName}</p>

      {/* Docs progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5 uppercase text-[9px]">
          <span className="opacity-45">Документы</span>
          <span className="text-[#1B3BFF] font-bold">{card.docsComplete}/{card.docsTotal}</span>
        </div>
        <div className="w-full h-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5">
          <div className="h-full bg-[#1B3BFF] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Result or deadline */}
      {card.result ? (
        <div className={`text-[10px] uppercase font-bold py-1.5 text-center border ${
          card.result === "accepted" ? "border-[#1B3BFF]/20 bg-[#1B3BFF]/[0.05] text-[#1B3BFF]" :
          card.result === "rejected" ? "border-red-500/20 bg-red-500/[0.05] text-red-500" :
          "border-amber-500/20 bg-amber-500/[0.05] text-amber-600"
        }`}>
          {card.result === "accepted" ? "✅ Принят!" : card.result === "rejected" ? "❌ Отказ" : "⏳ Лист ожидания"}
        </div>
      ) : (
        <p className="text-[9px] uppercase opacity-45">⏰ {card.daysLeft} дней до дедлайна</p>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase">
        {idx > 0 && (
          <button 
            onClick={() => onMove(card.id, "left")} 
            className="flex-1 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors font-bold"
          >
            ←
          </button>
        )}
        {idx < 3 && (
          <button 
            onClick={() => onMove(card.id, "right")} 
            className="flex-1 py-1.5 bg-[#1B3BFF] text-white hover:bg-black transition-colors font-bold"
          >
            →
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function ApplicationsPage() {
  const [cards, setCards] = useState<ApplicationCard[]>(INITIAL_CARDS);

  const moveCard = (id: string, dir: "left" | "right") => {
    const statusOrder: ApplicationCard["status"][] = ["planning", "applying", "submitted", "result"];
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = statusOrder.indexOf(c.status);
        const next = dir === "right" ? idx + 1 : idx - 1;
        if (next < 0 || next >= statusOrder.length) return c;
        return { ...c, status: statusOrder[next] };
      })
    );
  };

  return (
    <div className="p-6 lg:p-10 font-mono-c bg-[var(--bg-secondary)] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[var(--foreground)] mb-2 font-display">
            Мои заявки
          </h1>
          <p className="text-[10px] uppercase opacity-55">Отслеживай прогресс подготовки документов и результаты подач</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-black text-white hover:bg-[#1B3BFF] transition-colors px-5 py-3 text-xs uppercase font-bold border border-transparent">
          <Plus size={14} /> Добавить программу
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-4">
              {/* Column header */}
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)] uppercase text-[10px] font-bold">
                <col.icon size={12} style={{ color: col.color }} />
                <span className="tracking-wider text-[var(--foreground)]">
                  {col.label}
                </span>
                <span className="ml-auto border border-[var(--border)] bg-white px-2 py-0.5 text-[#1B3BFF] font-bold">
                  {colCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-4 flex-1">
                {colCards.map((card) => (
                  <ApplicationCardComponent key={card.id} card={card} onMove={moveCard} />
                ))}
                {colCards.length === 0 && (
                  <div className="border border-dashed border-[var(--border)] p-6 text-center bg-white/50">
                    <p className="text-[9px] uppercase opacity-35">Нет карточек</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
