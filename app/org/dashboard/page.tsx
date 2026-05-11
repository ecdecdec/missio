"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MousePointerClick, FileText, TrendingUp, Plus, Filter } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

const STATS = [
  { icon: Users, label: "Охват аппликантов", value: "2,847", change: "+12%", color: "var(--green-600)", bg: "var(--green-50)" },
  { icon: MousePointerClick, label: "Кликов по программе", value: "342", change: "+8%", color: "var(--blue-400)", bg: "#EFF6FF" },
  { icon: FileText, label: "Заявок получено", value: "67", change: "+23%", color: "var(--amber-400)", bg: "#FFFBEB" },
  { icon: TrendingUp, label: "Конверсия", value: "19.6%", change: "+3.2%", color: "var(--coral-400)", bg: "#FFF7ED" },
];

const APPLICANTS = [
  { name: "Аружан К.", school: "НИШ Алматы", grade: 11, english: "C1", score: 94, city: "Алматы" },
  { name: "Данияр М.", school: "БИЛ Астана", grade: 10, english: "B2", score: 87, city: "Астана" },
  { name: "Айгерим Т.", school: "НИШ Шымкент", grade: 11, english: "B2", score: 82, city: "Шымкент" },
  { name: "Нурлан С.", school: "НИШ Астана", grade: 10, english: "C1", score: 79, city: "Астана" },
  { name: "Малика О.", school: "Обычная школа", grade: 11, english: "B1", score: 71, city: "Алматы" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

export default function OrgDashboard() {
  const [gradeFilter, setGradeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const filtered = APPLICANTS.filter((a) => {
    const matchGrade = gradeFilter === "all" || a.grade === parseInt(gradeFilter);
    const matchCity = cityFilter === "all" || a.city === cityFilter;
    return matchGrade && matchCity;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="bg-[var(--gray-900)] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            Missio<span className="text-[var(--green-400)]">•</span>
          </Link>
          <span className="text-[var(--gray-400)] text-sm">/ Для организаций</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/org/post">
            <Button size="sm" className="flex items-center gap-2">
              <Plus size={14} />
              Добавить программу
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            Дашборд организации
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">American Councils Kazakhstan · FLEX Program 2026</p>
        </div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white border border-[var(--border)] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-[var(--green-600)] bg-[var(--green-50)] px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
                {stat.value}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Applicants table */}
        <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-semibold text-[var(--text-primary)]">База аппликантов</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-[var(--text-tertiary)]" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs focus:border-[var(--green-400)] outline-none"
              >
                <option value="all">Все классы</option>
                <option value="10">10 класс</option>
                <option value="11">11 класс</option>
              </select>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs focus:border-[var(--green-400)] outline-none"
              >
                <option value="all">Все города</option>
                <option value="Алматы">Алматы</option>
                <option value="Астана">Астана</option>
                <option value="Шымкент">Шымкент</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  {["Имя", "Школа", "Класс", "Английский", "Совместимость", "Контакт"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--green-50)] flex items-center justify-center text-xs font-semibold text-[var(--green-600)]">
                          {a.name[0]}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{a.school}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{a.grade}</td>
                    <td className="px-4 py-3">
                      <Badge variant={a.english.startsWith("C") ? "green" : "blue"}>{a.english}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--gray-100)] rounded-full">
                          <div className="h-1.5 bg-[var(--green-400)] rounded-full" style={{ width: `${a.score}%` }} />
                        </div>
                        <span className="text-sm font-medium text-[var(--green-600)]">{a.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-[var(--green-600)] hover:underline font-medium">
                        Связаться →
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
