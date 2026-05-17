"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Bell, UserCircle } from "lucide-react";
import Link from "next/link";
import MatchCard, { type Match } from "@/components/dashboard/MatchCard";
import DeadlineTracker from "@/components/dashboard/DeadlineTracker";
import Button from "@/components/ui/Button";
import { PROGRAMS } from "@/lib/programs-data";
import { calculateCompatibilityScore, getDaysUntilDeadline, getUrgencyLevel } from "@/lib/utils";
import type { StudentProfileInput } from "@/lib/program-types";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const PREVIEW_IDS = ["flex", "yes-program", "deutsche-schuelerakademie", "mit-primes", "bolashak-youth", "nu-scholarship"];

function loadProfile(): StudentProfileInput {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("missio_profile");
    return raw ? (JSON.parse(raw) as StudentProfileInput) : {};
  } catch {
    return {};
  }
}

function profileCompletion(p: StudentProfileInput): number {
  let pts = 0;
  const max = 6;
  if (p.name) pts++;
  if (p.schoolType) pts++;
  if (p.city) pts++;
  if (p.grade) pts++;
  if (p.subjects?.length) pts++;
  if (p.englishLevel) pts++;
  return Math.round((pts / max) * 100);
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfileInput>({});

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const displayName = profile.name?.trim() || "Исследователь";

  const matches: Match[] = useMemo(() => {
    return PREVIEW_IDS.map((id) => {
      const p = PROGRAMS.find((x) => x.id === id);
      if (!p) return null;
      const daysLeft = getDaysUntilDeadline(p.deadline);
      return {
        id: p.id,
        name: p.nameRu,
        org: p.organization,
        type: p.type,
        country: p.country,
        countryCode: p.countryCode,
        daysLeft: Math.max(0, daysLeft),
        urgency: getUrgencyLevel(daysLeft),
        score: calculateCompatibilityScore(profile, p),
        reasons: [
          p.type === "exchange" ? "Совпадение по обмену" : "Совпадение по типу программы",
          `Язык: ${p.englishLevel}`,
          `${p.gradeMin}–${p.gradeMax} класс`,
        ],
        english: p.englishLevel,
        duration: p.type === "exchange" ? "1 год" : p.type === "summer_school" ? "2–4 нед." : "по программе",
      };
    }).filter(Boolean) as Match[];
  }, [profile]);

  const completion = profileCompletion(profile);

  return (
    <div className="max-w-5xl p-6 lg:p-8">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-8">
        
        {/* Header Section */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border border-[var(--border)] bg-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
          <div className="z-10">
            <h1 className="font-display font-bold text-3xl tracking-tight text-[var(--foreground)] mb-1">
              Привет, {displayName}
            </h1>
            <p className="font-mono-c text-xs uppercase opacity-60">
              Анкета заполнена на {completion}% · Локальные данные
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-c text-[11px] uppercase z-10">
            <UserCircle size={16} className="text-[#1B3BFF]" />
            <Link href="/onboarding" className="text-[#1B3BFF] hover:underline font-bold">
              Изменить профиль
            </Link>
          </div>
        </motion.div>

        {/* Progress Bar (Monochrome/Blue style) */}
        <div className="w-full max-w-md h-2 border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            className="h-full bg-[#1B3BFF]"
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Matches Hero Card */}
        <motion.div
          variants={fadeUp}
          className="border border-[var(--border)] bg-[var(--foreground)] text-white p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start z-10 relative">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-[#1B3BFF]" />
                <span className="font-mono-c text-[10px] uppercase tracking-wider text-[#1B3BFF] font-bold">Умный поиск POAM</span>
              </div>
              <p className="font-display font-bold text-xl md:text-2xl tracking-tight leading-tight">
                Для тебя подобрано {matches.length} подходящих программ
              </p>
              <p className="mt-2 font-mono-c text-[11px] opacity-70">
                Изучи карточки совпадений и добавь интересные варианты в трекер.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start border border-[rgba(255,255,255,0.2)] px-4 py-2 font-mono-c text-[10px] uppercase">
              <Bell size={12} className="text-[#1B3BFF]" />
              <span className="text-[#1B3BFF] font-bold">Уведомления активны</span>
            </div>
          </div>
        </motion.div>

        {/* Top Matches */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg flex items-center gap-2">🔥 Подходящие варианты</h2>
            <Link href="/dashboard/matches">
              <Button variant="ghost" size="sm" className="group font-mono-c text-[10px] uppercase hover:text-[#1B3BFF]">
                Смотреть все
                <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onView={() => {
                  window.location.href = `/programs/${match.id}`;
                }}
                onAdd={() => {
                  window.location.href = "/dashboard/deadlines";
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Grid Panels */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tracker Card */}
          <motion.div variants={fadeUp} className="border border-[var(--border)] bg-white p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display font-bold text-base">Дедлайн-трекер</h2>
              <Link href="/dashboard/deadlines">
                <Button variant="ghost" size="sm" className="font-mono-c text-[10px] uppercase hover:text-[#1B3BFF]">
                  Перейти
                </Button>
              </Link>
            </div>
            <DeadlineTracker />
          </motion.div>

          {/* AI Helper Card */}
          <motion.div variants={fadeUp} className="border border-[var(--border)] bg-white p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display font-bold text-base">AI-ассистент</h2>
              <Link href="/dashboard/chat">
                <Button variant="ghost" size="sm" className="font-mono-c text-[10px] uppercase hover:text-[#1B3BFF]">
                  Открыть чат
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                "Напиши мотивационное письмо для FLEX",
                "Сравни FLEX и YES: что лучше для меня?",
                "Какие у меня шансы на Болашак Youth?",
                "Что писать в эссе про лидерство?",
              ].map((q) => (
                <Link key={q} href={`/dashboard/chat?q=${encodeURIComponent(q)}`}>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-3 border border-[var(--border)] px-4 py-3 text-left font-mono-c text-xs uppercase transition-all duration-150 hover:border-[#1B3BFF] hover:bg-[var(--bg-secondary)]"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight size={10} className="shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 text-[#1B3BFF]" />
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
