"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5">
            <span
              className="text-xl font-normal text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
            >
              Missi
            </span>
            <span
              className="text-xl font-normal text-[var(--green-400)]"
              style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
            >
              o•
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Как работает
            </Link>
            <Link href="#programs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Программы
            </Link>
            <Link href="#for-orgs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Организациям
            </Link>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Войти</Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm">Начать бесплатно</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-[var(--text-primary)] transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-[var(--text-primary)] transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-[var(--text-primary)] transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[var(--border)] px-4 py-4 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-sm text-[var(--text-secondary)]" onClick={() => setMobileOpen(false)}>Как работает</Link>
          <Link href="#programs" className="text-sm text-[var(--text-secondary)]" onClick={() => setMobileOpen(false)}>Программы</Link>
          <Link href="#for-orgs" className="text-sm text-[var(--text-secondary)]" onClick={() => setMobileOpen(false)}>Организациям</Link>
          <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
            <Link href="/login" className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">Войти</Button>
            </Link>
            <Link href="/onboarding" className="flex-1">
              <Button size="sm" className="w-full">Начать</Button>
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
