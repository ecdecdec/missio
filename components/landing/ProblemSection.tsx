"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-16"
      >
        <motion.span variants={fadeUp} className="label text-[var(--text-tertiary)]">
          Проблема
        </motion.span>
        <motion.h2 variants={fadeUp} className="display-md text-[var(--text-primary)] mt-3">
          Дедлайн: вчера
        </motion.h2>
        <motion.p variants={fadeUp} className="body-lg text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
          Тысячи школьников узнают о FLEX, Болашаке и MIT PRIMES из случайных постов в чате —
          когда подача уже закрыта.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid md:grid-cols-3 gap-6 items-center"
      >
        {/* Before */}
        <motion.div variants={fadeUp} className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="label text-[var(--text-tertiary)] mb-4">Как сейчас</div>
          <div className="space-y-3">
            {[
              { msg: "кто-нибудь знал про FLEX??", anon: true },
              { msg: "да, подача была вчера 💀", anon: false },
              { msg: "ну всё, в следующем году", anon: true },
            ].map((item, i) => (
              <div key={i} className={`flex gap-2 ${!item.anon ? "flex-row-reverse" : ""}`}>
                <div className="w-6 h-6 rounded-full bg-[var(--gray-100)] shrink-0 flex items-center justify-center text-xs text-[var(--text-tertiary)]">
                  ?
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    item.anon
                      ? "bg-[var(--gray-100)] text-[var(--text-primary)]"
                      : "bg-[var(--gray-200)] text-[var(--text-primary)]"
                  }`}
                >
                  {item.msg}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-2 text-sm font-medium">
            <span className="text-base">⏰</span>
            Дедлайн: вчера
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3"
        >
          <div className="hidden md:flex w-12 h-12 rounded-full bg-[var(--green-50)] items-center justify-center">
            <ArrowRight size={20} className="text-[var(--green-600)]" />
          </div>
          <p className="text-sm text-[var(--text-tertiary)] text-center max-w-xs">
            Missio знает о программах раньше всех и присылает алерт лично тебе
          </p>
        </motion.div>

        {/* After */}
        <motion.div variants={fadeUp} className="bg-white border border-[var(--green-400)]/30 rounded-2xl p-6 shadow-sm">
          <div className="label text-[var(--green-600)] mb-4">С Missio</div>
          <div className="bg-[var(--green-50)] rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-400)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                M
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">FLEX — обмен в США</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Дедлайн через 21 день · Твой шанс: высокий
                </p>
                <button className="mt-2 text-xs font-medium text-[var(--green-600)] underline">
                  Открыть программу →
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[var(--green-50)] text-[var(--green-600)] rounded-xl px-4 py-2 text-sm font-medium">
            <span className="text-base">✅</span>
            Дедлайн: через 21 день
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
