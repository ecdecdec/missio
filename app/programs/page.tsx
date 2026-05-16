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
import Badge from "@/components/ui/Badge";
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
  getProgramTypeBadgeVariant,
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
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Тип</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                typeFilter === f.id
                  ? "border-[#0F6E56] bg-[#1D9E75] text-white shadow-sm ring-2 ring-[#1D9E75]/30"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Страна</p>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--green-400)]"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Все страны" : c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Английский (минимум для фильтра)</p>
        <div className="flex flex-wrap gap-2">
          {EN_LEVELS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setEnglishFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                englishFilter === f.id
                  ? "border-neutral-800 bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900/25"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Класс</p>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGradeFilter(g)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                gradeFilter === g
                  ? "border-[#0F6E56] bg-[#1D9E75] text-white shadow-sm ring-2 ring-[#1D9E75]/30"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {g === "all" ? "Любой" : `${g} класс`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Срочность</p>
        <div className="flex flex-wrap gap-2">
          {URGENCY_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setUrgencyFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                urgencyFilter === f.id
                  ? "border-neutral-800 bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900/25"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {onClose && (
        <Button type="button" className="w-full lg:hidden" onClick={onClose}>
          Показать результаты
        </Button>
      )}
    </div>
  );

  const ProgramRow = ({ program }: { program: Program }) => {
    const days = getDaysUntilDeadline(program.deadline);
    const urg = getUrgencyLevel(days);
    const dot = urg === "critical" ? "bg-red-500" : urg === "soon" ? "bg-amber-500" : "bg-[var(--green-400)]";
    const match = calculateCompatibilityScore(student, program);
    return (
      <Link href={`/programs/${program.id}`}>
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 transition-all hover:border-[var(--border-hover)] hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-start gap-3">
            <CountryCodeBadge code={program.countryCode} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge variant={getProgramTypeBadgeVariant(program.type)}>{getProgramTypeLabel(program.type)}</Badge>
                {program.isPopular && <Badge variant="amber">Популярное</Badge>}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">{program.nameRu}</h3>
              <p className="text-xs text-[var(--text-tertiary)]">{program.organization}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              <Clock size={14} />
              {days < 0 ? "Прошёл" : `${days} дн.`}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {program.englishLevel}
            </span>
            <span className="rounded-full bg-[var(--green-50)] px-2 py-0.5 text-xs font-semibold text-[var(--green-600)]">{match}%</span>
          </div>
        </div>
      </Link>
    );
  };

  const ProgramCard = ({ program }: { program: Program }) => {
    const days = getDaysUntilDeadline(program.deadline);
    const urg = getUrgencyLevel(days);
    const dot = urg === "critical" ? "bg-red-500" : urg === "soon" ? "bg-amber-500" : "bg-[var(--green-400)]";
    const match = calculateCompatibilityScore(student, program);
    return (
      <Link href={`/programs/${program.id}`}>
        <motion.div
          layout
          className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-md"
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CountryCodeBadge code={program.countryCode} />
              <Badge variant={getProgramTypeBadgeVariant(program.type)}>{getProgramTypeLabel(program.type)}</Badge>
            </div>
            {urg === "critical" && <Badge variant="red">Срочно</Badge>}
          </div>
          <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] font-semibold leading-snug text-[var(--text-primary)]">{program.nameRu}</h3>
          <p className="mb-3 line-clamp-2 text-xs text-[var(--text-tertiary)]">{program.organization}</p>
          <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">{program.description}</p>
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
              <Clock size={10} />
              {days < 0 ? "Дедлайн прошёл" : `${days} дн.`}
            </span>
            <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 font-medium text-[var(--text-primary)]">Матч {match}%</span>
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-secondary)] pt-16">
        <div className="border-b border-[var(--border)] bg-white px-4 py-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="display-md mb-2 text-[var(--text-primary)]">База программ</h1>
            <p className="body-md mb-6 max-w-xl text-[var(--text-secondary)]">
              Гранты, обмен, олимпиады и летние школы — с дедлайнами и оценкой совместимости с твоим профилем.
            </p>
            <div className="relative max-w-lg">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию, организации, тегам..."
                className="w-full rounded-full border border-[var(--border)] bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-white p-5">
              <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Фильтры</h2>
              <FilterPanel />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Фильтры
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[var(--green-400)] px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>
                  )}
                </button>
                <span className="text-sm text-[var(--text-tertiary)]">
                  Найдено: <strong className="text-[var(--text-primary)]">{filtered.length}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--green-400)]"
                >
                  <option value="deadline">По дедлайну</option>
                  <option value="popularity">По популярности</option>
                  <option value="match">По совместимости</option>
                </select>
                <div className="flex rounded-full border border-[var(--border)] bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`rounded-full p-2 ${view === "grid" ? "bg-[var(--bg-secondary)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}
                    aria-label="Сетка"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`rounded-full p-2 ${view === "list" ? "bg-[var(--bg-secondary)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}
                    aria-label="Список"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {slice.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
                <p className="mb-2 font-medium text-[var(--text-primary)]">Ничего не нашли</p>
                <p className="mb-6 text-sm text-[var(--text-secondary)]">Попробуй снять часть фильтров или изменить поисковый запрос.</p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setCountryFilter("all");
                    setEnglishFilter("all");
                    setGradeFilter("all");
                    setUrgencyFilter("all");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {slice.map((program, index) => (
                  <ProgramCard key={`${program.id}-${index}`} program={program} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {slice.map((program, index) => (
                  <ProgramRow key={`${program.id}-${index}`} program={program} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={pageClamped <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-[var(--border)] p-2 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-[var(--text-secondary)]">
                  {pageClamped} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageClamped >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-full border border-[var(--border)] p-2 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                <button type="button" className="rounded-lg p-2 hover:bg-[var(--bg-secondary)]" onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterPanel onClose={() => setMobileFiltersOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
