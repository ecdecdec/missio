"use client";

const SCHOOLS = [
  "НИШ АЛМАТЫ", "НИШ АСТАНА", "НИШ ШЫМКЕНТ", "БИЛ АЛМАТЫ",
  "HAILEYBURY ALMATY", "МЕКТЕП-ЛИЦЕЙ №165", "НИШ АКТОБЕ",
  "НИШ ТАРАЗ", "БОЛАШАҚ ЛИЦЕЙ", "НАЗАРБАЕВ ИШ",
  "НИШ КАРАГАНДА", "БИЛ НҰРСҰЛТАН", "QSI ALMATY",
  "МИРАС АЛМАТЫ", "НИШ ПАВЛОДАР",
];

const PROGRAMS = [
  "FLEX", "MIT PRIMES", "БОЛАШАК", "DAAD", "FULBRIGHT",
  "ERASMUS+", "RSI", "MATHCAMP", "CHEVENING", "GKS",
  "MEXT", "CSC", "PROMYS", "ISEF", "IMO",
  "UWC", "YES ABROAD", "NSLI-Y", "AFS", "YFU",
];

export default function SocialProof() {
  return (
    <div className="border-b border-[var(--border)] overflow-hidden group" id="social-proof">
      {/* Row 1 — Schools scrolling left */}
      <div className="py-2.5 border-b border-[var(--border)]">
        <div
          className="flex items-center gap-10 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "30s" }}
        >
          {[...SCHOOLS, ...SCHOOLS].map((school, i) => (
            <span key={i} className="font-mono-c text-[11px] uppercase opacity-40 shrink-0">
              {school}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — Programs scrolling right */}
      <div className="py-2.5">
        <div
          className="flex items-center gap-10 animate-marquee-reverse whitespace-nowrap group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "25s" }}
        >
          {[...PROGRAMS, ...PROGRAMS].map((prog, i) => (
            <span key={i} className="font-mono-c text-[11px] uppercase opacity-40 shrink-0">
              <span className="text-[#1B3BFF] opacity-80">●</span> {prog}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
