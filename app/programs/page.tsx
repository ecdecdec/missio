"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Globe } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getProgramTypeLabel, getProgramTypeBadgeVariant } from "@/lib/utils";

const ALL_PROGRAMS = [
  { id: "flex", name: "FLEX — Future Leaders Exchange", org: "Гос. департамент США", type: "exchange", country: "США", flag: "🇺🇸", daysLeft: 21, urgency: "soon", english: "B2+", grade: "10–11", description: "Академический обмен в США на один учебный год для старшеклассников." },
  { id: "yes", name: "YES — Youth Exchange & Study", org: "Гос. департамент США", type: "exchange", country: "США", flag: "🇺🇸", daysLeft: 3, urgency: "critical", english: "B2", grade: "9–11", description: "Программа обмена для молодёжи из мусульманских стран." },
  { id: "deutsche", name: "Deutsche Schülerakademie", org: "Bildung & Begabung", type: "summer_school", country: "Германия", flag: "🇩🇪", daysLeft: 60, urgency: "ok", english: "B2", grade: "10–11", description: "Элитная летняя школа в Германии для одарённых школьников." },
  { id: "mit-primes", name: "MIT PRIMES", org: "MIT", type: "internship", country: "США", flag: "🇺🇸", daysLeft: 45, urgency: "ok", english: "C1", grade: "9–11", description: "Исследовательская программа MIT для старшеклассников по математике и CS." },
  { id: "bolashak", name: "Болашак Youth", org: "Центр Болашак", type: "grant", country: "Международная", flag: "🇰🇿", daysLeft: 18, urgency: "soon", english: "B1+", grade: "9–11", description: "Грант для лучших студентов Казахстана на международные программы." },
  { id: "science-olympiad", name: "Science Olympiad KZ", org: "Министерство образования РК", type: "olympiad", country: "Казахстан", flag: "🇰🇿", daysLeft: 5, urgency: "critical", english: "A2+", grade: "8–11", description: "Республиканская олимпиада по естественным наукам." },
  { id: "samsung", name: "Samsung Innovation Campus", org: "Samsung Electronics", type: "internship", country: "Южная Корея", flag: "🇰🇷", daysLeft: 35, urgency: "ok", english: "B1", grade: "10–11", description: "Образовательная программа по AI и цифровым технологиям." },
  { id: "kazguu-olympiad", name: "Олимпиада КАЗГЮУ", org: "КАЗГЮУ", type: "olympiad", country: "Казахстан", flag: "🇰🇿", daysLeft: 30, urgency: "ok", english: "A2", grade: "9–11", description: "Олимпиада по праву и обществознанию с грантами победителям." },
];

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const filtered = ALL_PROGRAMS.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.org.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchUrgency = urgencyFilter === "all" || p.urgency === urgencyFilter;
    return matchSearch && matchType && matchUrgency;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-secondary)] pt-16">
        {/* Header */}
        <div className="bg-white border-b border-[var(--border)] py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="display-md text-[var(--text-primary)] mb-3">
              База программ
            </h1>
            <p className="body-md text-[var(--text-secondary)] mb-6 max-w-xl">
              200+ грантов, стажировок и программ обмена для школьников Казахстана
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск программ..."
                className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all bg-white"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "Все типы" },
                { key: "exchange", label: "Обмен" },
                { key: "grant", label: "Гранты" },
                { key: "internship", label: "Стажировки" },
                { key: "olympiad", label: "Олимпиады" },
                { key: "summer_school", label: "Летние школы" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    typeFilter === f.key
                      ? "bg-[var(--green-400)] text-white"
                      : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 ml-auto">
              {[
                { key: "all", label: "Все дедлайны" },
                { key: "critical", label: "Срочно" },
                { key: "soon", label: "Скоро" },
                { key: "ok", label: "Есть время" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setUrgencyFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    urgencyFilter === f.key
                      ? "bg-[var(--gray-900)] text-white"
                      : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-[var(--text-tertiary)] mb-6">Найдено: {filtered.length} программ</p>

          {/* Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((program) => (
              <motion.div key={program.id} variants={fadeUp}>
                <Link href={`/programs/${program.id}`}>
                  <div className="bg-white border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{program.flag}</span>
                      <Badge variant={getProgramTypeBadgeVariant(program.type)}>
                        {getProgramTypeLabel(program.type)}
                      </Badge>
                      {program.urgency === "critical" && <Badge variant="red">Срочно</Badge>}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)] leading-snug text-sm mb-1 line-clamp-2">
                        {program.name}
                      </h3>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">{program.org}</p>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
                      <span className={`flex items-center gap-1 ${program.urgency === "critical" ? "text-red-500" : program.urgency === "soon" ? "text-amber-600" : "text-[var(--green-600)]"}`}>
                        <Clock size={10} />
                        {program.daysLeft} дней
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={10} />
                        {program.english}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
