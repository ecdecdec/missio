"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const stats = [
  { value: "3,000+", label: "школьников в базе" },
  { value: "94%", label: "точность матчинга" },
  { value: "2 нед", label: "среднее время до первого контакта" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function B2BSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="for-orgs" ref={ref} className="py-24 bg-[var(--gray-900)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="label text-[var(--green-400)]">
            Для организаций
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="display-md text-white mt-3"
          >
            Находите сильных аппликантов в КЗ
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="body-lg text-[var(--gray-400)] mt-4 max-w-2xl mx-auto"
          >
            Фонды и программы платят тысячи долларов за рекрутинг в СНГ. Missio даёт доступ
            к верифицированной базе амбициозных школьников.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-[var(--gray-400)]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: "🎯", title: "Точный таргетинг", desc: "Фильтруй по городу, классу, предметам, уровню английского и достижениям" },
            { icon: "⚡", title: "Быстрый запуск", desc: "Разместите программу и получите первые заявки в течение 48 часов" },
            { icon: "📊", title: "Аналитика", desc: "Охват, клики, заявки — всё в одном дашборде в реальном времени" },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all duration-200"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--gray-400)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center">
          <Link href="/org">
            <Button size="lg" className="bg-white text-[var(--gray-900)] hover:bg-[var(--gray-100)] group">
              Оставить заявку для организаций
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
