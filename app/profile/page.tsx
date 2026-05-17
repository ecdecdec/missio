"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Settings, Award, Compass, FileText, User } from "lucide-react";
import type { StudentProfileInput } from "@/lib/program-types";

// Stub programs for visual design
const DUMMY_SAVED = [
  {
    id: "flex",
    name: "FLEX (Future Leaders Exchange Program)",
    org: "American Councils",
    type: "Обмен",
    deadline: "12 дней до дедлайна",
  },
  {
    id: "yes-program",
    name: "Kennedy-Lugar Youth Exchange and Study (YES)",
    org: "US Department of State",
    type: "Обмен",
    deadline: "24 дня до дедлайна",
  },
];

function calcCompletion(p: any): number {
  let filled = 0;
  let total = 10;
  if (p.name) filled++;
  if (p.email) filled++;
  if (p.grade) filled++;
  if (p.schoolType || p.schoolName) filled++;
  if (p.city) filled++;
  if (p.englishLevel) filled++;
  if (Array.isArray(p.subjects) && p.subjects.length > 0) filled++;
  if (Array.isArray(p.targetTypes) && p.targetTypes.length > 0) filled++;
  if (Array.isArray(p.targetCountries) && p.targetCountries.length > 0) filled++;
  if (p.whatsapp || p.telegram) filled++;
  return Math.round((filled / total) * 100);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfileInput>({});
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("missio_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile(parsed);
        setCompletion(calcCompletion(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const displayName = profile.name || "Исследователь";
  const displayEmail = profile.email || "hello@poam.me";

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--foreground)]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-[var(--border)] bg-white p-8 md:p-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden"
        >
          {/* Decorative scanline overlay */}
          <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

          <div className="flex items-center gap-6 z-10">
            <div className="w-16 h-16 border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center font-mono-c text-xl font-bold text-[#1B3BFF]">
              {displayName[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2">
                {displayName}
              </h1>
              <p className="font-mono-c text-xs uppercase opacity-60">
                {displayEmail} · {profile.city || "Казахстан"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 z-10 w-full md:w-auto">
            <div className="flex justify-between items-center font-mono-c text-[11px] uppercase mb-1">
              <span>Заполнение профиля</span>
              <span className="text-[#1B3BFF] font-bold">{completion}%</span>
            </div>
            <div className="w-full md:w-48 h-2 border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
              <div 
                className="h-full bg-[#1B3BFF] transition-all duration-700" 
                style={{ width: `${completion}%` }}
              />
            </div>
            <Link
              href="/onboarding"
              className="mt-4 inline-flex items-center justify-center gap-2 font-mono-c text-[11px] uppercase border border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] px-4 py-2.5 transition-colors text-center"
            >
              Редактировать анкету <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-[var(--border)] bg-white p-8 lg:col-span-2 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <User size={18} className="text-[#1B3BFF]" /> Карточка абитуриента
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Учебное заведение</span>
                  <p className="font-display font-bold text-base">{profile.schoolName || "Не указано"}</p>
                </div>
                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Текущий класс</span>
                  <p className="font-display font-bold text-base">{profile.grade || "Не указан"} класс</p>
                </div>
                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Уровень английского</span>
                  <p className="font-display font-bold text-base uppercase text-[#1B3BFF]">{profile.englishLevel || "Не указан"}</p>
                </div>
                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Город проживания</span>
                  <p className="font-display font-bold text-base">{profile.city || "Не указан"}</p>
                </div>
              </div>

              <hr className="border-[var(--border)] my-8" />

              <div className="flex flex-col gap-6">
                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-2">Приоритетные направления</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects && profile.subjects.length > 0 ? (
                      profile.subjects.map((s) => (
                        <span key={s} className="font-mono-c text-[10px] uppercase px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono-c text-[10px] uppercase opacity-40">Направления не выбраны</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-2">Целевые страны</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetCountries && profile.targetCountries.length > 0 ? (
                      profile.targetCountries.map((c) => (
                        <span key={c} className="font-mono-c text-[10px] uppercase px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)]">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono-c text-[10px] uppercase opacity-40">Страны не выбраны</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
              <span className="font-mono-c text-[10px] uppercase opacity-50">Тип профиля: Абитуриент</span>
              <Link href="/dashboard" className="font-mono-c text-[11px] uppercase text-[#1B3BFF] hover:underline flex items-center gap-1">
                Перейти в панель <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-[var(--border)] bg-white p-8 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <Compass size={18} className="text-[#1B3BFF]" /> Статистика поиска
              </h2>

              <div className="flex flex-col gap-6">
                <div className="border-b border-[var(--border)] pb-4">
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Совместимые программы</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-3xl">47</span>
                    <span className="font-mono-c text-[10px] uppercase text-[#1B3BFF]">Найдено AI</span>
                  </div>
                </div>

                <div className="border-b border-[var(--border)] pb-4">
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Выбрано в план</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-3xl">3</span>
                    <span className="font-mono-c text-[10px] uppercase text-[#1B3BFF]">Активные</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono-c text-[10px] uppercase opacity-50 block mb-1">Ближайший дедлайн</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-3xl text-red-500">12</span>
                    <span className="font-mono-c text-[10px] uppercase opacity-50">Дней</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                <p className="font-mono-c text-[10px] uppercase opacity-60 mb-1">AI-Ассистент</p>
                <p className="font-display text-xs leading-relaxed opacity-80">
                  Твой профиль готов на {completion}%. Заполни все разделы анкеты, чтобы повысить точность подбора программ до 94%.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* My Saved Programs (Archival Style Grid) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-[var(--border)] bg-white p-8 md:p-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <Award size={18} className="text-[#1B3BFF]" /> Выбранные программы
            </h2>
            <span className="font-mono-c text-[10px] uppercase opacity-60">Всего сохранено: {DUMMY_SAVED.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-[var(--border)]">
            {DUMMY_SAVED.map((p) => (
              <div key={p.id} className="border-r border-b border-[var(--border)] p-6 hover:bg-[var(--bg-secondary)] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono-c text-[10px] uppercase opacity-50">{p.type}</span>
                  <span className="font-mono-c text-[10px] uppercase text-red-500">{p.deadline}</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-1 group-hover:text-[#1B3BFF] transition-colors">{p.name}</h3>
                <p className="font-mono-c text-[9px] uppercase opacity-40">{p.org}</p>
                <div className="mt-6 flex justify-between items-center">
                  <span className="font-mono-c text-[10px] uppercase opacity-60">Совместимость: 92%</span>
                  <Link href={`/programs`} className="font-mono-c text-[10px] uppercase text-[#1B3BFF] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Подробнее <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
