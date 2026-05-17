"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelCanvas } from "@/components/landing/PixelCanvas";
import TextScramble from "@/components/landing/TextScramble";
import ParticleField from "@/components/landing/ParticleField";
import SpinningSphere from "@/components/landing/SpinningSphere";

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

      <div className="relative px-6 md:px-10 py-28 md:py-36 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-center">
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
        <figure className="relative hidden md:block w-[320px] lg:w-[360px] justify-self-center group md:-ml-16 lg:-ml-28">
          <div
            className="relative border border-[var(--border)] overflow-hidden"
            style={{ animation: "float 4s ease-in-out infinite", background: "transparent" }}
          >
            {/* SVG illustration */}
            <div className="w-full aspect-square flex items-center justify-center relative group-hover:animate-[glitch_0.3s_ease-in-out]" style={{ background: "transparent" }}>
              <SpinningSphere />
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
