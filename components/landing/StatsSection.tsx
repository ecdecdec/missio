"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 580, suffix: "+", label: "ПРОГРАММ В БАЗЕ" },
    { value: 12400, suffix: "+", label: "ШКОЛЬНИКОВ" },
    { value: 94, suffix: "%", label: "ТОЧНОСТЬ МАТЧА" },
    { value: 48, suffix: "ч", label: "ДО АЛЕРТА" },
  ];

  return (
    <section
      ref={ref}
      className="border-y border-[var(--border)] bg-[var(--bg)] py-20 px-4"
      id="stats-section"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 font-[family-name:var(--font-space-grotesk)] text-5xl font-black tracking-tighter text-[var(--text-primary)] md:text-6xl lg:text-7xl">
                {visible ? (
                  <CountUp target={stat.value} duration={2000} delay={i * 150} />
                ) : (
                  "0"
                )}
                <span className="text-[#1B3BFF]">{stat.suffix}</span>
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({
  target,
  duration = 2000,
  delay = 0,
}: {
  target: number;
  duration?: number;
  delay?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return <>{value.toLocaleString()}</>;
}
