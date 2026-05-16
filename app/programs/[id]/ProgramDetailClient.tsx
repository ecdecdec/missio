"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Globe,
  MapPin,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Bot,
  Share2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Navbar from "@/components/landing/Navbar";
import CountryCodeBadge from "@/components/ui/CountryCodeBadge";
import type { Program } from "@/lib/program-types";
import type { StudentProfileInput } from "@/lib/program-types";
import {
  calculateCompatibilityScore,
  formatDeadline,
  getDaysUntilDeadline,
  getProgramTypeLabel,
  getProgramTypeBadgeVariant,
  getUrgencyLevel,
} from "@/lib/utils";

const DEFAULT_STUDENT: StudentProfileInput = {
  name: "Гость",
  schoolType: "НИШ",
  grade: "10",
  englishLevel: "B2",
  subjects: ["Математика", "Английский"],
  achievements: [],
  targetTypes: ["exchange"],
  targetCountries: ["США"],
};

function loadStudent(): StudentProfileInput {
  if (typeof window === "undefined") return DEFAULT_STUDENT;
  try {
    const raw = localStorage.getItem("missio_profile");
    if (!raw) return DEFAULT_STUDENT;
    const p = JSON.parse(raw) as Record<string, unknown>;
    return {
      name: typeof p.name === "string" ? p.name : DEFAULT_STUDENT.name,
      schoolType: typeof p.schoolType === "string" ? p.schoolType : DEFAULT_STUDENT.schoolType,
      grade: typeof p.grade === "string" ? p.grade : DEFAULT_STUDENT.grade,
      englishLevel: typeof p.englishLevel === "string" ? p.englishLevel : DEFAULT_STUDENT.englishLevel,
      subjects: Array.isArray(p.subjects) ? (p.subjects as string[]) : DEFAULT_STUDENT.subjects,
      achievements: Array.isArray(p.achievements) ? (p.achievements as string[]) : [],
      targetTypes: Array.isArray(p.targetTypes) ? (p.targetTypes as string[]) : DEFAULT_STUDENT.targetTypes,
      targetCountries: Array.isArray(p.targetCountries) ? (p.targetCountries as string[]) : DEFAULT_STUDENT.targetCountries,
      city: typeof p.city === "string" ? p.city : undefined,
    };
  } catch {
    return DEFAULT_STUDENT;
  }
}

function buildMatchCopy(program: Program, score: number): { reasons: string[]; warnings: string[] } {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const g = program.gradeMin <= 10 && program.gradeMax >= 10;
  if (g) reasons.push("Класс попадает в допустимый диапазон программы");
  if (program.englishLevel === "not_required" || program.englishLevel === "A2")
    reasons.push("Требования по английскому умеренные или не обязательны");
  else reasons.push("Совпадение профиля с типом программы и тегами");
  if (program.difficulty === "hard") warnings.push("Высокая конкуренция — готовь эссе и рекомендации заранее");
  if (score < 70) warnings.push("Нужно усилить язык или предметный профиль под требования");
  return { reasons: reasons.slice(0, 3), warnings };
}

export default function ProgramDetailClient({
  program,
  similar,
}: {
  program: Program;
  similar: Program[];
}) {
  const [student, setStudent] = useState<StudentProfileInput>(DEFAULT_STUDENT);
  useEffect(() => {
    setStudent(loadStudent());
  }, []);

  const daysLeft = useMemo(() => getDaysUntilDeadline(program.deadline), [program.deadline]);
  const urgency = getUrgencyLevel(daysLeft);
  const score = useMemo(() => calculateCompatibilityScore(student, program), [student, program]);
  const { reasons, warnings } = useMemo(() => buildMatchCopy(program, score), [program, score]);

  const urgencyColor = urgency === "critical" ? "text-red-600" : urgency === "soon" ? "text-amber-600" : "text-[var(--green-600)]";
  const urgencyBg = urgency === "critical" ? "bg-red-50" : urgency === "soon" ? "bg-amber-50" : "bg-green-50";
  const urgencyText = daysLeft < 0 ? "Дедлайн прошёл" : urgency === "critical" ? `${daysLeft} дней! Подавай скорее` : urgency === "soon" ? `${daysLeft} дней до дедлайна` : `${daysLeft} дней — есть время`;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-secondary)] pt-16">
        <div className="border-b border-[var(--border)] bg-white px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-tertiary)]">
              <Link href="/" className="hover:text-[var(--text-secondary)]">
                Missio
              </Link>
              <span>/</span>
              <Link href="/programs" className="hover:text-[var(--text-secondary)]">
                Программы
              </Link>
              <span>/</span>
              <span className="max-w-xs truncate text-[var(--text-primary)]">{program.nameRu}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link
            href="/programs"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            Назад к каталогу
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[var(--border)] bg-white p-6"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <CountryCodeBadge code={program.countryCode} className="h-10 min-w-[2.5rem] text-xs" />
                  <Badge variant={getProgramTypeBadgeVariant(program.type)}>
                    {getProgramTypeLabel(program.type).toUpperCase()}
                  </Badge>
                  {urgency === "critical" && <Badge variant="red">Срочно</Badge>}
                  {program.isFeatured && <Badge variant="amber">Избранное</Badge>}
                </div>
                <h1
                  className="mb-1 text-2xl font-semibold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {program.nameRu}
                </h1>
                <p className="mb-5 text-sm text-[var(--text-tertiary)]">{program.organization}</p>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {formatDeadline(program.deadline)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={14} /> {program.englishLevel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {program.country} · {program.gradeMin}–{program.gradeMax} класс
                  </span>
                </div>
              </motion.div>

              {/* Urgency banner */}
              {daysLeft >= 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className={`rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4 ${urgencyBg}`}
                >
                  <div className={`text-3xl font-bold ${urgencyColor}`}>
                    {daysLeft}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${urgencyColor}`}>{urgencyText}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Дедлайн: {formatDeadline(program.deadline)}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-3 font-semibold text-[var(--text-primary)]">О программе</h2>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{program.description}</p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Требования</h2>
                <ul className="flex flex-col gap-2">
                  {program.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-[var(--green-400)]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Что включено</h2>
                <ul className="flex flex-col gap-2">
                  {program.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-[var(--green-400)]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Этапы подачи</h2>
                <div className="flex flex-col gap-3">
                  {[
                    "Проверь дедлайн и список документов на официальном сайте",
                    "Собери рекомендации и выписку с оценками",
                    "Подготовь мотивационное письмо или эссе",
                    "Отправь заявку и отслеживай статус в личном кабинете программы",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--green-50)] text-xs font-semibold text-[var(--green-600)]">
                        {i + 1}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24 rounded-2xl border border-[var(--border)] bg-white p-5"
              >
                <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Совместимость с профилем</h3>
                <p className="mb-3 text-xs text-[var(--text-tertiary)]">
                  {student.name ? `Для ${student.name}` : "Заполни онбординг"} — оценка эвристическая, не официальный отбор.
                </p>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Индекс матча</span>
                    <span className="text-lg font-bold text-[var(--green-600)]">{score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--gray-100)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="h-2 rounded-full bg-[var(--green-400)]"
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  {reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--green-400)]" />
                      {r}
                    </div>
                  ))}
                  {warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-600">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      {w}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="flex w-full items-center justify-center gap-2" size="md" type="button">
                    <Plus size={14} />
                    Добавить в трекер
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex w-full items-center justify-center gap-2"
                    size="md"
                    type="button"
                    onClick={handleShare}
                  >
                    <Share2 size={14} />
                    {copied ? "Скопировано!" : "Скопировать ссылку"}
                  </Button>
                  <Link href={`/dashboard/chat?q=${encodeURIComponent(`Помоги с заявкой на ${program.nameRu}`)}`}>
                    <Button variant="ghost" className="flex w-full items-center justify-center gap-2" size="md" type="button">
                      <Bot size={14} />
                      Спросить AI
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                <h3 className="mb-2 font-semibold text-[var(--text-primary)]">Похожие программы</h3>
                <ul className="flex flex-col gap-3">
                  {similar.map((s) => (
                    <li key={s.id}>
                      <Link href={`/programs/${s.id}`} className="group flex items-start justify-between gap-2 text-sm">
                        <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{s.nameRu}</span>
                        <CountryCodeBadge code={s.countryCode} className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <a href={program.applicationUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full gap-2" size="md" type="button">
                  <ExternalLink size={14} />
                  Официальная подача
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
