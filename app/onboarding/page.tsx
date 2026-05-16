"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, BookOpen, Trophy, FileText, Target, Bell } from "lucide-react";
import { KZ_CITIES, KZ_SCHOOLS, SCHOOL_TYPES } from "@/lib/kz-schools";
import { COUNTRIES } from "@/lib/countries";
import type { StudentProfileInput } from "@/lib/program-types";

const STEPS = [
  { icon: User, title: "Личные данные", subtitle: "Расскажи о себе" },
  { icon: BookOpen, title: "Учёба", subtitle: "Академический профиль" },
  { icon: Trophy, title: "Достижения", subtitle: "Олимпиады и награды" },
  { icon: FileText, title: "Документы", subtitle: "Готовность к подаче" },
  { icon: Target, title: "Цели", subtitle: "Куда хочешь попасть" },
  { icon: Bell, title: "Уведомления", subtitle: "Как оповещать" },
];

const SUBJECTS = [
  "Математика", "Физика", "Информатика", "Химия", "Биология",
  "Английский", "Русский", "Казахский", "История", "География",
  "Литература", "Экономика", "Право", "Философия", "Искусство",
  "Музыка", "Спорт", "Робототехника", "Программирование",
];

const PROGRAM_TYPES = [
  { value: "exchange", label: "Обмен", icon: "🌍" },
  { value: "scholarship", label: "Стипендии", icon: "🎓" },
  { value: "grant", label: "Гранты", icon: "💰" },
  { value: "internship", label: "Стажировки", icon: "💼" },
  { value: "olympiad", label: "Олимпиады", icon: "🏆" },
  { value: "competition", label: "Конкурсы", icon: "🏅" },
  { value: "summer_school", label: "Летние школы", icon: "☀️" },
  { value: "leadership", label: "Лидерство", icon: "🚀" },
  { value: "research", label: "Исследования", icon: "🔬" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [profile, setProfile] = useState<StudentProfileInput>({
    email: searchParams.get("email") || "",
    name: "",
    phone: "",
    schoolType: "",
    schoolName: "",
    city: "",
    grade: "",
    gpa: undefined,
    subjects: [],
    englishLevel: "",
    englishTestType: "",
    englishTestScore: undefined,
    satScore: undefined,
    olympiads: [],
    awards: [],
    achievements: [],
    passportStatus: "",
    hasMotivationLetters: false,
    hasRecommendationLetters: false,
    needsFinancialAid: false,
    visaRejections: false,
    targetTypes: [],
    targetCountries: [],
    studyFields: [],
    timeline: "",
    endGoal: "",
    whatsapp: "",
    telegram: "",
    alertFrequency: "weekly",
    minMatchScore: 70,
  });

  const update = useCallback(
    <K extends keyof StudentProfileInput>(key: K, value: StudentProfileInput[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleArray = useCallback(
    (key: "subjects" | "targetTypes" | "targetCountries" | "awards" | "achievements" | "studyFields", value: string) => {
      setProfile((prev) => {
        const arr = (prev[key] as string[]) || [];
        return {
          ...prev,
          [key]: arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value],
        };
      });
    },
    []
  );

  const next = () => {
    if (step === 0) {
      if (!profile.schoolName || !profile.city) {
        alert("Пожалуйста, выбери школу и город перед продолжением.");
        return;
      }
    }
    
    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // Save profile
      localStorage.setItem("missio_profile", JSON.stringify(profile));
      router.push("/programs");
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const chipClass = (isActive: boolean) =>
    `px-3 py-2 text-sm border border-[var(--border)] cursor-pointer transition-colors font-mono-c ${
      isActive
        ? "bg-[var(--foreground)] text-[var(--background)]"
        : "bg-[var(--background)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
    }`;

  const inputClass =
    "w-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 font-mono-c text-sm outline-none focus:border-[#1B3BFF] transition-colors";

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="font-mono-c text-[11px] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            ← MISSIO
          </button>
          <span className="font-mono-c text-[11px] uppercase opacity-60">
            Шаг {step + 1} из 6
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <div className="h-[2px] bg-[var(--border)]">
            <motion.div
              className="h-full bg-[#1B3BFF]"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / 6) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            />
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="border-b border-[var(--border)] px-6 py-4 overflow-x-auto">
        <div className="max-w-3xl mx-auto flex gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={i}
                onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono-c uppercase transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : isDone
                    ? "opacity-80"
                    : "opacity-40"
                }`}
              >
                {isDone ? <Check size={12} /> : <Icon size={12} />}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2 className="font-display font-bold text-3xl mb-2">{STEPS[step].title}</h2>
              <p className="font-mono-c text-[11px] uppercase opacity-60 mb-10">{STEPS[step].subtitle}</p>

              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Имя</label>
                      <input className={inputClass} value={profile.name || ""} onChange={(e) => update("name", e.target.value)} placeholder="Аружан" />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Email</label>
                      <input className={inputClass} type="email" value={profile.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="aruzhan@email.kz" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Телефон</label>
                    <input className={inputClass} type="tel" value={profile.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="+7 (7xx) xxx-xx-xx" />
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Тип школы</label>
                    <div className="flex flex-wrap gap-2">
                      {SCHOOL_TYPES.map((t) => (
                        <button key={t.value} type="button" className={chipClass(profile.schoolType === t.value)} onClick={() => update("schoolType", t.value)}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Школа</label>
                    <select className={inputClass} value={profile.schoolName || ""} onChange={(e) => update("schoolName", e.target.value)}>
                      <option value="">Выбери школу</option>
                      {KZ_SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Город</label>
                      <select className={inputClass} value={profile.city || ""} onChange={(e) => update("city", e.target.value)}>
                        <option value="">Выбери город</option>
                        {KZ_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Класс</label>
                      <div className="flex gap-2">
                        {["8", "9", "10", "11"].map((g) => (
                          <button key={g} type="button" className={chipClass(profile.grade === g)} onClick={() => update("grade", g)}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">GPA / Средний балл</label>
                      <input className={inputClass} type="number" step="0.1" min="1" max="5" value={profile.gpa || ""} onChange={(e) => update("gpa", parseFloat(e.target.value) || undefined)} placeholder="4.5" />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">SAT (если есть)</label>
                      <input className={inputClass} type="number" min="400" max="1600" value={profile.satScore || ""} onChange={(e) => update("satScore", parseInt(e.target.value) || undefined)} placeholder="1400" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Лучшие предметы</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <button key={s} type="button" className={chipClass(profile.subjects?.includes(s) || false)} onClick={() => toggleArray("subjects", s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Уровень английского</label>
                    <div className="flex gap-2">
                      {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                        <button key={l} type="button" className={chipClass(profile.englishLevel === l)} onClick={() => update("englishLevel", l)}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Тест по английскому</label>
                      <select className={inputClass} value={profile.englishTestType || ""} onChange={(e) => update("englishTestType", e.target.value)}>
                        <option value="">Нет теста</option>
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="Duolingo">Duolingo English Test</option>
                        <option value="Cambridge">Cambridge</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Балл</label>
                      <input className={inputClass} type="number" step="0.5" value={profile.englishTestScore || ""} onChange={(e) => update("englishTestScore", parseFloat(e.target.value) || undefined)} placeholder="7.0" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Олимпиады и конкурсы (по одной через запятую)</label>
                    <textarea className={`${inputClass} min-h-[80px]`} value={profile.achievements?.join(", ") || ""} onChange={(e) => update("achievements", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="IMO — золото 2025, республиканская олимпиада по физике — 1 место" />
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Награды и грамоты</label>
                    <textarea className={`${inputClass} min-h-[80px]`} value={profile.awards?.join(", ") || ""} onChange={(e) => update("awards", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Лучший студент года, грант акимата" />
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Волонтёрские часы</label>
                    <input className={inputClass} type="number" min="0" value={profile.volunteerHours || ""} onChange={(e) => update("volunteerHours", parseInt(e.target.value) || undefined)} placeholder="150" />
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Лидерские позиции</label>
                    <textarea className={`${inputClass} min-h-[60px]`} value={profile.leadershipPositions?.join(", ") || ""} onChange={(e) => update("leadershipPositions", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Президент дебатного клуба, капитан школьной команды по робототехнике" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Статус паспорта</label>
                    <div className="flex flex-wrap gap-2">
                      {["Есть действующий", "Нужно обновить", "Нет паспорта"].map((s) => (
                        <button key={s} type="button" className={chipClass(profile.passportStatus === s)} onClick={() => update("passportStatus", s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={profile.hasMotivationLetters || false} onChange={(e) => update("hasMotivationLetters", e.target.checked)} className="w-4 h-4 accent-[#1B3BFF]" />
                      <span className="font-mono-c text-sm">Есть готовые мотивационные письма</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={profile.hasRecommendationLetters || false} onChange={(e) => update("hasRecommendationLetters", e.target.checked)} className="w-4 h-4 accent-[#1B3BFF]" />
                      <span className="font-mono-c text-sm">Есть рекомендательные письма</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={profile.needsFinancialAid || false} onChange={(e) => update("needsFinancialAid", e.target.checked)} className="w-4 h-4 accent-[#1B3BFF]" />
                      <span className="font-mono-c text-sm">Нужна финансовая помощь / полное покрытие</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={profile.visaRejections || false} onChange={(e) => update("visaRejections", e.target.checked)} className="w-4 h-4 accent-[#1B3BFF]" />
                      <span className="font-mono-c text-sm">Были отказы в визе ранее</span>
                    </label>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Какие программы интересуют</label>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAM_TYPES.map((t) => (
                        <button key={t.value} type="button" className={chipClass(profile.targetTypes?.includes(t.value) || false)} onClick={() => toggleArray("targetTypes", t.value)}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Целевые страны</label>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                      {COUNTRIES.map((c) => (
                        <button key={c.code} type="button" className={chipClass(profile.targetCountries?.includes(c.label) || false)} onClick={() => toggleArray("targetCountries", c.label)}>
                          {c.flag} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Направление учёбы</label>
                    <div className="flex flex-wrap gap-2">
                      {["STEM", "Медицина", "Бизнес", "Гуманитарные", "Искусство", "Право", "IT", "Инженерия"].map((f) => (
                        <button key={f} type="button" className={chipClass(profile.studyFields?.includes(f) || false)} onClick={() => toggleArray("studyFields", f)}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Конечная цель</label>
                    <select className={inputClass} value={profile.endGoal || ""} onChange={(e) => update("endGoal", e.target.value)}>
                      <option value="">Выбери цель</option>
                      <option value="top_uni">Поступление в топ-университет</option>
                      <option value="experience">Международный опыт</option>
                      <option value="career">Карьера за рубежом</option>
                      <option value="research">Научная карьера</option>
                      <option value="startup">Предпринимательство</option>
                      <option value="undecided">Ещё не определился</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">WhatsApp (+7...)</label>
                      <input className={inputClass} type="tel" value={profile.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+7 7xx xxx xx xx" />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Telegram (@username)</label>
                      <input className={inputClass} value={profile.telegram || ""} onChange={(e) => update("telegram", e.target.value)} placeholder="@username" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-2 block">Частота уведомлений</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "realtime", label: "Мгновенно" },
                        { value: "daily", label: "Раз в день" },
                        { value: "weekly", label: "Раз в неделю" },
                        { value: "monthly", label: "Раз в месяц" },
                      ].map((f) => (
                        <button key={f.value} type="button" className={chipClass(profile.alertFrequency === f.value)} onClick={() => update("alertFrequency", f.value)}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Минимальный балл совместимости: {profile.minMatchScore || 70}%</label>
                    <input
                      type="range"
                      min="30"
                      max="95"
                      step="5"
                      value={profile.minMatchScore || 70}
                      onChange={(e) => update("minMatchScore", parseInt(e.target.value))}
                      className="w-full accent-[#1B3BFF]"
                    />
                    <div className="flex justify-between text-[10px] font-mono-c opacity-40">
                      <span>30%</span><span>95%</span>
                    </div>
                  </div>
                  <div className="border border-[var(--border)] p-4 mt-4">
                    <p className="font-mono-c text-[11px] uppercase opacity-60 mb-2">Итого</p>
                    <p className="font-display text-sm leading-relaxed opacity-80">
                      {profile.name || "—"} · {profile.schoolType || "—"} · {profile.grade ? `${profile.grade} класс` : "—"} · {profile.englishLevel || "—"} · {profile.targetTypes?.length || 0} типов · {profile.targetCountries?.length || 0} стран
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <footer className="border-t border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 font-mono-c text-sm uppercase px-6 py-3 border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            <ArrowLeft size={14} /> Назад
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 font-mono-c text-sm uppercase px-6 py-3 bg-[var(--foreground)] text-[var(--background)] border border-[var(--border)] hover:bg-[#1B3BFF] transition-colors"
          >
            {step === 5 ? "Готово" : "Далее"} {step === 5 ? <Check size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><span className="font-mono-c text-sm opacity-40">Загрузка...</span></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
