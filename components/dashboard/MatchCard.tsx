"use client";

import { motion } from "framer-motion";
import { Clock, Globe, MapPin, Plus, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getProgramTypeLabel, getProgramTypeBadgeVariant } from "@/lib/utils";

export interface Match {
  id: string;
  name: string;
  org: string;
  type: string;
  country: string;
  flag: string;
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
    match.urgency === "critical"
      ? "#EF4444"
      : match.urgency === "soon"
      ? "#F59E0B"
      : "var(--green-400)";

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-5 min-w-[300px] max-w-[320px] hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-300 group shrink-0 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-2 flex-wrap">
        <span className="text-2xl">{match.flag}</span>
        <Badge variant={getProgramTypeBadgeVariant(match.type)}>
          {getProgramTypeLabel(match.type).toUpperCase()}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-[var(--text-primary)] leading-snug mb-1">{match.name}</h3>
        <p className="text-xs text-[var(--text-tertiary)]">{match.org}</p>
      </div>

      {/* Score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--text-secondary)]">Совместимость</span>
          <span className="text-sm font-semibold text-[var(--green-600)]">{match.score}%</span>
        </div>
        <div className="w-full bg-[var(--gray-100)] rounded-full h-1.5 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${match.score}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            className="h-1.5 rounded-full bg-[var(--green-400)]"
          />
        </div>
        {match.reasons[0] && (
          <p className="text-xs text-[var(--text-secondary)] italic">
            &ldquo;{match.reasons[0]}&rdquo;
          </p>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1" style={{ color: urgencyColor }}>
          <Clock size={11} />
          Дедлайн: {match.daysLeft} дней
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

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onView}
          className="flex-1 py-2.5 text-xs font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-1"
        >
          Подробнее
          <ArrowRight size={12} />
        </button>
        <button
          onClick={onAdd}
          className="flex-1 py-2.5 text-xs font-medium bg-[var(--green-400)] text-white rounded-xl hover:bg-[var(--green-600)] transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={12} />
          Добавить
        </button>
      </div>
    </div>
  );
}
