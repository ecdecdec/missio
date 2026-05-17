"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

interface Deadline {
  id: string;
  name: string;
  org: string;
  daysLeft: number;
  urgency: "critical" | "soon" | "ok";
  deadlineDate: string;
}

const DEADLINES: Deadline[] = [
  { id: "1", name: "YES Program", org: "Гос. департамент США", daysLeft: 3, urgency: "critical", deadlineDate: "2026-09-05" },
  { id: "2", name: "Science Olympiad KZ", org: "Министерство образования", daysLeft: 5, urgency: "critical", deadlineDate: "2026-09-07" },
  { id: "3", name: "Болашак Youth", org: "Центр Болашак", daysLeft: 18, urgency: "soon", deadlineDate: "2026-09-18" },
  { id: "4", name: "FLEX — Future Leaders Exchange", org: "Гос. департамент США", daysLeft: 21, urgency: "soon", deadlineDate: "2026-09-15" },
  { id: "5", name: "MIT PRIMES", org: "MIT", daysLeft: 45, urgency: "ok", deadlineDate: "2026-10-25" },
  { id: "6", name: "Samsung Innovation Campus", org: "Samsung", daysLeft: 35, urgency: "ok", deadlineDate: "2026-10-15" },
  { id: "7", name: "Deutsche Schülerakademie", org: "Bildung & Begabung", daysLeft: 60, urgency: "ok", deadlineDate: "2026-11-10" },
];

function Countdown({ daysLeft }: { daysLeft: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const totalSeconds = daysLeft * 86400 - tick;
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return (
    <div className="flex items-center gap-1 text-[10px] font-mono-c">
      <span className="bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1">{String(days).padStart(2, "0")}Д</span>
      <span className="opacity-45">:</span>
      <span className="bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1">{String(hours).padStart(2, "0")}Ч</span>
      <span className="opacity-45">:</span>
      <span className="bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1">{String(mins).padStart(2, "0")}М</span>
      <span className="opacity-45">:</span>
      <span className="bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1">{String(secs).padStart(2, "0")}С</span>
    </div>
  );
}

const groups = [
  { key: "critical", label: "Срочно", sublabel: "менее 7 дней", icon: AlertCircle, color: "#EF4444", borderColor: "#EF4444" },
  { key: "soon", label: "Скоро", sublabel: "7–21 день", icon: Clock, color: "#F59E0B", borderColor: "#F59E0B" },
  { key: "ok", label: "Есть время", sublabel: "более 21 дня", icon: CheckCircle, color: "#1B3BFF", borderColor: "#1B3BFF" },
];

export default function DeadlinesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl font-mono-c bg-[var(--bg-secondary)] min-h-screen">
      <div className="mb-10">
        <h1 className="text-xl font-bold uppercase tracking-wider text-[var(--foreground)] mb-2 font-display">
          Дедлайны программ
        </h1>
        <p className="text-[10px] uppercase opacity-55">Все твои сохраненные возможности с реальными таймерами</p>
      </div>

      <div className="flex flex-col gap-10">
        {groups.map((group) => {
          const items = DEADLINES.filter((d) => d.urgency === group.key);
          if (!items.length) return null;

          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-4 uppercase text-[10px] font-bold">
                <group.icon size={14} style={{ color: group.color }} />
                <h2 className="text-[11px] font-bold tracking-wider text-[var(--foreground)]">{group.label}</h2>
                <span className="opacity-45 ml-1">· {group.sublabel}</span>
                <span className="ml-auto border border-[var(--border)] bg-white px-2 py-0.5 text-[#1B3BFF] font-bold">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="bg-white border border-[var(--border)] p-5 hover:border-[var(--foreground)] transition-colors relative"
                    style={{ borderLeftColor: group.borderColor, borderLeftWidth: 3 }}
                  >
                    <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-[var(--foreground)] leading-tight">{item.name}</p>
                        <p className="text-[9px] uppercase opacity-45 mt-1">{item.org}</p>
                      </div>
                      <div className="shrink-0">
                        <Countdown daysLeft={item.daysLeft} />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono-c text-[9px] uppercase opacity-55 relative z-10">
                      <span>
                        📅 Дедлайн: {new Date(item.deadlineDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <button className="text-[#1B3BFF] font-bold hover:underline">↗ Подать заявку</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
