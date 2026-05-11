"use client";

const schools = [
  "НИШ Алматы",
  "НИШ Астана",
  "НИШ Шымкент",
  "БИЛ Алматы",
  "Haileybury Almaty",
  "Мектеп-лицей №165",
  "НИШ Актобе",
  "НИШ Тараз",
  "Болашақ лицей",
  "Назарбаев ИШ",
];

export default function SocialProof() {
  const doubled = [...schools, ...schools];

  return (
    <div className="w-full bg-[var(--bg-secondary)] border-y border-[var(--border)] py-4 overflow-hidden">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
        {doubled.map((school, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <div className="w-6 h-6 rounded-full bg-[var(--green-100)] flex items-center justify-center text-xs font-bold text-[var(--green-600)]">
              {school[0]}
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">{school}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
