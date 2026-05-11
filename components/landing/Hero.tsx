"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function AlertMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Background card (parallax) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.5, y: 8, rotate: 2 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="absolute inset-0 bg-white border border-[var(--border)] rounded-2xl shadow-sm"
        style={{ transform: "rotate(3deg) translateY(12px)" }}
      />

      {/* Main alert card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="relative bg-white border border-[var(--border)] rounded-2xl p-5 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--green-400)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--green-600)]">Новый матч</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
            <Clock size={10} />
            <span className="text-xs font-medium">18 дней</span>
          </div>
        </div>

        {/* Program info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🇺🇸</span>
            <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-medium">Обмен</span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] text-lg leading-tight">FLEX</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Программа обмена для старшеклассников в США</p>
        </div>

        {/* Match score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--text-secondary)]">Совместимость</span>
            <span className="text-sm font-semibold text-[var(--green-600)]">94%</span>
          </div>
          <div className="w-full bg-[var(--gray-100)] rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="bg-[var(--green-400)] h-2 rounded-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 text-xs font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
            Подробнее
          </button>
          <button className="flex-1 py-2 text-xs font-medium bg-[var(--green-400)] text-white rounded-xl hover:bg-[var(--green-600)] transition-colors flex items-center justify-center gap-1">
            <Star size={10} />
            Добавить
          </button>
        </div>
      </motion.div>

      {/* Second card hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="mt-3 bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🇩🇪</span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Deutsche Schülerakademie</p>
              <p className="text-xs text-[var(--text-tertiary)]">60 дней · Совместимость 87%</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-[var(--green-50)] rounded-full flex items-center justify-center">
            <ArrowRight size={14} className="text-[var(--green-600)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/onboarding?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--green-50)] via-white to-white pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[var(--green-400)] opacity-5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: "translate(30%, -30%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Left column — 60% */}
          <div className="lg:col-span-3">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* Label */}
              <motion.div variants={fadeUp}>
                <span className="label text-[var(--green-600)] flex items-center gap-2">
                  <Zap size={12} className="fill-current" />
                  AI-матчинг для школьников Казахстана
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="display-xl text-[var(--text-primary)]"
              >
                Гранты и стажировки,{" "}
                <em className="text-[var(--green-400)] not-italic" style={{ fontStyle: "italic" }}>
                  которые ждут тебя
                </em>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="body-lg text-[var(--text-secondary)] max-w-xl"
              >
                Заполни профиль один раз — узнай о подходящих программах за месяц до дедлайна.
                Не случайно в чате, а персонально.
              </motion.p>

              {/* Email form */}
              <motion.form
                variants={fadeUp}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="твой@email.kz"
                  required
                  className="flex-1 border border-[var(--border)] rounded-full px-5 py-3 text-sm bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
                />
                <Button type="submit" size="md" pulse className="whitespace-nowrap group">
                  Получить доступ
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </motion.form>

              {/* Social proof */}
              <motion.p variants={fadeUp} className="text-sm text-[var(--text-tertiary)]">
                Бесплатно ·{" "}
                <span className="text-[var(--text-secondary)] font-medium">312 школьников</span>{" "}
                уже ждут первых матчей
              </motion.p>
            </motion.div>
          </div>

          {/* Right column — 40% */}
          <div className="lg:col-span-2">
            <AlertMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
