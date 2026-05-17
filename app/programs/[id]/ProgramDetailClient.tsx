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
import Navbar from "@/components/landing/Navbar";
import CountryCodeBadge from "@/components/ui/CountryCodeBadge";
import type { Program } from "@/lib/program-types";
import type { StudentProfileInput } from "@/lib/program-types";
import {
  calculateCompatibilityScore,
  formatDeadline,
  getDaysUntilDeadline,
  getProgramTypeLabel,
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

  const urgencyColor = urgency === "critical" ? "text-red-500" : urgency === "soon" ? "text-amber-500" : "text-[#1B3BFF]";
  const urgencyBg = urgency === "critical" ? "border-red-500/20 bg-red-500/[0.02]" : urgency === "soon" ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-[#1B3BFF]/20 bg-[#1B3BFF]/[0.02]";
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
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        
        {/* Breadcrumb */}
        <div className="border-b border-[var(--border)] bg-white px-6 py-4 font-mono-c text-[10px] uppercase">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-[#1B3BFF] transition-colors">Главная</Link>
              <span className="opacity-40">/</span>
              <Link href="/programs" className="hover:text-[#1B3BFF] transition-colors">Программы</Link>
              <span className="opacity-40">/</span>
              <span className="opacity-50">{program.nameRu}</span>
            </div>
          </div>
        </div>

        {/* Content container */}
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          
          <Link
            href="/programs"
            className="mb-8 inline-flex items-center gap-2 font-mono-c text-[10px] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={12} />
            Назад к каталогу
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left Content column */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              
              {/* Header Box */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[var(--border)] bg-white p-8 relative"
              >
                <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
                <div className="mb-6 flex flex-wrap items-center gap-3 font-mono-c text-[10px] uppercase">
                  <CountryCodeBadge code={program.countryCode} />
                  <span className="border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 font-bold">
                    {getProgramTypeLabel(program.type)}
                  </span>
                  {urgency === "critical" && <span className="text-red-500 font-bold border border-red-500/20 px-2 py-0.5">Срочно</span>}
                  {program.isFeatured && <span className="text-[#1B3BFF] font-bold border border-[#1B3BFF]/20 px-2 py-0.5">Рекомендованное</span>}
                </div>
                <h1 className="mb-2 font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">
                  {program.nameRu}
                </h1>
                <p className="mb-6 font-mono-c text-[10px] uppercase opacity-40">{program.organization}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-5 font-mono-c text-[10px] uppercase opacity-70">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {formatDeadline(program.deadline)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={12} /> {program.englishLevel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} /> {program.country} · {program.gradeMin}–{program.gradeMax} классы
                  </span>
                </div>
              </motion.div>

              {/* Urgency Box */}
              {daysLeft >= 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`border p-6 flex items-center gap-5 font-mono-c uppercase ${urgencyBg}`}
                >
                  <div className={`text-3xl font-bold ${urgencyColor}`}>
                    {daysLeft}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${urgencyColor}`}>{urgencyText}</p>
                    <p className="text-[9px] opacity-40 mt-0.5">
                      Дедлайн: {formatDeadline(program.deadline)}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* About */}
              <div className="border border-[var(--border)] bg-white p-8">
                <h2 className="font-display font-bold text-lg mb-4 border-b border-[var(--border)] pb-2 uppercase tracking-tight">О программе</h2>
                <p className="text-sm leading-relaxed opacity-85 whitespace-pre-wrap">{program.description}</p>
              </div>

              {/* Requirements */}
              <div className="border border-[var(--border)] bg-white p-8">
                <h2 className="font-display font-bold text-lg mb-4 border-b border-[var(--border)] pb-2 uppercase tracking-tight">Требования к кандидатам</h2>
                <ul className="flex flex-col gap-3 font-mono-c text-xs">
                  {program.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-[#1B3BFF]" />
                      <span className="uppercase opacity-80">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is covered */}
              <div className="border border-[var(--border)] bg-white p-8">
                <h2 className="font-display font-bold text-lg mb-4 border-b border-[var(--border)] pb-2 uppercase tracking-tight">Финансирование и Бенефиты</h2>
                <ul className="flex flex-col gap-3 font-mono-c text-xs">
                  {program.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-[#1B3BFF]" />
                      <span className="uppercase opacity-80">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step flow */}
              <div className="border border-[var(--border)] bg-white p-8">
                <h2 className="font-display font-bold text-lg mb-6 border-b border-[var(--border)] pb-2 uppercase tracking-tight">Этапы подачи заявки</h2>
                <div className="flex flex-col gap-4 font-mono-c uppercase">
                  {[
                    "Проверь дедлайн и список документов на официальном сайте",
                    "Собери рекомендации и выписку с оценками",
                    "Подготовь мотивационное письмо или эссе",
                    "Отправь заявку и отслеживай статус в личном кабинете программы",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--bg-secondary)] text-[10px] font-bold text-[#1B3BFF]">
                        {i + 1}
                      </div>
                      <p className="text-[10px] opacity-80 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar column */}
            <div className="flex flex-col gap-6">
              
              {/* Profile Match Widget */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24 border border-[var(--border)] bg-white p-6 font-mono-c"
              >
                <h3 className="font-display font-bold text-base mb-2 uppercase tracking-tight border-b border-[var(--border)] pb-2">Совместимость</h3>
                <p className="mb-4 text-[9px] uppercase opacity-45">
                  {student.name ? `Для профиля: ${student.name}` : "Заполни анкету в профиле"} — автоматический расчет на базе AI.
                </p>
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between uppercase">
                    <span className="text-[10px] opacity-60">Индекс матча</span>
                    <span className="text-base font-bold text-[#1B3BFF]">{score}%</span>
                  </div>
                  <div className="h-2 w-full border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="h-full bg-[#1B3BFF]"
                    />
                  </div>
                </div>
                
                <div className="mb-6 flex flex-col gap-3 text-[10px] uppercase">
                  {reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5 opacity-80">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-[#1B3BFF]" />
                      <span>{r}</span>
                    </div>
                  ))}
                  {warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-amber-500">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 font-mono-c text-[10px] uppercase">
                  <button 
                    type="button" 
                    className="w-full bg-[#1B3BFF] text-white hover:bg-black py-3 font-bold transition-colors border border-transparent"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Plus size={12} /> Добавить в трекер
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full border border-[var(--border)] hover:bg-[var(--bg-secondary)] py-3 font-bold transition-colors"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Share2 size={12} /> {copied ? "Скопировано!" : "Поделиться"}
                    </span>
                  </button>
                  <Link href={`/dashboard/chat?q=${encodeURIComponent(`Помоги с заявкой на ${program.nameRu}`)}`}>
                    <button
                      type="button"
                      className="w-full border border-dashed border-[#1B3BFF] hover:bg-[#1B3BFF]/5 py-3 font-bold text-[#1B3BFF] transition-colors"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Bot size={12} /> Спросить AI-ассистента
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Similar programs */}
              <div className="border border-[var(--border)] bg-white p-6 font-mono-c">
                <h3 className="font-display font-bold text-base mb-4 uppercase tracking-tight border-b border-[var(--border)] pb-2">Похожие</h3>
                <ul className="flex flex-col gap-3 text-[10px] uppercase">
                  {similar.map((s) => (
                    <li key={s.id}>
                      <Link href={`/programs/${s.id}`} className="group flex items-start justify-between gap-2">
                        <span className="opacity-70 group-hover:opacity-100 group-hover:text-[#1B3BFF] transition-colors">{s.nameRu}</span>
                        <CountryCodeBadge code={s.countryCode} className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Official */}
              <a href={program.applicationUrl} target="_blank" rel="noopener noreferrer">
                <button
                  type="button"
                  className="w-full bg-black text-white hover:bg-[#1B3BFF] transition-colors py-3.5 text-xs font-mono-c uppercase font-bold border border-transparent"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ExternalLink size={12} /> Официальная подача
                  </span>
                </button>
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
