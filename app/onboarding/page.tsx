"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

/* ── Types ── */
interface StudentProfile {
  name: string;
  schoolType: string;
  city: string;
  grade: string;
  subjects: string[];
  englishLevel: string;
  achievements: string[];
  targetTypes: string[];
  targetCountries: string[];
  horizon: string;
  whatsapp: string;
  telegram: string;
  email: string;
  alertFrequency: string;
}

const INITIAL: StudentProfile = {
  name: "",
  schoolType: "",
  city: "",
  grade: "",
  subjects: [],
  englishLevel: "",
  achievements: [],
  targetTypes: [],
  targetCountries: [],
  horizon: "",
  whatsapp: "",
  telegram: "",
  email: "",
  alertFrequency: "immediate",
};

/* ── Framer variants ── */
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.25 } }),
};

/* ── Helper toggle ── */
function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

/* ── Multi-select chip ── */
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-1.5 ${
        selected
          ? "bg-[var(--green-400)] text-white border-[var(--green-400)] shadow-sm"
          : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--green-400)]/40 hover:text-[var(--text-primary)] bg-white"
      }`}
    >
      {selected && <Check size={12} />}
      {label}
    </button>
  );
}

/* ── Step 1 ── */
function Step1({ data, onChange }: { data: StudentProfile; onChange: (d: Partial<StudentProfile>) => void }) {
  const schoolTypes = ["НИШ", "БИЛ", "Обычная школа", "Другая"];
  const cities = ["Алматы", "Астана", "Шымкент", "Актобе", "Тараз", "Другой"];
  const grades = ["8", "9", "10", "11"];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Как тебя зовут?</label>
        <input
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Аружан"
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Тип школы</label>
        <div className="flex flex-wrap gap-2">
          {schoolTypes.map((s) => (
            <Chip key={s} label={s} selected={data.schoolType === s} onClick={() => onChange({ schoolType: s })} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Город</label>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Chip key={c} label={c} selected={data.city === c} onClick={() => onChange({ city: c })} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Класс</label>
        <div className="flex gap-2">
          {grades.map((g) => (
            <Chip key={g} label={`${g} класс`} selected={data.grade === g} onClick={() => onChange({ grade: g })} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 ── */
function Step2({ data, onChange }: { data: StudentProfile; onChange: (d: Partial<StudentProfile>) => void }) {
  const subjects = ["Математика", "Физика", "Химия", "Биология", "История", "Английский", "Информатика", "Экономика", "Русский", "Казахский", "Искусство", "Музыка"];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const achievements = ["Олимпиады", "Проекты", "Волонтёрство", "Спорт", "Искусство", "Лидерство"];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Сильные предметы</label>
        <p className="text-xs text-[var(--text-tertiary)] mb-3">Выбери все, которые тебе даются хорошо</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Chip key={s} label={s} selected={data.subjects.includes(s)} onClick={() => onChange({ subjects: toggle(data.subjects, s) })} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Уровень английского</label>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <Chip key={l} label={l} selected={data.englishLevel === l} onClick={() => onChange({ englishLevel: l })} />
          ))}
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-2">Не уверен? Выбери примерно</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Достижения</label>
        <div className="flex flex-wrap gap-2">
          {achievements.map((a) => (
            <Chip key={a} label={a} selected={data.achievements.includes(a)} onClick={() => onChange({ achievements: toggle(data.achievements, a) })} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 3 ── */
function Step3({ data, onChange }: { data: StudentProfile; onChange: (d: Partial<StudentProfile>) => void }) {
  const types = [
    { id: "grant", label: "🎓 Гранты на учёбу" },
    { id: "exchange", label: "✈️ Программы обмена" },
    { id: "science", label: "🔬 Научные программы" },
    { id: "internship", label: "💼 Стажировки" },
    { id: "olympiad", label: "🏆 Олимпиады" },
    { id: "summer_school", label: "🌍 Летние школы" },
  ];
  const countries = ["США", "Германия", "Великобритания", "Южная Корея", "Сингапур", "Нидерланды", "Канада", "Австрия"];
  const horizons = ["Этот год", "Следующий год", "Оба"];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Тип программ</label>
        <p className="text-xs text-[var(--text-tertiary)] mb-3">Выбери всё, что интересно</p>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Chip key={t.id} label={t.label} selected={data.targetTypes.includes(t.id)} onClick={() => onChange({ targetTypes: toggle(data.targetTypes, t.id) })} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Страны интереса</label>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => (
            <Chip key={c} label={c} selected={data.targetCountries.includes(c)} onClick={() => onChange({ targetCountries: toggle(data.targetCountries, c) })} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Горизонт планирования</label>
        <div className="flex flex-wrap gap-2">
          {horizons.map((h) => (
            <Chip key={h} label={h} selected={data.horizon === h} onClick={() => onChange({ horizon: h })} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 4 ── */
function Step4({ data, onChange }: { data: StudentProfile; onChange: (d: Partial<StudentProfile>) => void }) {
  const frequencies = [
    { id: "immediate", label: "Сразу как найду" },
    { id: "weekly", label: "Раз в неделю" },
    { id: "important", label: "Только важное" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">WhatsApp</label>
        <input
          value={data.whatsapp}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
          placeholder="+7 777 123 45 67"
          type="tel"
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Telegram</label>
        <input
          value={data.telegram}
          onChange={(e) => onChange({ telegram: e.target.value })}
          placeholder="@username"
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
        <input
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="твой@email.kz"
          type="email"
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Частота алертов</label>
        <div className="flex flex-wrap gap-2">
          {frequencies.map((f) => (
            <Chip key={f.id} label={f.label} selected={data.alertFrequency === f.id} onClick={() => onChange({ alertFrequency: f.id })} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Final screen ── */
function FinalScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-[var(--green-50)] flex items-center justify-center"
      >
        <Check size={36} className="text-[var(--green-600)]" strokeWidth={2.5} />
      </motion.div>

      <div>
        <h2
          className="display-md text-[var(--text-primary)] mb-3"
        >
          Отлично{name ? `, ${name}` : ""}!
        </h2>
        <p className="text-[var(--text-secondary)] body-md">
          Анализирую программы для тебя...
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
        <Loader2 size={16} className="animate-spin" />
        AI подбирает твои матчи
      </div>
    </motion.div>
  );
}

/* ── Main onboarding ── */
const STEP_TITLES = [
  "Расскажи о себе",
  "Твои сильные стороны",
  "Что тебя интересует?",
  "Как тебя найти?",
];

const STEP_SUBTITLES = [
  "Начнём с базовой информации — это займёт 1 минуту",
  "Выбери предметы, уровень английского и достижения",
  "Какие программы и страны тебя интересуют?",
  "Выбери, куда присылать алерты о новых программах",
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<StudentProfile>({
    ...INITIAL,
    email: searchParams.get("email") || "",
  });
  const [done, setDone] = useState(false);

  const update = (patch: Partial<StudentProfile>) => setData((d) => ({ ...d, ...patch }));

  const goNext = () => {
    if (step < 3) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const progress = ((step + 1) / 4) * 100;

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="bg-white rounded-3xl shadow-lg border border-[var(--border)] p-8 w-full max-w-md mx-4">
          <FinalScreen name={data.name} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-[var(--border)] px-4 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-lg font-normal text-[var(--text-primary)]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
              Missio<span className="text-[var(--green-400)]">•</span>
            </Link>
            <span className="text-sm text-[var(--text-tertiary)]">Шаг {step + 1} из 4</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-[var(--gray-100)] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="h-full bg-[var(--green-400)] rounded-full"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Step header */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1
              className="text-3xl text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", letterSpacing: "-0.5px" }}
            >
              {STEP_TITLES[step]}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">{STEP_SUBTITLES[step]}</p>
          </motion.div>

          {/* Step content with slide animation */}
          <div className="overflow-hidden">
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {step === 0 && <Step1 data={data} onChange={update} />}
                {step === 1 && <Step2 data={data} onChange={update} />}
                {step === 2 && <Step3 data={data} onChange={update} />}
                {step === 3 && <Step4 data={data} onChange={update} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 0 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft size={16} />
                Назад
              </button>
            ) : (
              <div />
            )}
            <Button onClick={goNext} size="md" className="group">
              {step < 3 ? "Далее" : "Завершить"}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-secondary)]" />}>
      <OnboardingContent />
    </Suspense>
  );
}
