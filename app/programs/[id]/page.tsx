"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, MapPin, CheckCircle, AlertCircle, ExternalLink, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Navbar from "@/components/landing/Navbar";
import { getProgramTypeLabel, getProgramTypeBadgeVariant } from "@/lib/utils";

const PROGRAMS: Record<string, {
  id: string; name: string; org: string; type: string; country: string; flag: string;
  daysLeft: number; urgency: string; deadline: string; english: string; grade: string;
  description: string; requirements: string[]; benefits: string[]; steps: string[];
  applicationUrl: string; matchScore: number; matchReasons: string[]; matchWarnings: string[];
  duration: string;
}> = {
  flex: {
    id: "flex", name: "FLEX — Future Leaders Exchange Program", org: "Государственный департамент США", type: "exchange",
    country: "США", flag: "🇺🇸", daysLeft: 21, urgency: "soon", deadline: "15 сентября 2026",
    english: "B2+", grade: "10–11", duration: "1 учебный год",
    description: "FLEX — это академическая программа обмена для школьников из постсоветских государств. Победители живут с американскими семьями и учатся в американских школах в течение одного учебного года. Программа финансируется Государственным департаментом США и полностью покрывает все расходы.",
    requirements: ["Гражданство Казахстана", "10–11 класс на момент подачи", "Уровень английского B2 и выше", "Средний балл не ниже 4.0", "Возраст 15–17 лет"],
    benefits: ["Полное финансирование (перелёт, жильё, питание, учёба)", "Проживание с американской семьёй", "Обучение в американской школе", "Стипендия на личные расходы $125/мес", "Культурный обмен и лидерские программы"],
    steps: ["Регистрация и заполнение анкеты", "Тест по английскому языку (онлайн)", "Написание эссе (500 слов)", "Получение рекомендации от учителя", "Прохождение финального интервью"],
    applicationUrl: "https://americancouncils.org/flex",
    matchScore: 94, matchReasons: ["Уровень английского C1 превышает требование B2+", "Интерес к лидерству совпадает с целями программы", "Высокая успеваемость (НИШ)"],
    matchWarnings: ["Нужно написать эссе 500 слов — могу помочь с AI"],
  },
  deutsche: {
    id: "deutsche", name: "Deutsche Schülerakademie", org: "Bildung & Begabung", type: "summer_school",
    country: "Германия", flag: "🇩🇪", daysLeft: 60, urgency: "ok", deadline: "10 ноября 2026",
    english: "B2", grade: "10–11", duration: "3 недели",
    description: "Deutsche Schülerakademie — элитная летняя академия для одарённых школьников. Три недели интенсивного обучения по научным, гуманитарным и художественным направлениям в Германии вместе с лучшими сверстниками из разных стран.",
    requirements: ["10–11 класс", "Уровень английского или немецкого B2", "Рекомендация от школы", "Сильная академическая успеваемость", "Мотивационное письмо"],
    benefits: ["Полное финансирование проживания и питания", "Субсидированный перелёт", "Обучение у ведущих учёных", "Международная сеть контактов", "Сертификат о прохождении"],
    steps: ["Заполнение онлайн-заявки", "Написание мотивационного письма", "Рекомендация от учителя", "Тест по академическим предметам", "Финальный отбор"],
    applicationUrl: "https://www.deutsche-schuelerakademie.de",
    matchScore: 87, matchReasons: ["Сильная математика соответствует STEM-профилю академии", "GPA НИШ высоко ценится", "Международный опыт олимпиад"],
    matchWarnings: ["Нужна рекомендация от учителя — запроси заранее"],
  },
};

function CountdownTimer({ daysLeft }: { daysLeft: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const totalSec = daysLeft * 86400 - tick;
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const fmt = (n: number) => String(Math.max(0, n)).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 justify-center">
      {[{ v: d, l: "дн" }, { v: h, l: "ч" }, { v: m, l: "мин" }, { v: s, l: "сек" }].map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--text-tertiary)] text-lg">:</span>}
          <div className="text-center">
            <div className="bg-[var(--gray-900)] text-white text-xl font-mono font-bold px-3 py-2 rounded-xl min-w-[52px]">
              {fmt(v)}
            </div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">{l}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const program = PROGRAMS[id];

  if (!program) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Программа не найдена</h1>
            <Link href="/programs"><Button variant="secondary">Вернуться к каталогу</Button></Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-secondary)] pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[var(--border)] px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
              <Link href="/" className="hover:text-[var(--text-secondary)]">Missio</Link>
              <span>/</span>
              <Link href="/programs" className="hover:text-[var(--text-secondary)]">Программы</Link>
              <span>/</span>
              <span className="text-[var(--text-primary)] truncate max-w-xs">{program.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
            <ArrowLeft size={14} />
            Назад к каталогу
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[var(--border)] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-4xl">{program.flag}</span>
                  <Badge variant={getProgramTypeBadgeVariant(program.type)}>
                    {getProgramTypeLabel(program.type).toUpperCase()}
                  </Badge>
                  {program.urgency === "critical" && <Badge variant="red">Срочно</Badge>}
                </div>
                <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
                  {program.name}
                </h1>
                <p className="text-sm text-[var(--text-tertiary)] mb-5">{program.org}</p>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {program.daysLeft} дней до дедлайна</span>
                  <span className="flex items-center gap-1.5"><Globe size={14} /> {program.english}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {program.country} · {program.duration}</span>
                </div>
              </motion.div>

              {/* Description */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                <h2 className="font-semibold text-[var(--text-primary)] mb-3">О программе</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{program.description}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">Требования</h2>
                <ul className="flex flex-col gap-2">
                  {program.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <CheckCircle size={14} className="text-[var(--green-400)] mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">Что включено</h2>
                <ul className="flex flex-col gap-2">
                  {program.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--green-400)] mt-0.5">✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">Как подать заявку</h2>
                <div className="flex flex-col gap-3">
                  {program.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--green-50)] flex items-center justify-center text-xs font-semibold text-[var(--green-600)] shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Match score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-[var(--border)] rounded-2xl p-5 sticky top-24"
              >
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Твоя совместимость</h3>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-secondary)]">Совместимость</span>
                    <span className="text-lg font-bold text-[var(--green-600)]">{program.matchScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--gray-100)] rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${program.matchScore}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-2 rounded-full bg-[var(--green-400)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {program.matchReasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle size={12} className="text-[var(--green-400)] mt-0.5 shrink-0" />
                      {r}
                    </div>
                  ))}
                  {program.matchWarnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-600">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      {w}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="w-full" size="md">Добавить в трекер</Button>
                  <Link href={`/dashboard/chat?q=${encodeURIComponent(`Помоги написать эссе для ${program.name}`)}`}>
                    <Button variant="secondary" className="w-full flex items-center gap-2" size="md">
                      <Bot size={14} />
                      Написать эссе с AI
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Deadline */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Clock size={15} className="text-[var(--text-tertiary)]" />
                  Дедлайн
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{program.deadline}</p>
                <CountdownTimer daysLeft={program.daysLeft} />
                <Button variant="secondary" className="w-full mt-4" size="sm">Добавить напоминание</Button>
              </div>

              {/* Official link */}
              <a href={program.applicationUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="w-full flex items-center gap-2" size="sm">
                  <ExternalLink size={13} />
                  Официальный сайт программы
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
