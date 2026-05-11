"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Globe, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getProgramTypeLabel, getProgramTypeBadgeVariant } from "@/lib/utils";

const PROGRAMS = [
  {
    id: "flex",
    name: "FLEX — Future Leaders Exchange",
    org: "Государственный департамент США",
    type: "exchange",
    country: "США",
    flag: "🇺🇸",
    deadline: "2026-09-15",
    daysLeft: 21,
    english: "B2+",
    grade: "10–11",
    urgency: "soon",
    featured: true,
  },
  {
    id: "bolashak",
    name: "Болашак Youth",
    org: "Центр Болашак",
    type: "grant",
    country: "Международная",
    flag: "🇰🇿",
    deadline: "2026-09-18",
    daysLeft: 18,
    english: "B1+",
    grade: "9–11",
    urgency: "soon",
    featured: false,
  },
  {
    id: "deutsche",
    name: "Deutsche Schülerakademie",
    org: "Bildung & Begabung",
    type: "summer_school",
    country: "Германия",
    flag: "🇩🇪",
    deadline: "2026-11-10",
    daysLeft: 60,
    english: "B2",
    grade: "10–11",
    urgency: "ok",
    featured: false,
  },
  {
    id: "mit-primes",
    name: "MIT PRIMES",
    org: "Massachusetts Institute of Technology",
    type: "internship",
    country: "США",
    flag: "🇺🇸",
    deadline: "2026-10-25",
    daysLeft: 45,
    english: "C1",
    grade: "9–11",
    urgency: "ok",
    featured: false,
  },
  {
    id: "yes",
    name: "YES — Youth Exchange & Study",
    org: "Государственный департамент США",
    type: "exchange",
    country: "США",
    flag: "🇺🇸",
    deadline: "2026-09-05",
    daysLeft: 3,
    english: "B2",
    grade: "9–11",
    urgency: "critical",
    featured: false,
  },
  {
    id: "science-olympiad",
    name: "Science Olympiad KZ",
    org: "Министерство образования РК",
    type: "olympiad",
    country: "Казахстан",
    flag: "🇰🇿",
    deadline: "2026-09-07",
    daysLeft: 5,
    english: "A2+",
    grade: "8–11",
    urgency: "critical",
    featured: false,
  },
];

const FILTERS = ["Все", "Гранты", "Стажировки", "Олимпиады", "Летние школы", "Обмен"];
const filterMap: Record<string, string> = {
  Все: "all",
  Гранты: "grant",
  Стажировки: "internship",
  Олимпиады: "olympiad",
  "Летние школы": "summer_school",
  Обмен: "exchange",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

function DeadlineBar({ daysLeft, urgency }: { daysLeft: number; urgency: string }) {
  const width = Math.max(10, Math.min(100, (daysLeft / 90) * 100));
  const color =
    urgency === "critical" ? "#EF4444" : urgency === "soon" ? "#F59E0B" : "var(--green-400)";

  return (
    <div className="w-full bg-[var(--gray-100)] rounded-full h-1.5 mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="h-1.5 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

export default function ProgramGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("Все");
  const [signupModal, setSignupModal] = useState(false);

  const filtered =
    filterMap[activeFilter] === "all"
      ? PROGRAMS
      : PROGRAMS.filter((p) => p.type === filterMap[activeFilter]);

  return (
    <section id="programs" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <motion.span variants={fadeUp} className="label text-[var(--text-tertiary)]">
          Живые матчи
        </motion.span>
        <motion.h2 variants={fadeUp} className="display-md text-[var(--text-primary)] mt-3">
          Программы прямо сейчас
        </motion.h2>
        <motion.p variants={fadeUp} className="body-md text-[var(--text-secondary)] mt-3">
          Программы, которые подходят школьникам — обновляется еженедельно
        </motion.p>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="flex flex-wrap gap-2 justify-center mb-10"
      >
        {FILTERS.map((f) => (
          <motion.button
            key={f}
            variants={fadeUp}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === f
                ? "bg-[var(--green-400)] text-white shadow-sm"
                : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filtered.map((program) => (
          <motion.div
            key={program.id}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{program.flag}</span>
                <Badge variant={getProgramTypeBadgeVariant(program.type)}>
                  {getProgramTypeLabel(program.type)}
                </Badge>
              </div>
              {program.urgency === "critical" && (
                <Badge variant="red" className="shrink-0">Срочно</Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-[var(--text-primary)] leading-tight mb-1 line-clamp-2">
              {program.name}
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] mb-4">{program.org}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mb-4">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {program.daysLeft === 0
                  ? "Сегодня"
                  : `${program.daysLeft} дн.`}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={11} />
                {program.english}
              </span>
              <span>{program.grade} класс</span>
            </div>

            {/* Deadline bar */}
            <DeadlineBar daysLeft={program.daysLeft} urgency={program.urgency} />

            {/* CTA */}
            <button
              onClick={() => setSignupModal(true)}
              className="mt-4 w-full py-2.5 text-sm font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--green-50)] hover:border-[var(--green-400)]/30 hover:text-[var(--green-600)] transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:border-[var(--green-400)]/30"
            >
              Узнать совместимость
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* See all */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mt-10"
      >
        <Link href="/programs">
          <Button variant="secondary" size="md" className="group">
            Смотреть все 200+ программ
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      {/* Signup modal */}
      <Modal
        open={signupModal}
        onClose={() => setSignupModal(false)}
        title="Узнай свою совместимость"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Создай профиль бесплатно и получи персональный матч — AI подберёт программы именно для тебя
            с объяснением, почему ты подходишь.
          </p>
          <Link href="/onboarding" onClick={() => setSignupModal(false)}>
            <Button className="w-full" size="lg">
              Создать профиль бесплатно
            </Button>
          </Link>
          <p className="text-center text-xs text-[var(--text-tertiary)]">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[var(--green-600)] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </Modal>
    </section>
  );
}
