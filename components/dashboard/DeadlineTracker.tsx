"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

interface DeadlineItem {
  id: string;
  name: string;
  daysLeft: number;
  urgency: "critical" | "soon" | "ok";
}

const SAMPLE: DeadlineItem[] = [
  { id: "1", name: "YES Program", daysLeft: 3, urgency: "critical" },
  { id: "2", name: "Science Olympiad KZ", daysLeft: 5, urgency: "critical" },
  { id: "3", name: "FLEX — Future Leaders Exchange", daysLeft: 21, urgency: "soon" },
  { id: "4", name: "Болашак Youth", daysLeft: 18, urgency: "soon" },
  { id: "5", name: "MIT PRIMES", daysLeft: 45, urgency: "ok" },
  { id: "6", name: "Deutsche Schülerakademie", daysLeft: 60, urgency: "ok" },
];

const groups = [
  { key: "critical", label: "СРОЧНО", sublabel: "< 7 дней", icon: AlertCircle, color: "#EF4444", bg: "#FEF2F2" },
  { key: "soon", label: "СКОРО", sublabel: "7–21 день", icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
  { key: "ok", label: "ЕСТЬ ВРЕМЯ", sublabel: "> 21 дня", icon: CheckCircle, color: "var(--green-400)", bg: "var(--green-50)" },
];

export default function DeadlineTracker() {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, gi) => {
        const items = SAMPLE.filter((i) => i.urgency === group.key);
        if (!items.length) return null;

        return (
          <div key={group.key}>
            <div className="flex items-center gap-2 mb-3">
              <group.icon size={14} style={{ color: group.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: group.color }}>
                {group.label}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">· {group.sublabel}</span>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: gi * 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--border-hover)] transition-all group cursor-pointer"
                  style={{ borderLeftColor: group.color, borderLeftWidth: 2 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.name}</p>
                  </div>
                  <div
                    className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: group.bg, color: group.color }}
                  >
                    {item.daysLeft === 1 ? "1 день" : `${item.daysLeft} дней`}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
