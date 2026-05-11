"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Clock, CheckCircle2, Circle, Trophy, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getProgramTypeBadgeVariant } from "@/lib/utils";

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
  { id: "1", programName: "FLEX Program", type: "exchange", flag: "🇺🇸", daysLeft: 21, docsComplete: 2, docsTotal: 5, status: "planning" },
  { id: "2", programName: "Deutsche Schülerakademie", type: "summer_school", flag: "🇩🇪", daysLeft: 60, docsComplete: 1, docsTotal: 4, status: "planning" },
  { id: "3", programName: "Болашак Youth", type: "grant", flag: "🇰🇿", daysLeft: 18, docsComplete: 3, docsTotal: 5, status: "applying" },
  { id: "4", programName: "Science Olympiad KZ", type: "olympiad", flag: "🇰🇿", daysLeft: 5, docsComplete: 5, docsTotal: 5, status: "submitted" },
  { id: "5", programName: "MIT PRIMES", type: "internship", flag: "🇺🇸", daysLeft: 0, docsComplete: 5, docsTotal: 5, status: "result", result: "accepted" },
];

const COLUMNS = [
  { key: "planning", label: "Планирую", icon: Circle, color: "var(--text-tertiary)" },
  { key: "applying", label: "Пишу заявку", icon: Clock, color: "var(--amber-400)" },
  { key: "submitted", label: "Отправил", icon: CheckCircle2, color: "var(--blue-400)" },
  { key: "result", label: "Результат", icon: Trophy, color: "var(--green-400)" },
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
      className="bg-white border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-hover)] hover:shadow-sm transition-all group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{card.flag}</span>
          <Badge variant={getProgramTypeBadgeVariant(card.type)} className="text-xs">
            {card.type === "exchange" ? "Обмен" : card.type === "grant" ? "Грант" : card.type === "olympiad" ? "Олимп." : card.type === "internship" ? "Стажир." : "Летн.ш."}
          </Badge>
        </div>
        <GripVertical size={14} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="text-sm font-medium text-[var(--text-primary)] leading-snug mb-3">{card.programName}</p>

      {/* Docs progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--text-tertiary)]">Документы</span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">{card.docsComplete}/{card.docsTotal}</span>
        </div>
        <div className="w-full h-1 bg-[var(--gray-100)] rounded-full">
          <div className="h-1 bg-[var(--green-400)] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Result or deadline */}
      {card.result ? (
        <div className={`text-xs font-medium px-2.5 py-1 rounded-lg text-center ${
          card.result === "accepted" ? "bg-[var(--green-50)] text-[var(--green-600)]" :
          card.result === "rejected" ? "bg-red-50 text-red-600" :
          "bg-amber-50 text-amber-700"
        }`}>
          {card.result === "accepted" ? "✅ Принят!" : card.result === "rejected" ? "❌ Отказ" : "⏳ Лист ожидания"}
        </div>
      ) : (
        <p className="text-xs text-[var(--text-tertiary)]">⏰ {card.daysLeft} дней до дедлайна</p>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {idx > 0 && (
          <button onClick={() => onMove(card.id, "left")} className="flex-1 py-1 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            ← Назад
          </button>
        )}
        {idx < 3 && (
          <button onClick={() => onMove(card.id, "right")} className="flex-1 py-1 text-xs bg-[var(--green-400)] text-white rounded-lg hover:bg-[var(--green-600)] transition-colors">
            Вперёд →
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
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            Мои заявки
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Отслеживай прогресс по каждой программе</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--green-400)] text-white rounded-xl text-sm font-medium hover:bg-[var(--green-600)] transition-colors">
          <Plus size={16} />
          Добавить программу
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-96">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                <col.icon size={14} style={{ color: col.color }} />
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  {col.label}
                </span>
                <span className="ml-auto bg-[var(--gray-100)] text-[var(--text-tertiary)] text-xs px-1.5 py-0.5 rounded-full">
                  {colCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 flex-1">
                {colCards.map((card) => (
                  <ApplicationCardComponent key={card.id} card={card} onMove={moveCard} />
                ))}
                {colCards.length === 0 && (
                  <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center">
                    <p className="text-xs text-[var(--text-tertiary)]">Перетащи карточку сюда</p>
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
