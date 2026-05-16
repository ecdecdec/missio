"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Shield, Settings, Palette, Database, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import type { StudentProfileInput } from "@/lib/program-types";

const TABS = [
  { id: "profile", icon: User, label: "Профиль" },
  { id: "notifications", icon: Bell, label: "Уведомления" },
  { id: "privacy", icon: Shield, label: "Приватность" },
  { id: "account", icon: Settings, label: "Аккаунт" },
  { id: "appearance", icon: Palette, label: "Внешний вид" },
  { id: "data", icon: Database, label: "Данные" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState<StudentProfileInput>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("missio_profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const save = () => {
    localStorage.setItem("missio_profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 font-mono-c text-sm outline-none focus:border-[#1B3BFF] transition-colors";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] pt-16">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-c text-[11px] uppercase opacity-60 hover:opacity-100 mb-8 transition-opacity"
          >
            <ArrowLeft size={12} /> Назад
          </Link>

          <h1 className="font-display font-bold tight text-[40px] mb-2">Настройки</h1>
          <p className="font-mono-c text-[11px] uppercase opacity-60 mb-10">
            Управление профилем и уведомлениями
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar tabs */}
            <nav className="md:w-48 flex-shrink-0">
              <div className="flex md:flex-col gap-1 overflow-x-auto">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-left font-mono-c text-xs uppercase transition-all flex-shrink-0 ${
                        tab === t.id
                          ? "bg-[var(--foreground)] text-[var(--background)]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Content */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 border border-[var(--border)] p-8"
            >
              {tab === "profile" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Профиль</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Имя</label>
                      <input className={inputClass} value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Email</label>
                      <input className={inputClass} value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Школа</label>
                      <input className={inputClass} value={profile.schoolName || ""} onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Город</label>
                      <input className={inputClass} value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Класс</label>
                      <input className={inputClass} value={profile.grade || ""} onChange={(e) => setProfile({ ...profile, grade: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Английский</label>
                      <input className={inputClass} value={profile.englishLevel || ""} onChange={(e) => setProfile({ ...profile, englishLevel: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">GPA</label>
                      <input className={inputClass} type="number" step="0.1" value={profile.gpa || ""} onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || undefined })} />
                    </div>
                  </div>
                  <button onClick={save} className="self-start flex items-center gap-2 font-mono-c text-sm uppercase px-6 py-3 bg-[var(--foreground)] text-[var(--background)] hover:bg-[#1B3BFF] transition-colors">
                    <Check size={14} /> Сохранить
                  </button>
                </div>
              )}

              {tab === "notifications" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Уведомления</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">WhatsApp</label>
                      <input className={inputClass} value={profile.whatsapp || ""} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} placeholder="+7 7xx" />
                    </div>
                    <div>
                      <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Telegram</label>
                      <input className={inputClass} value={profile.telegram || ""} onChange={(e) => setProfile({ ...profile, telegram: e.target.value })} placeholder="@username" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Частота: {profile.alertFrequency || "weekly"}</label>
                    <select className={inputClass} value={profile.alertFrequency || "weekly"} onChange={(e) => setProfile({ ...profile, alertFrequency: e.target.value })}>
                      <option value="realtime">Мгновенно</option>
                      <option value="daily">Раз в день</option>
                      <option value="weekly">Раз в неделю</option>
                      <option value="monthly">Раз в месяц</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Мин. балл: {profile.minMatchScore || 70}%</label>
                    <input type="range" min="30" max="95" step="5" value={profile.minMatchScore || 70} onChange={(e) => setProfile({ ...profile, minMatchScore: parseInt(e.target.value) })} className="w-full accent-[#1B3BFF]" />
                  </div>
                  <button onClick={save} className="self-start flex items-center gap-2 font-mono-c text-sm uppercase px-6 py-3 bg-[var(--foreground)] text-[var(--background)] hover:bg-[#1B3BFF] transition-colors">
                    <Check size={14} /> Сохранить
                  </button>
                </div>
              )}

              {tab === "privacy" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Приватность</h2>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1B3BFF]" />
                    <span className="font-mono-c text-sm">Показывать профиль организациям</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1B3BFF]" />
                    <span className="font-mono-c text-sm">Разрешить аналитику использования</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#1B3BFF]" />
                    <span className="font-mono-c text-sm">Скрыть профиль из публичного рейтинга</span>
                  </label>
                </div>
              )}

              {tab === "account" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Аккаунт</h2>
                  <div>
                    <label className="font-mono-c text-[10px] uppercase opacity-60 mb-1 block">Email</label>
                    <input className={inputClass} value={profile.email || ""} readOnly />
                  </div>
                  <p className="font-mono-c text-xs opacity-40">Управление паролем доступно через Supabase Auth</p>
                  <hr className="border-[var(--border)]" />
                  <button className="self-start font-mono-c text-sm uppercase px-6 py-3 border border-red-500/50 text-red-600 hover:bg-red-50 transition-colors">
                    Удалить аккаунт
                  </button>
                </div>
              )}

              {tab === "appearance" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Внешний вид</h2>
                  <p className="font-mono-c text-sm opacity-60">Тёмная тема — скоро</p>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 border-2 border-[var(--foreground)] flex items-center justify-center font-mono-c text-xs bg-[var(--background)]">
                      Светлая
                    </div>
                    <div className="w-20 h-20 border border-[var(--border)] flex items-center justify-center font-mono-c text-xs opacity-30 bg-[#1a1a1a] text-white">
                      Тёмная
                    </div>
                  </div>
                </div>
              )}

              {tab === "data" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display font-bold text-xl mb-2">Данные</h2>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "profile.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="self-start font-mono-c text-sm uppercase px-6 py-3 border border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                  >
                    📥 Экспорт профиля (JSON)
                  </button>
                  <hr className="border-[var(--border)]" />
                  <button
                    onClick={() => {
                      if (confirm("Удалить все данные? Это необратимо.")) {
                        localStorage.removeItem("missio_profile");
                        setProfile({});
                      }
                    }}
                    className="self-start font-mono-c text-sm uppercase px-6 py-3 border border-red-500/50 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🗑 Удалить все данные
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Success toast */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 right-8 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 font-mono-c text-sm flex items-center gap-2"
            >
              <Check size={14} /> Сохранено
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
