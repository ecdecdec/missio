"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelCanvas } from "@/components/landing/PixelCanvas";
import TextScramble from "@/components/landing/TextScramble";
import ParticleField from "@/components/landing/ParticleField";

const ROTATING = ["ГРАНТ", "СТАЖИРОВКУ", "ПРОГРАММУ", "БУДУЩЕЕ", "ВЫЛЕТ"];

export default function Hero() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/onboarding?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative border-b border-[var(--border)] overflow-hidden" id="hero">
      {/* Particle canvas background */}
      <div className="absolute inset-0 pointer-events-auto">
        <ParticleField />
      </div>

      {/* Pixel canvas edges */}
      <div className="absolute inset-0 opacity-90 pointer-events-none">
        <PixelCanvas />
      </div>

      {/* Scanlines overlay — animated */}
      <div className="absolute inset-0 scanlines pointer-events-none" style={{ animation: "scanlines-move 8s linear infinite" }} />

      <div className="relative px-6 md:px-10 py-28 md:py-36 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
        <div>
          {/* Eyebrow */}
          <p className="font-mono-c text-[11px] uppercase mb-10 opacity-60 tracking-widest">
            Архив образовательных возможностей · 2026
          </p>

          {/* Headline with scramble effect */}
          <h1 className="font-display font-bold tight">
            <span className="block text-[48px] md:text-[72px] leading-none">Найди свой</span>
            <span className="block text-[40px] md:text-[64px] text-[#1B3BFF] leading-none mt-2">
              [<TextScramble words={ROTATING} interval={2500} scrambleDuration={500} />]
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-display text-base md:text-lg mt-12 max-w-xl opacity-80 leading-relaxed">
            12 400+ школьников. 580+ программ в базе.
            AI с точностью 94% подбирает то, что подходит именно тебе.
          </p>

          {/* Email signup form */}
          <form
            id="start"
            className="mt-12 flex flex-col sm:flex-row max-w-xl"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="твой@email.kz"
              required
              className="flex-1 border border-[var(--border)] bg-white px-5 py-4 font-mono-c text-sm outline-none focus:border-[#1B3BFF] transition-colors"
            />
            <button
              type="submit"
              className="border border-[var(--border)] border-l-0 bg-[var(--foreground)] text-white px-8 py-4 font-mono-c text-sm uppercase hover:bg-[#1B3BFF] transition-colors"
            >
              Начать →
            </button>
          </form>

          <p className="font-mono-c text-[10px] uppercase opacity-50 mt-4">
            580+ программ · Бесплатно · Без спама
          </p>
        </div>

        {/* Right — Archive illustration with float + glitch */}
        <figure className="relative hidden md:block w-[280px] lg:w-[320px] justify-self-end group">
          <div
            className="relative border border-[var(--border)] overflow-hidden"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            {/* SVG illustration */}
            <div className="w-full aspect-square bg-[var(--bg)] flex items-center justify-center relative group-hover:animate-[glitch_0.3s_ease-in-out]">
              {/* Rotating star */}
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 text-[#1B3BFF] text-3xl"
                style={{ animation: "spin 6s linear infinite" }}
              >
                ✦
              </div>

              {/* Abstract winged figures */}
              <svg viewBox="0 0 280 280" className="w-full h-full" aria-hidden="true">
                {/* Left figure */}
                <g transform="translate(60, 80)" opacity="0.9">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="32" x2="20" y2="100" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="50" x2="0" y2="70" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="50" x2="40" y2="70" stroke="#080808" strokeWidth="2" />
                  {/* Wing left */}
                  <path
                    d="M 0 70 Q -30 40 -10 20 Q 0 35 10 45"
                    fill="none"
                    stroke="#1B3BFF"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <path
                    d="M 0 80 Q -40 50 -20 25 Q -5 45 5 55"
                    fill="none"
                    stroke="#1B3BFF"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>

                {/* Right figure */}
                <g transform="translate(180, 80)" opacity="0.9">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="32" x2="20" y2="100" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="50" x2="0" y2="70" stroke="#080808" strokeWidth="2" />
                  <line x1="20" y1="50" x2="40" y2="70" stroke="#080808" strokeWidth="2" />
                  {/* Wing right */}
                  <path
                    d="M 40 70 Q 70 40 50 20 Q 40 35 30 45"
                    fill="none"
                    stroke="#1B3BFF"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <path
                    d="M 40 80 Q 80 50 60 25 Q 45 45 35 55"
                    fill="none"
                    stroke="#1B3BFF"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>

                {/* Center text */}
                <text
                  x="140"
                  y="230"
                  textAnchor="middle"
                  fontFamily="var(--font-space-grotesk), monospace"
                  fontSize="24"
                  fontWeight="700"
                  fill="#1B3BFF"
                  letterSpacing="8"
                >
                  
                </text>

                {/* Connecting line between figures */}
                <line
                  x1="100"
                  y1="130"
                  x2="180"
                  y2="130"
                  stroke="#080808"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Text overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 py-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
            >
              <p className="font-mono-c text-[10px] uppercase text-white opacity-90">
                архив возможностей · 2026
              </p>
            </div>
          </div>
          <figcaption className="font-mono-c text-[10px] uppercase opacity-50 mt-3 flex justify-between">
            <span>fig. 001 / archive</span>
            <span>↗ file_2026.svg</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
