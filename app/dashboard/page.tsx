"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Bell } from "lucide-react";
import Link from "next/link";
import MatchCard, { type Match } from "@/components/dashboard/MatchCard";
import DeadlineTracker from "@/components/dashboard/DeadlineTracker";
import Button from "@/components/ui/Button";

const MATCHES: Match[] = [
  {
    id: "flex",
    name: "FLEX — Future Leaders Exchange Program",
    org: "Государственный департамент США",
    type: "exchange",
    country: "США",
    flag: "🇺🇸",
    daysLeft: 21,
    urgency: "soon",
    score: 94,
    reasons: ["Высокий английский + интерес к лидерству"],
    english: "B2+",
    duration: "1 год",
  },
  {
    id: "deutsche",
    name: "Deutsche Schülerakademie",
    org: "Bildung & Begabung",
    type: "summer_school",
    country: "Германия",
    flag: "🇩🇪",
    daysLeft: 60,
    urgency: "ok",
    score: 87,
    reasons: ["Сильная математика + высокий GPA"],
    english: "B2",
    duration: "3 нед.",
  },
  {
    id: "mit-primes",
    name: "MIT PRIMES",
    org: "MIT",
    type: "internship",
    country: "США",
    flag: "🇺🇸",
    daysLeft: 45,
    urgency: "ok",
    score: 81,
    reasons: ["Физика + информатика на высоком уровне"],
    english: "C1",
    duration: "1 год",
  },
  {
    id: "bolashak",
    name: "Болашак Youth",
    org: "Центр Болашак",
    type: "grant",
    country: "Международная",
    flag: "🇰🇿",
    daysLeft: 18,
    urgency: "soon",
    score: 76,
    reasons: ["Академическая успеваемость + гражданская активность"],
    english: "B1+",
    duration: "по программе",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-8">

        {/* Welcome card */}
        <motion.div
          variants={fadeUp}
          className="bg-gradient-to-r from-[var(--green-900)] to-[var(--green-600)] rounded-2xl p-6 text-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-[var(--green-100)]" />
                <span className="text-sm text-[var(--green-100)]">Персональный дайджест</span>
              </div>
              <h1 className="text-2xl font-medium mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
                Привет, Аружан 👋
              </h1>
              <p className="text-sm text-[var(--green-100)]">
                Для тебя <strong className="text-white">4 новых программы</strong>. Ближайший дедлайн — через 18 дней.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 shrink-0">
              <Bell size={14} className="text-[var(--green-100)]" />
              <span className="text-xs text-[var(--green-100)]">Алерты включены</span>
            </div>
          </div>
        </motion.div>

        {/* Top matches */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Топ матчи</h2>
            <Link href="/dashboard/matches">
              <Button variant="ghost" size="sm" className="text-xs group">
                Смотреть все
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {MATCHES.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onView={() => window.open(`/programs/${match.id}`, "_blank")}
                onAdd={() => alert(`Добавлено: ${match.name}`)}
              />
            ))}
          </div>
        </motion.div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Deadline tracker */}
          <motion.div variants={fadeUp} className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Дедлайн-трекер</h2>
              <Link href="/dashboard/deadlines">
                <Button variant="ghost" size="sm" className="text-xs">Все</Button>
              </Link>
            </div>
            <DeadlineTracker />
          </motion.div>

          {/* Quick AI actions */}
          <motion.div variants={fadeUp} className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">AI-ассистент</h2>
              <Link href="/dashboard/chat">
                <Button variant="ghost" size="sm" className="text-xs">Открыть</Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {[
                "Напиши мотивационное письмо для FLEX",
                "Сравни FLEX и YES: что лучше для меня?",
                "Какие у меня шансы на Болашак Youth?",
                "Что писать в эссе про лидерство?",
              ].map((q) => (
                <Link key={q} href={`/dashboard/chat?q=${encodeURIComponent(q)}`}>
                  <button className="w-full text-left text-sm px-4 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--green-50)] hover:border-[var(--green-400)]/30 hover:text-[var(--green-600)] transition-all duration-200 group flex items-center justify-between gap-2">
                    <span className="truncate">{q}</span>
                    <ArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
