"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PostProgramPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [rawText, setRawText] = useState("");
  const [form, setForm] = useState({
    name: "", organization: "", type: "exchange", country: "", deadline: "",
    gradeMin: "8", gradeMax: "11", englishLevel: "", description: "", applicationUrl: "",
  });

  const parseWithAI = async () => {
    if (!rawText.trim()) return;
    setAiParsing(true);
    try {
      const res = await fetch("/api/programs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      setForm((f) => ({
        ...f,
        name: data.name || f.name,
        organization: data.organization || f.organization,
        type: data.type || f.type,
        country: data.country || f.country,
        deadline: data.deadline?.slice(0, 10) || f.deadline,
        gradeMin: String(data.gradeMin || f.gradeMin),
        gradeMax: String(data.gradeMax || f.gradeMax),
        englishLevel: data.englishLevel || f.englishLevel,
        description: data.description || f.description,
        applicationUrl: data.applicationUrl || f.applicationUrl,
      }));
      setStep(2);
    } catch {
      alert("Ошибка при парсинге. Попробуй снова.");
    } finally {
      setAiParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push("/org/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <header className="bg-[var(--gray-900)] text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Missio<span className="text-[var(--green-400)]">•</span>
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/org/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
          <ArrowLeft size={14} />
          Назад к дашборду
        </Link>

        <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Добавить программу
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Опубликуй программу и получи автоматический матчинг со всей базой школьников
        </p>

        {/* Step 1 — AI parse */}
        {step === 1 && (
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 p-3 bg-[var(--green-50)] rounded-xl">
              <Sparkles size={16} className="text-[var(--green-600)]" />
              <p className="text-sm text-[var(--green-700)]">
                Вставь текст о программе — AI автоматически заполнит все поля
              </p>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Вставь текст объявления о программе, пресс-релиз, описание с сайта или любой текст о гранте/стажировке..."
              rows={8}
              className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all resize-none"
            />
            <div className="flex gap-3">
              <Button
                onClick={parseWithAI}
                disabled={!rawText.trim() || aiParsing}
                className="flex-1 flex items-center gap-2"
              >
                {aiParsing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {aiParsing ? "Анализирую..." : "Автозаполнение AI"}
              </Button>
              <Button variant="secondary" onClick={() => setStep(2)}>
                Заполнить вручную
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
            <Input label="Название программы" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="FLEX — Future Leaders Exchange" />
            <Input label="Организация" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required placeholder="American Councils" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Тип программы</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] outline-none">
                  <option value="exchange">Обмен</option>
                  <option value="grant">Грант</option>
                  <option value="internship">Стажировка</option>
                  <option value="olympiad">Олимпиада</option>
                  <option value="summer_school">Летняя школа</option>
                </select>
              </div>
              <Input label="Страна" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="США" />
            </div>

            <Input label="Дедлайн" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Класс (мин)" value={form.gradeMin} onChange={(e) => setForm({ ...form, gradeMin: e.target.value })} placeholder="8" />
              <Input label="Класс (макс)" value={form.gradeMax} onChange={(e) => setForm({ ...form, gradeMax: e.target.value })} placeholder="11" />
            </div>

            <Input label="Уровень английского" value={form.englishLevel} onChange={(e) => setForm({ ...form, englishLevel: e.target.value })} placeholder="B2+" />

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Описание (на русском)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--green-400)] focus:ring-2 focus:ring-[var(--green-400)]/20 outline-none transition-all resize-none"
                placeholder="Краткое описание программы для школьников..."
              />
            </div>

            <Input label="Ссылка на подачу" type="url" value={form.applicationUrl} onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })} placeholder="https://..." />

            <div className="bg-[var(--green-50)] rounded-xl p-4 text-sm text-[var(--green-700)]">
              После публикации AI автоматически рассчитает совместимость для всех 3000+ школьников в базе
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} type="button">Назад</Button>
              <Button type="submit" disabled={loading} className="flex-1 flex items-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Публикую..." : "Опубликовать программу"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
