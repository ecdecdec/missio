import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EnglishLevel, Program, StudentProfileInput } from "@/lib/program-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysUntilDeadline(date: string): number {
  const deadline = new Date(date);
  const now = new Date();
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUrgencyLevel(days: number): "critical" | "soon" | "ok" {
  if (days < 0) return "critical";
  if (days <= 7) return "critical";
  if (days <= 21) return "soon";
  return "ok";
}

export function formatDeadline(date: string): string {
  const days = getDaysUntilDeadline(date);
  if (days < 0) return "Дедлайн прошёл";
  if (days === 0) return "Сегодня";
  if (days === 1) return "Завтра";
  if (days <= 7) return `${days} дней — срочно`;
  if (days <= 21) return `${days} дней`;
  return `${days} дней`;
}

/** @deprecated prefer getUrgencyLevel(getDaysUntilDeadline(date)) for clarity */
export function getDeadlineUrgency(date: string): "critical" | "soon" | "ok" {
  return getUrgencyLevel(getDaysUntilDeadline(date));
}

const EN_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", "not_required"] as const;

function englishRank(level: string | undefined): number {
  if (!level) return 1;
  const u = level.toUpperCase();
  if (u.includes("NOT")) return 0;
  const idx = EN_ORDER.findIndex((x) => u.startsWith(x));
  return idx >= 0 ? idx : 2;
}

function programEnglishRequiredRank(level: EnglishLevel): number {
  const idx = (EN_ORDER as readonly string[]).indexOf(level);
  return idx >= 0 ? idx : 0;
}

export function getProgramTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    grant: "Грант",
    exchange: "Обмен",
    olympiad: "Олимпиада",
    internship: "Стажировка",
    summer_school: "Летняя школа",
    scholarship: "Стипендия",
    competition: "Конкурс",
    summer_camp: "Летний лагерь",
    leadership: "Лидерство",
    research: "Исследование",
  };
  return labels[type] || type;
}

export function getProgramTypeBadgeVariant(
  type: string
): "green" | "amber" | "blue" | "gray" | "coral" {
  const variants: Record<string, "green" | "amber" | "blue" | "gray" | "coral"> = {
    grant: "green",
    exchange: "blue",
    olympiad: "amber",
    internship: "coral",
    summer_school: "gray",
    scholarship: "green",
    competition: "amber",
    summer_camp: "gray",
    leadership: "blue",
    research: "coral",
  };
  return variants[type] || "gray";
}

export function calculateCompatibilityScore(
  student: StudentProfileInput,
  program: Program
): number {
  let score = 55;
  const gradeNum = student.grade ? parseInt(student.grade, 10) : NaN;
  if (!Number.isNaN(gradeNum)) {
    if (gradeNum >= program.gradeMin && gradeNum <= program.gradeMax) score += 18;
    else if (gradeNum + 1 >= program.gradeMin && gradeNum - 1 <= program.gradeMax) score += 8;
    else score -= 10;
  }

  const sRank = englishRank(student.englishLevel);
  const pRank = programEnglishRequiredRank(program.englishLevel);
  if (program.englishLevel === "not_required") score += 10;
  else if (sRank >= pRank) score += 15;
  else if (sRank + 1 >= pRank) score += 5;
  else score -= 12;

  if (student.schoolType === "НИШ" || student.schoolType === "БИЛ") score += 6;
  const stem = ["математика", "физика", "информатика", "химия", "биология"];
  if (
    student.subjects?.some((s) => stem.includes(s.toLowerCase())) &&
    program.tags.some((t) => /stem|it|мат|физ|инф|наук/i.test(t))
  ) {
    score += 4;
  }
  if (student.targetTypes?.includes(program.type)) score += 7;
  if (student.targetCountries?.some((c) => program.country.includes(c) || c === program.country)) score += 5;

  if (program.difficulty === "easy") score += 4;
  if (program.difficulty === "hard") score -= 4;

  return Math.min(99, Math.max(38, Math.round(score)));
}
