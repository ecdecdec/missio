"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Создай профиль",
    desc: "Три минуты, без лишних вопросов. Класс, предметы, английский, цели.",
    mockup: "📋 Имя: Аружан\n📚 10 класс · НИШ\n🌐 English: B2",
  },
  {
    n: "02",
    title: "Получи подборку",
    desc: "AI-алгоритм анализирует 580+ программ и выбирает те, где у тебя реальный шанс.",
    mockup: "🎯 FLEX — 94%\n🎯 RSI — 87%\n🎯 Bolashak — 91%",
  },
  {
    n: "03",
    title: "Отправь заявку",
    desc: "Шаблоны документов, дедлайны, напоминания — всё в одном месте.",
    mockup: "🔔 FLEX: 14 дней\n📄 Эссе готово ✓\n📬 Заявка отправлена",
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how" className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 01</p>
        <h2 className="font-display font-bold tight text-[40px] md:text-[56px] mb-16">
          Как работает
        </h2>

        <div className="border border-[var(--border)]">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className="grid grid-cols-[72px_1fr] md:grid-cols-[100px_1fr_1.2fr] border-t border-[var(--border)] first:border-t-0 hover:bg-[var(--blue)] hover:text-[var(--background)] group relative"
            >
              {/* Animated blue border on active/hover */}
              <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-[#1B3BFF] transition-all duration-300" />

              <div className="font-mono-c text-xs uppercase p-6 border-r border-current/20 opacity-60">
                {step.n}
              </div>
              <div className="font-display font-bold text-xl md:text-2xl p-6 md:border-r border-current/20">
                {step.title}
              </div>
              <div className="font-mono-c text-[12px] p-6 col-span-2 md:col-span-1 opacity-70 border-t md:border-t-0 border-current/20 leading-relaxed relative">
                {step.desc}
                {/* Mini mockup that appears on hover */}
                <div className="hidden group-hover:block absolute right-6 top-1/2 -translate-y-1/2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] px-3 py-2 text-[10px] font-mono-c leading-relaxed shadow-brutal whitespace-pre opacity-90">
                  {step.mockup}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
