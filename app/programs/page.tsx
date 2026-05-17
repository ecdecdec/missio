"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Globe,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CountryCodeBadge from "@/components/ui/CountryCodeBadge";
import Button from "@/components/ui/Button";
import { PROGRAMS } from "@/lib/programs-data";
import type { EnglishLevel, Program, ProgramType } from "@/lib/program-types";
import type { StudentProfileInput } from "@/lib/program-types";
import {
  calculateCompatibilityScore,
  getDaysUntilDeadline,
  getProgramTypeLabel,
  getUrgencyLevel,
} from "@/lib/utils";

const PAGE_SIZE = 12;

const TYPES: { id: "all" | ProgramType; label: string }[] = [
  { id: "all", label: "Все типы" },
  { id: "exchange", label: "Обмен" },
  { id: "grant", label: "Гранты" },
  { id: "scholarship", label: "Стипендии" },
  { id: "internship", label: "Стажировки" },
  { id: "olympiad", label: "Олимпиады" },
  { id: "competition", label: "Конкурсы" },
  { id: "summer_school", label: "Летние школы" },
  { id: "leadership", label: "Лидерство" },
  { id: "research", label: "Исследования" },
];

const URGENCY_OPTIONS = [
  { id: "all", label: "Все дедлайны" },
  { id: "critical", label: "Срочно" },
  { id: "soon", label: "Скоро" },
  { id: "ok", label: "Есть время" },
] as const;

const EN_LEVELS: { id: "all" | EnglishLevel; label: string }[] = [
  { id: "all", label: "Любой английский" },
  { id: "not_required", label: "Не требуется" },
  { id: "A2", label: "A2" },
  { id: "B1", label: "B1" },
  { id: "B2", label: "B2" },
  { id: "C1", label: "C1" },
  { id: "C2", label: "C2" },
];

const GRADES = ["all", "8", "9", "10", "11"] as const;

function loadStudent(): StudentProfileInput {
  if (typeof window === "undefined") {
    return { grade: "10", englishLevel: "B2", schoolType: "НИШ", subjects: [], achievements: [], targetTypes: [], targetCountries: [] };
  }
  try {
    const raw = localStorage.getItem("missio_profile");
    if (!raw) return { grade: "10", englishLevel: "B2", schoolType: "НИШ", subjects: [], achievements: [], targetTypes: [], targetCountries: [] };
    return JSON.parse(raw) as StudentProfileInput;
  } catch {
    return { grade: "10", englishLevel: "B2", schoolType: "НИШ", subjects: [], achievements: [], targetTypes: [], targetCountries: [] };
  }
}

const EN_RANK: Record<EnglishLevel, number> = {
  not_required: 0,
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

function englishMeetsFilter(programLevel: EnglishLevel, filter: EnglishLevel | "all"): boolean {
  if (filter === "all") return true;
  return EN_RANK[programLevel] <= EN_RANK[filter];
}

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof TYPES)[number]["id"]>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [englishFilter, setEnglishFilter] = useState<"all" | EnglishLevel>("all");
  const [gradeFilter, setGradeFilter] = useState<(typeof GRADES)[number]>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<(typeof URGENCY_OPTIONS)[number]["id"]>("all");
  const [sort, setSort] = useState<"deadline" | "popularity" | "match">("deadline");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [student, setStudent] = useState<StudentProfileInput>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setStudent(loadStudent());
  }, []);

  const countries = useMemo(() => {
    const s = new Set(PROGRAMS.map((p) => p.country));
    return ["all", ...Array.from(s).sort((a, b) => a.localeCompare(b, "ru"))];
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (typeFilter !== "all") n++;
    if (countryFilter !== "all") n++;
    if (englishFilter !== "all") n++;
    if (gradeFilter !== "all") n++;
    if (urgencyFilter !== "all") n++;
    return n;
  }, [typeFilter, countryFilter, englishFilter, gradeFilter, urgencyFilter]);

  const filtered = useMemo(() => {
    const g = gradeFilter === "all" ? null : parseInt(gradeFilter, 10);
    return PROGRAMS.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.nameRu.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchCountry = countryFilter === "all" || p.country === countryFilter;
      const matchEn = englishMeetsFilter(p.englishLevel, englishFilter);
      const days = getDaysUntilDeadline(p.deadline);
      const urg = getUrgencyLevel(days);
      const matchUrgency = urgencyFilter === "all" || urg === urgencyFilter;
      const matchGrade =
        g === null || (g >= p.gradeMin && g <= p.gradeMax);
      return matchSearch && matchType && matchCountry && matchEn && matchUrgency && matchGrade;
    }).sort((a, b) => {
      if (sort === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sort === "popularity") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.nameRu.localeCompare(b.nameRu, "ru");
      const sa = calculateCompatibilityScore(student, a);
      const sb = calculateCompatibilityScore(student, b);
      return sb - sa;
    });
  }, [search, typeFilter, countryFilter, englishFilter, gradeFilter, urgencyFilter, sort, student]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, countryFilter, englishFilter, gradeFilter, urgencyFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const slice = filtered.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE);

  const FilterPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col gap-6 font-mono-c">
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Тип программы</p>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`border px-3 py-2 text-[10px] uppercase transition-all duration-150 ${
                typeFilter === f.id
                  ? "border-[var(--border)] bg-[#1B3BFF] text-white font-bold"
                  : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-black hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Целевая страна</p>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full border border-[var(--border)] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#1B3BFF] uppercase"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Все страны" : c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Уровень английского</p>
        <div className="flex flex-wrap gap-1.5">
          {EN_LEVELS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setEnglishFilter(f.id)}
              className={`border px-3 py-2 text-[10px] uppercase transition-all duration-150 ${
                englishFilter === f.id
                  ? "border-[var(--border)] bg-black text-white font-bold"
                  : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-black hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Класс обучения</p>
        <div className="flex flex-wrap gap-1.5">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGradeFilter(g)}
              className={`border px-3 py-2 text-[10px] uppercase transition-all duration-150 ${
                gradeFilter === g
                  ? "border-[var(--border)] bg-[#1B3BFF] text-white font-bold"
                  : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-black hover:text-black"
              }`}
            >
              {g === "all" ? "Любой" : `${g} класс`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Срочность дедлайна</p>
        <div className="flex flex-wrap gap-1.5">
          {URGENCY_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setUrgencyFilter(f.id)}
              className={`border px-3 py-2 text-[10px] uppercase transition-all duration-150 ${
                urgencyFilter === f.id
                  ? "border-[var(--border)] bg-black text-white font-bold"
                  : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-black hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          className="w-full bg-black text-white py-3.5 text-xs uppercase font-bold hover:bg-[#1B3BFF] transition-colors"
          onClick={onClose}
        >
          Применить фильтры
        </button>
      )}
    </div>
  );

  const ProgramRow = ({ program }: { program: Program }) => {
    const days = getDaysUntilDeadline(program.deadline);
    const urg = getUrgencyLevel(days);
    const timeText = days < 0 ? "Прошёл" : `${days} дней`;
    const match = calculateCompatibilityScore(student, program);
    return (
      <Link href={`/programs/${program.id}`}>
        <div className="border border-[var(--border)] bg-white p-6 hover:bg-[var(--bg-secondary)] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 font-mono-c text-[10px] uppercase">
              <CountryCodeBadge code={program.countryCode} />
              <span className="opacity-50">{getProgramTypeLabel(program.type)}</span>
              {program.isPopular && <span className="text-[#1B3BFF] font-bold">Популярное</span>}
            </div>
            <h3 className="font-display font-bold text-lg leading-tight group-hover:text-[#1B3BFF] transition-colors">{program.nameRu}</h3>
            <p className="font-mono-c text-[9px] uppercase opacity-40 mt-1">{program.organization}</p>
          </div>
          <div className="flex items-center gap-6 font-mono-c text-[10px] uppercase shrink-0">
            <span className="flex items-center gap-1 opacity-70">
              <Clock size={12} /> {timeText}
            </span>
            <span className="flex items-center gap-1 opacity-70">
              <Globe size={12} /> {program.englishLevel}
            </span>
            <span className="border border-[var(--border)] bg-[var(--bg-secondary)] px-2.5 py-1 text-[#1B3BFF] font-bold">Матч {match}%</span>
          </div>
        </div>
      </Link>
    );
  };

  const ProgramCard = ({ program }: { program: Program }) => {
    const days = getDaysUntilDeadline(program.deadline);
    const urg = getUrgencyLevel(days);
    const timeText = days < 0 ? "Дедлайн прошёл" : `${days} дн.`;
    const match = calculateCompatibilityScore(student, program);
    return (
      <Link href={`/programs/${program.id}`} className="group">
        <div className="border border-[var(--border)] bg-white p-6 hover:bg-[var(--bg-secondary)] transition-colors flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-4 font-mono-c text-[10px] uppercase">
              <div className="flex items-center gap-2">
                <CountryCodeBadge code={program.countryCode} />
                <span className="opacity-50">{getProgramTypeLabel(program.type)}</span>
              </div>
              {urg === "critical" && <span className="text-red-500 font-bold">Срочно</span>}
            </div>
            <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-[#1B3BFF] transition-colors line-clamp-2 min-h-[3rem]">{program.nameRu}</h3>
            <p className="font-mono-c text-[9px] uppercase opacity-40 mb-3">{program.organization}</p>
            <p className="text-xs opacity-70 leading-relaxed line-clamp-3 mb-6">{program.description}</p>
          </div>
          <div className="flex justify-between items-center font-mono-c text-[10px] uppercase pt-4 border-t border-[var(--border)] mt-auto">
            <span className="flex items-center gap-1 opacity-70">
              <Clock size={12} /> {timeText}
            </span>
            <span className="border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[#1B3BFF] font-bold">Матч {match}%</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        
        {/* Title area */}
        <div className="border-b border-[var(--border)] bg-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-end justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
            <div className="z-10">
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3">База программ</h1>
              <p className="font-mono-c text-[11px] uppercase opacity-60 max-w-xl">
                Гранты, обмен, олимпиады и летние школы — с дедлайнами и оценкой совместимости с твоим профилем.
              </p>
            </div>
            <div className="relative w-full md:w-80 z-10 font-mono-c">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск программ..."
                className="w-full border border-[var(--border)] bg-[var(--bg-secondary)] py-3.5 pl-11 pr-4 text-xs uppercase outline-none focus:border-[#1B3BFF] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="mx-auto max-w-[1200px] flex gap-8 px-6 py-12">
          
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 border border-[var(--border)] bg-white p-6">
              <h2 className="font-display font-bold text-lg mb-6 border-b border-[var(--border)] pb-3">Фильтры</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Grid results */}
          <div className="min-w-0 flex-1">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-mono-c text-[10px] uppercase">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 border border-[var(--border)] bg-white px-4 py-2.5 font-bold text-[10px] lg:hidden hover:border-black transition-colors"
                >
                  <SlidersHorizontal size={12} />
                  Фильтры
                  {activeFilterCount > 0 && (
                    <span className="bg-[#1B3BFF] text-white px-1.5 py-0.5 font-bold border border-[#1B3BFF] ml-1">{activeFilterCount}</span>
                  )}
                </button>
                <span className="opacity-60">
                  Найдено программ: <strong className="text-[var(--foreground)] opacity-100">{filtered.length}</strong>
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="border border-[var(--border)] bg-white px-3 py-2 text-[10px] outline-none focus:border-[#1B3BFF] uppercase"
                >
                  <option value="deadline">По дедлайну</option>
                  <option value="popularity">По популярности</option>
                  <option value="match">По совместимости</option>
                </select>
                <div className="flex border border-[var(--border)] bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`p-2 transition-colors ${view === "grid" ? "bg-[var(--bg-secondary)] text-[#1B3BFF]" : "text-[var(--text-tertiary)]"}`}
                    aria-label="Сетка"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`p-2 transition-colors ${view === "list" ? "bg-[var(--bg-secondary)] text-[#1B3BFF]" : "text-[var(--text-tertiary)]"}`}
                    aria-label="Список"
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {slice.length === 0 ? (
              <div className="border border-dashed border-[var(--border)] bg-white px-6 py-20 text-center font-mono-c">
                <p className="mb-2 font-bold uppercase">Ничего не найдено</p>
                <p className="mb-6 text-xs opacity-60">Попробуй изменить параметры фильтров или поисковый запрос.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setCountryFilter("all");
                    setEnglishFilter("all");
                    setGradeFilter("all");
                    setUrgencyFilter("all");
                  }}
                  className="bg-black text-white hover:bg-[#1B3BFF] px-6 py-3 text-xs uppercase font-bold transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 border-l border-t border-[var(--border)]">
                {slice.map((program, index) => (
                  <div key={`${program.id}-${index}`} className="border-r border-b border-[var(--border)]">
                    <ProgramCard program={program} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col border-t border-[var(--border)]">
                {slice.map((program, index) => (
                  <div key={`${program.id}-${index}`} className="border-b border-[var(--border)]">
                    <ProgramRow program={program} />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1.5 font-mono-c text-[10px] uppercase">
                <button
                  type="button"
                  disabled={pageClamped <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border border-[var(--border)] bg-white hover:bg-[var(--bg-secondary)] px-3 py-2 disabled:opacity-40"
                >
                  Назад
                </button>
                <span className="border border-[var(--border)] bg-white px-4 py-2 font-bold text-[#1B3BFF]">
                  Стр. {pageClamped} из {totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageClamped >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border border-[var(--border)] bg-white hover:bg-[var(--bg-secondary)] px-3 py-2 disabled:opacity-40"
                >
                  Вперед
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm bg-white p-6 overflow-y-auto flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h2 className="font-display font-bold text-lg">Фильтры</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 hover:text-[#1B3BFF]"
                >
                  <X size={16} />
                </button>
              </div>
              <FilterPanel onClose={() => setMobileFiltersOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
