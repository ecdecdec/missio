"use client";

import { motion } from "framer-motion";
import { Clock, Globe, MapPin, Plus, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CountryCodeBadge from "@/components/ui/CountryCodeBadge";
import { getProgramTypeLabel, getProgramTypeBadgeVariant } from "@/lib/utils";

export interface Match {
  id: string;
  name: string;
  org: string;
  type: string;
  country: string;
  countryCode: string;
  daysLeft: number;
  urgency: "critical" | "soon" | "ok";
  score: number;
  reasons: string[];
  english: string;
  duration?: string;
}

interface MatchCardProps {
  match: Match;
  onAdd?: () => void;
  onView?: () => void;
}

export default function MatchCard({ match, onAdd, onView }: MatchCardProps) {
  const urgencyColor =
    match.urgency === "critical" ? "#EF4444" : match.urgency === "soon" ? "#F59E0B" : "var(--green-400)";

  return (
    <div className="group flex min-w-[300px] max-w-[320px] shrink-0 flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-md">
      <div className="flex flex-wrap items-start gap-2">
        <CountryCodeBadge code={match.countryCode} />
        <Badge variant={getProgramTypeBadgeVariant(match.type)}>{getProgramTypeLabel(match.type).toUpperCase()}</Badge>
      </div>

      <div>
        <h3 className="mb-1 font-semibold leading-snug text-[var(--text-primary)]">{match.name}</h3>
        <p className="text-xs text-[var(--text-tertiary)]">{match.org}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">Совместимость</span>
          <span className="text-sm font-semibold text-[var(--green-600)]">{match.score}%</span>
        </div>
        <div className="mb-2 h-1.5 w-full rounded-full bg-[var(--gray-100)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${match.score}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-1.5 rounded-full bg-[var(--green-400)]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {match.reasons.slice(0, 3).map((r) => (
            <span key={r} className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              {r}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1" style={{ color: urgencyColor }}>
          <Clock size={11} />
          Дедлайн: {match.daysLeft} дн.
        </span>
        <span className="flex items-center gap-1">
          <Globe size={11} />
          {match.english}
        </span>
        {match.duration && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {match.country} · {match.duration}
          </span>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--border)] py-2.5 text-xs font-medium transition-colors hover:bg-[var(--bg-secondary)]"
        >
          Подробнее
          <ArrowRight size={12} />
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--green-400)] py-2.5 text-xs font-medium text-white transition-colors hover:bg-[var(--green-600)]"
        >
          <Plus size={12} />
          В трекер
        </button>
      </div>
    </div>
  );
}
