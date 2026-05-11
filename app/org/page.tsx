"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Target, BarChart3, Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const FEATURES = [
  { icon: Target, title: "Точный таргетинг", desc: "Фильтруй аппликантов по городу, классу, предметам, уровню английского, достижениям и интересам." },
  { icon: Users, title: "Верифицированная база", desc: "3000+ школьников с заполненными профилями — не холодная аудитория, а заинтересованные аппликанты." },
  { icon: BarChart3, title: "Аналитика в реальном времени", desc: "Охват, клики, заявки — всё в одном дашборде. Никаких догадок о эффективности." },
];

const PLANS = [
  {
    name: "Basic",
    price: "Бесплатно",
    desc: "Для начала",
    features: ["1 активная программа", "До 100 матчей", "Базовая аналитика"],
    cta: "Начать бесплатно",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$299/мес",
    desc: "Для активных рекрутеров",
    features: ["До 10 программ", "До 1000 матчей", "Расширенная аналитика", "Прямой доступ к профилям", "Email-поддержка"],
    cta: "Попробовать 14 дней",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Договорная",
    desc: "Для крупных организаций",
    features: ["Неограниченные программы", "Неограниченные матчи", "Белый лейбл", "API-доступ", "Персональный менеджер"],
    cta: "Связаться с нами",
    highlight: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function OrgLandingPage() {
  const [form, setForm] = useState({ orgName: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-[var(--gray-900)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center gap-6">
              <motion.span variants={fadeUp} className="label text-[var(--green-400)]">Для организаций</motion.span>
              <motion.h1 variants={fadeUp} className="display-xl text-white max-w-3xl">
                Найдите лучших школьников Казахстана
              </motion.h1>
              <motion.p variants={fadeUp} className="body-lg text-[var(--gray-400)] max-w-2xl">
                Missio — прямой канал к 3000+ амбициозным школьникам КЗ. Публикуйте программы, находите идеальных аппликантов, получайте заявки.
              </motion.p>
              <motion.div variants={fadeUp} className="flex gap-3 flex-wrap justify-center">
                <a href="#contact">
                  <Button size="lg" className="group">
                    Оставить заявку
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </a>
                <a href="/org/dashboard">
                  <Button size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/15 border">
                    Войти в дашборд
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[var(--green-900)]">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
            {[
              { value: "3,000+", label: "школьников в базе" },
              { value: "94%", label: "точность матчинга" },
              { value: "48 ч", label: "до первых заявок" },
            ].map((s) => (
              <div key={s.value}>
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{s.value}</div>
                <div className="text-sm text-[var(--green-100)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="display-md text-[var(--text-primary)]">Как это работает для вас</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-[var(--border)] rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-[var(--green-50)] rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-[var(--green-600)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-[var(--bg-secondary)] px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="display-md text-[var(--text-primary)] mb-3">Тарифы</h2>
              <p className="body-md text-[var(--text-secondary)]">Начни бесплатно, масштабируй по мере роста</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 flex flex-col gap-4 ${
                    plan.highlight
                      ? "bg-[var(--green-900)] text-white border-2 border-[var(--green-400)] shadow-xl"
                      : "bg-white border border-[var(--border)]"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${plan.highlight ? "text-[var(--green-100)]" : "text-[var(--text-tertiary)]"}`}>{plan.name}</p>
                    <p className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-[var(--text-primary)]"}`} style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{plan.price}</p>
                    <p className={`text-sm ${plan.highlight ? "text-[var(--green-100)]" : "text-[var(--text-secondary)]"}`}>{plan.desc}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-[var(--green-100)]" : "text-[var(--text-secondary)]"}`}>
                        <Check size={13} className={plan.highlight ? "text-[var(--green-400)]" : "text-[var(--green-400)]"} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact">
                    <Button
                      className={`w-full ${plan.highlight ? "bg-white text-[var(--green-900)] hover:bg-[var(--gray-100)]" : ""}`}
                      variant={plan.highlight ? "primary" : "secondary"}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section id="contact" className="py-24 px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="display-md text-[var(--text-primary)] mb-3">Оставьте заявку</h2>
              <p className="body-md text-[var(--text-secondary)]">Свяжемся в течение 24 часов</p>
            </div>

            {submitted ? (
              <div className="bg-[var(--green-50)] border border-[var(--green-100)] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Заявка получена!</h3>
                <p className="text-sm text-[var(--text-secondary)]">Наша команда свяжется с вами в течение 24 часов по адресу {form.email}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
                <Input
                  label="Название организации"
                  value={form.orgName}
                  onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  placeholder="Американские советы"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@organization.org"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Тип организации</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all"
                    required
                  >
                    <option value="">Выберите...</option>
                    <option>Государственный фонд</option>
                    <option>Международная программа обмена</option>
                    <option>Университет</option>
                    <option>НКО / Фонд</option>
                    <option>Корпорация</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Сообщение (опционально)</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Расскажите о вашей программе и целях..."
                    rows={3}
                    className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Отправить заявку
                </Button>
              </form>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
