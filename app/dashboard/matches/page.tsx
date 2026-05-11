"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MatchCard, { type Match } from "@/components/dashboard/MatchCard";

const ALL_MATCHES: Match[] = [
  { id: "flex", name: "FLEX — Future Leaders Exchange", org: "Гос. департамент США", type: "exchange", country: "США", flag: "🇺🇸", daysLeft: 21, urgency: "soon", score: 94, reasons: ["Высокий английский + интерес к лидерству"], english: "B2+", duration: "1 год" },
  { id: "deutsche", name: "Deutsche Schülerakademie", org: "Bildung & Begabung", type: "summer_school", country: "Германия", flag: "🇩🇪", daysLeft: 60, urgency: "ok", score: 87, reasons: ["Сильная математика + GPA"], english: "B2", duration: "3 нед." },
  { id: "mit-primes", name: "MIT PRIMES", org: "MIT", type: "internship", country: "США", flag: "🇺🇸", daysLeft: 45, urgency: "ok", score: 81, reasons: ["Физика и информатика"], english: "C1", duration: "1 год" },
  { id: "bolashak", name: "Болашак Youth", org: "Центр Болашак", type: "grant", country: "Международная", flag: "🇰🇿", daysLeft: 18, urgency: "soon", score: 76, reasons: ["Академическая успеваемость"], english: "B1+", duration: "по программе" },
  { id: "yes", name: "YES Program", org: "Гос. департамент США", type: "exchange", country: "США", flag: "🇺🇸", daysLeft: 3, urgency: "critical", score: 88, reasons: ["Лидерство + английский"], english: "B2", duration: "1 год" },
  { id: "samsung", name: "Samsung Innovation Campus", org: "Samsung", type: "internship", country: "Южная Корея", flag: "🇰🇷", daysLeft: 35, urgency: "ok", score: 72, reasons: ["Интерес к технологиям"], english: "B1", duration: "6 мес." },
];

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export default function MatchesPage() {
  const [filter, setFilter] = useState<"all" | "exchange" | "grant" | "internship" | "olympiad" | "summer_school">("all");

  const filtered = filter === "all" ? ALL_MATCHES : ALL_MATCHES.filter((m) => m.type === filter);
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Мои матчи
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Программы, которые подобрал AI специально для тебя</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "Все" },
          { key: "exchange", label: "Обмен" },
          { key: "grant", label: "Гранты" },
          { key: "internship", label: "Стажировки" },
          { key: "olympiad", label: "Олимпиады" },
          { key: "summer_school", label: "Летние школы" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-[var(--green-400)] text-white"
                : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {sorted.map((match) => (
          <motion.div key={match.id} variants={fadeUp}>
            <MatchCard match={match} onView={() => {}} onAdd={() => {}} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
