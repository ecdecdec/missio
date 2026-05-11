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
    <div className="flex items-center gap-1 text-xs font-mono">
      <span className="bg-[var(--gray-100)] px-1.5 py-0.5 rounded">{String(days).padStart(2, "0")}д</span>
      <span className="text-[var(--text-tertiary)]">:</span>
      <span className="bg-[var(--gray-100)] px-1.5 py-0.5 rounded">{String(hours).padStart(2, "0")}ч</span>
      <span className="text-[var(--text-tertiary)]">:</span>
      <span className="bg-[var(--gray-100)] px-1.5 py-0.5 rounded">{String(mins).padStart(2, "0")}м</span>
      <span className="text-[var(--text-tertiary)]">:</span>
      <span className="bg-[var(--gray-100)] px-1.5 py-0.5 rounded">{String(secs).padStart(2, "0")}с</span>
    </div>
  );
}

const groups = [
  { key: "critical", label: "Срочно", sublabel: "менее 7 дней", icon: AlertCircle, color: "#EF4444", borderColor: "#FCA5A5" },
  { key: "soon", label: "Скоро", sublabel: "7–21 день", icon: Clock, color: "#F59E0B", borderColor: "#FCD34D" },
  { key: "ok", label: "Есть время", sublabel: "более 21 дня", icon: CheckCircle, color: "var(--green-400)", borderColor: "var(--green-100)" },
];

export default function DeadlinesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Дедлайны
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Все программы в твоём списке с таймерами</p>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map((group) => {
          const items = DEADLINES.filter((d) => d.urgency === group.key);
          if (!items.length) return null;

          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-4">
                <group.icon size={16} style={{ color: group.color }} />
                <h2 className="font-semibold text-[var(--text-primary)]">{group.label}</h2>
                <span className="text-xs text-[var(--text-tertiary)] ml-1">· {group.sublabel}</span>
                <span className="ml-auto text-xs bg-[var(--gray-100)] px-2 py-0.5 rounded-full text-[var(--text-tertiary)]">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                    className="bg-white border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-hover)] transition-all"
                    style={{ borderLeftColor: group.borderColor, borderLeftWidth: 3 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] text-sm truncate">{item.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.org}</p>
                      </div>
                      <div className="shrink-0">
                        <Countdown daysLeft={item.daysLeft} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-[var(--text-tertiary)]">
                        📅 {new Date(item.deadlineDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
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
