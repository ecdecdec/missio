"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Calendar, ClipboardList, Bot, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Панель", badge: null },
  { href: "/dashboard/matches", icon: Star, label: "Совпадения", badge: "12" },
  { href: "/dashboard/deadlines", icon: Calendar, label: "Дедлайны", badge: null },
  { href: "/dashboard/applications", icon: ClipboardList, label: "Мои заявки", badge: null },
  { href: "/dashboard/chat", icon: Bot, label: "AI-Консультант", badge: null },
];

interface SidebarProps {
  student?: { name: string; grade: string; school: string; profileComplete?: number };
}

export default function Sidebar({ student: studentProp }: SidebarProps) {
  const pathname = usePathname();
  const [student, setStudent] = useState(studentProp);

  useEffect(() => {
    if (studentProp) return;
    try {
      const raw = localStorage.getItem("missio_profile");
      if (raw) {
        const p = JSON.parse(raw);
        setStudent({
          name: p.name || "Исследователь",
          grade: p.grade || "?",
          school: p.schoolType || p.schoolName || "Школа",
          profileComplete: calcCompletion(p),
        });
      }
    } catch { /* ignore */ }
  }, [studentProp]);

  const name = student?.name || "Исследователь";
  const grade = student?.grade || "?";
  const school = student?.school || "Школа";
  const profileComplete = student?.profileComplete ?? 0;

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[var(--border)] flex flex-col min-h-screen sticky top-0 font-mono-c">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--border)]">
        <Link href="/" className="font-display font-bold text-lg tracking-tight text-[var(--foreground)] uppercase hover:text-[#1B3BFF] transition-colors">
          POAM
        </Link>
      </div>

      {/* User */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center font-bold text-[#1B3BFF]">
            {name[0]?.toUpperCase() || "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate uppercase">{name}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] truncate uppercase">{grade} класс · {school}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border border-transparent text-[11px] uppercase transition-all duration-150 group",
                active
                  ? "bg-[#1B3BFF] text-white border-[var(--border)] font-bold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]"
              )}
            >
              <Icon size={14} className={active ? "text-white" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"} />
              <span className="flex-1 tracking-wider">{label}</span>
              {badge && (
                <span className={cn(
                  "text-[9px] px-1.5 py-0.5 min-w-[20px] text-center font-bold font-mono border",
                  active ? "bg-white text-[#1B3BFF] border-white" : "bg-[var(--bg-secondary)] text-[#1B3BFF] border-[var(--border)]"
                )}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-auto pt-4 border-t border-[var(--border)] flex flex-col gap-1.5">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 border border-transparent text-[11px] uppercase text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)] transition-all"
          >
            <User size={14} className="text-[var(--text-tertiary)]" />
            <span>Мой профиль</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 border border-transparent text-[11px] uppercase text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)] transition-all"
          >
            <Settings size={14} className="text-[var(--text-tertiary)]" />
            <span>Настройки</span>
          </Link>
        </div>
      </nav>

      {/* Profile progress */}
      <div className="px-6 py-6 border-t border-[var(--border)]">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Анкета</p>
            <span className="text-[10px] font-bold text-[#1B3BFF]">{profileComplete}%</span>
          </div>
          <div className="w-full h-1.5 border border-[var(--border)] bg-white overflow-hidden">
            <div
              className="h-full bg-[#1B3BFF] transition-all duration-500"
              style={{ width: `${profileComplete}%` }}
            />
          </div>
          {profileComplete < 100 && (
            <Link href="/onboarding" className="text-[10px] uppercase font-bold text-[#1B3BFF] hover:underline mt-3 block">
              Заполнить профиль →
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

function calcCompletion(p: any): number {
  let filled = 0;
  let total = 10;
  if (p.name) filled++;
  if (p.email) filled++;
  if (p.grade) filled++;
  if (p.schoolType || p.schoolName) filled++;
  if (p.city) filled++;
  if (p.englishLevel) filled++;
  if (Array.isArray(p.subjects) && p.subjects.length > 0) filled++;
  if (Array.isArray(p.targetTypes) && p.targetTypes.length > 0) filled++;
  if (Array.isArray(p.targetCountries) && p.targetCountries.length > 0) filled++;
  if (p.whatsapp || p.telegram) filled++;
  return Math.round((filled / total) * 100);
}
