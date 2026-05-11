"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { User, Cpu, Bell } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: User,
    title: "Заполни профиль",
    desc: "Класс, предметы, достижения, язык, интересы. Один раз — и всё.",
    color: "var(--green-400)",
    bg: "var(--green-50)",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI находит твои программы",
    desc: "Claude анализирует тысячи возможностей и выбирает те, где у тебя реальный шанс.",
    color: "var(--blue-400)",
    bg: "#EFF6FF",
  },
  {
    num: "03",
    icon: Bell,
    title: "Получай алерты заранее",
    desc: "WhatsApp, Telegram или Email — выбери сам. За месяц до дедлайна.",
    color: "var(--amber-400)",
    bg: "#FFFBEB",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="label text-[var(--text-tertiary)]">
            Как работает
          </motion.span>
          <motion.h2 variants={fadeUp} className="display-md text-[var(--text-primary)] mt-3">
            Три шага до возможности
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-[var(--border)] -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative z-10 bg-white border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: step.bg }}
                >
                  <step.icon size={22} style={{ color: step.color }} />
                </div>
                <span
                  className="text-3xl font-bold opacity-10 leading-none mt-1"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", color: step.color }}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
