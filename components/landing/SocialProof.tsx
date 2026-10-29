"use client";

const PROGRAMS = [
  "FLEX", "MIT PRIMES", "БОЛАШАК", "DAAD", "FULBRIGHT",
  "ERASMUS+", "RSI", "MATHCAMP", "CHEVENING", "GKS",
  "MEXT", "CSC", "PROMYS", "ISEF", "IMO",
  "UWC", "YES ABROAD", "NSLI-Y", "AFS", "YFU",
];

export default function SocialProof() {
  return (
    <div className="border-b border-[var(--border)] overflow-hidden group" id="social-proof">
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
