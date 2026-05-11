import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDeadline(date: string): string {
  const deadline = new Date(date);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Дедлайн прошёл";
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Завтра";
  if (diffDays <= 7) return `${diffDays} дней — срочно`;
  if (diffDays <= 21) return `${diffDays} дней`;
  return `${diffDays} дней`;
}

export function getDeadlineUrgency(date: string): "critical" | "soon" | "ok" {
  const deadline = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return "critical";
  if (diffDays <= 21) return "soon";
  return "ok";
}

export function getProgramTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    grant: "Грант",
    exchange: "Обмен",
    olympiad: "Олимпиада",
    internship: "Стажировка",
    summer_school: "Летняя школа",
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
  };
  return variants[type] || "gray";
}
