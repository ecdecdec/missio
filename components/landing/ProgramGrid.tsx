"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROGRAMS as ALL_PROGRAMS } from "@/lib/programs-data";
import { getDaysUntilDeadline, getProgramTypeLabel } from "@/lib/utils";

const FILTERS = ["Все", "Обмен", "Стипендии", "Стажировки", "Олимпиады", "Летние"];
const TYPE_MAP: Record<string, string[]> = {
  "Обмен": ["exchange"],
  "Стипендии": ["scholarship", "grant"],
  "Стажировки": ["internship"],
  "Олимпиады": ["olympiad", "competition"],
  "Летние": ["summer_school", "summer_camp"],
};

// Get featured/popular programs for the landing page
const FEATURED = ALL_PROGRAMS.filter((p) => p.isFeatured || p.isPopular).slice(0, 9);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ProgramGrid() {
  const [active, setActive] = useState("Все");

  const filtered = active === "Все"
    ? ALL_PROGRAMS.filter(p => p.isFeatured || p.isPopular)
    : ALL_PROGRAMS.filter((p) => TYPE_MAP[active]?.includes(p.type));

  const displayPrograms = filtered.slice(0, 6);

  return (
    <section id="programs" className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 02 · {ALL_PROGRAMS.length} программ</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="font-display font-bold tight text-[40px] md:text-[56px]">
            Программы
          </h2>
          <div className="flex gap-0 relative">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`font-mono-c text-[11px] uppercase px-4 py-2 border border-[var(--border)] -ml-px first:ml-0 transition-colors relative ${
                  active === f
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                }`}
              >
                {f}
                {/* Sliding underline indicator */}
                {active === f && (
                  <motion.div
                    layoutId="filter-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1B3BFF]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-[var(--border)]">
          {displayPrograms.map((p, i) => {
            const days = getDaysUntilDeadline(p.deadline);
            const urgencyDot = days <= 7 ? "bg-red-500" : days <= 21 ? "bg-amber-500" : "bg-green-500";

            return (
              <motion.div
                key={p.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
              >
                <Link
                  href={`/programs/${p.id}`}
                  className="border-r border-b border-[var(--border)] p-8 hover:bg-[var(--foreground)] hover:text-[var(--background)] group block transition-all hover:shadow-[inset_0_0_0_2px_#1B3BFF]"
                >
                  <div className="flex justify-between items-start mb-10">
                    <span className="font-mono-c text-[11px] uppercase opacity-60">
                      {getProgramTypeLabel(p.type)}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Pulsing urgency dot */}
                      <span className={`w-2 h-2 rounded-full ${urgencyDot} ${days <= 7 ? "animate-pulse-dot" : ""}`} />
                      <span className={`font-mono-c text-[10px] uppercase ${days <= 7 ? "text-[#1B3BFF]" : "opacity-40"}`}>
                        {days < 0 ? "прошёл" : `${days}д`} →
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold tight text-2xl md:text-3xl mb-2 line-clamp-2">{p.nameRu}</h3>
                  <p className="font-mono-c text-[10px] uppercase opacity-50 mb-4">{p.country} · {p.organization}</p>
                  <p className="font-display text-sm leading-relaxed opacity-70 line-clamp-2">{p.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="border border-t-0 border-[var(--border)] px-8 py-4 flex justify-between items-center">
          <span className="font-mono-c text-[11px] uppercase opacity-60">
            Показано {displayPrograms.length} из {ALL_PROGRAMS.length}
          </span>
          <Link
            href="/programs"
            className="font-mono-c text-[11px] uppercase hover:text-[var(--blue)] transition-colors"
          >
            Смотреть все →
          </Link>
        </div>
      </div>
    </section>
  );
}
