"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Calendar, ClipboardList, Bot, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Главная", badge: null },
  { href: "/dashboard/matches", icon: Star, label: "Мои матчи", badge: "12" },
  { href: "/dashboard/deadlines", icon: Calendar, label: "Дедлайны", badge: null },
  { href: "/dashboard/applications", icon: ClipboardList, label: "Мои заявки", badge: null },
  { href: "/dashboard/chat", icon: Bot, label: "AI-ассистент", badge: null },
];

interface SidebarProps {
  student?: { name: string; grade: string; school: string; profileComplete?: number };
}

export default function Sidebar({ student }: SidebarProps) {
  const pathname = usePathname();

  const name = student?.name || "Аружан";
  const grade = student?.grade || "11";
  const school = student?.school || "НИШ";
  const profileComplete = student?.profileComplete ?? 80;

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[var(--border)] flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <Link href="/" className="text-xl font-normal text-[var(--text-primary)]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Missi<span className="text-[var(--green-400)]">o•</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--green-50)] flex items-center justify-center text-sm font-semibold text-[var(--green-600)]">
            {name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{name}</p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{grade} класс · {school}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group",
                active
                  ? "bg-[var(--green-50)] text-[var(--green-600)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={16} className={active ? "text-[var(--green-600)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="bg-[var(--green-400)] text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-auto pt-4 border-t border-[var(--border)]">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <Settings size={16} className="text-[var(--text-tertiary)]" />
            Настройки
          </Link>
        </div>
      </nav>

      {/* Profile progress */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-[var(--text-secondary)]">Профиль заполнен</p>
            <span className="text-xs font-semibold text-[var(--green-600)]">{profileComplete}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--green-400)] rounded-full transition-all duration-500"
              style={{ width: `${profileComplete}%` }}
            />
          </div>
          {profileComplete < 100 && (
            <Link href="/onboarding" className="text-xs text-[var(--green-600)] hover:underline mt-2 flex items-center gap-1">
              Дополнить профиль <ChevronRight size={10} />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
