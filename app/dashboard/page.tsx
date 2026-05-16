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
  hidden: { opacity: 0, y: 20 },
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

  const displayName = profile.name?.trim() || "Ученик";

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
        <motion.div variants={fadeUp} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-[var(--text-primary)]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
              Привет, {displayName}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">Профиль заполнен на {completion}% · данные с этого устройства</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <UserCircle size={18} />
            <Link href="/onboarding" className="text-[var(--green-600)] hover:underline">
              Изменить профиль
            </Link>
          </div>
        </motion.div>

        <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-[var(--gray-100)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            className="h-full rounded-full bg-[var(--green-400)]"
            transition={{ duration: 0.6 }}
          />
        </div>

        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-gradient-to-r from-[var(--green-900)] to-[var(--green-600)] p-6 text-white"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--green-100)]" />
                <span className="text-sm text-[var(--green-100)]">Новые матчи</span>
              </div>
              <p className="text-lg font-medium" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
                Для тебя подобрано {matches.length} программ
              </p>
              <p className="mt-1 text-sm text-[var(--green-100)]">
                Листай карточки ниже и добавляй интересное в трекер дедлайнов.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2">
              <Bell size={14} className="text-[var(--green-100)]" />
              <span className="text-xs text-[var(--green-100)]">Алерты (MVP): в профиле</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Топ матчи</h2>
            <Link href="/dashboard/matches">
              <Button variant="ghost" size="sm" className="group text-xs">
                Смотреть все
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Дедлайн-трекер</h2>
              <Link href="/dashboard/deadlines">
                <Button variant="ghost" size="sm" className="text-xs">
                  Все
                </Button>
              </Link>
            </div>
            <DeadlineTracker />
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">AI-ассистент</h2>
              <Link href="/dashboard/chat">
                <Button variant="ghost" size="sm" className="text-xs">
                  Открыть
                </Button>
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
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-left text-sm transition-all duration-200 hover:border-[var(--green-400)]/30 hover:bg-[var(--green-50)] hover:text-[var(--green-600)]"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight size={12} className="shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
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
