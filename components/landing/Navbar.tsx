"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("missio_profile");
      if (raw) {
        setHasProfile(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <nav className="border-b border-[var(--border)] sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between px-6 md:px-10 h-16 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="font-display font-bold text-lg tracking-tight uppercase hover:text-[#1B3BFF] transition-colors">
          POAM
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-10 font-mono-c text-[11px] uppercase">
          <Link href="/programs" className="hover:text-[var(--blue)] transition-colors">Программы</Link>
          <Link href="/#how" className="hover:text-[var(--blue)] transition-colors">Как работает</Link>
          <Link href="/#base" className="hover:text-[var(--blue)] transition-colors">База</Link>
          {hasProfile && (
            <>
              <Link href="/dashboard" className="hover:text-[var(--blue)] transition-colors text-[#1B3BFF] font-bold">Панель</Link>
              <Link href="/profile" className="hover:text-[var(--blue)] transition-colors text-[#1B3BFF] font-bold">Профиль</Link>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {!hasProfile ? (
            <>
              <Link
                href="/login"
                className="hidden md:block font-mono-c text-[11px] uppercase hover:text-[var(--blue)] transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/onboarding"
                className="font-mono-c text-[11px] uppercase bg-[var(--foreground)] text-white px-4 py-2 hover:bg-[var(--blue)] transition-colors"
              >
                Начать →
              </Link>
            </>
          ) : (
            <Link
              href="/profile"
              className="font-mono-c text-[11px] uppercase bg-[#1B3BFF] text-white px-4 py-2 hover:bg-black transition-colors"
            >
              Профиль →
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden font-mono-c text-[11px] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white">
          <Link
            href="/programs"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors"
          >
            Программы
          </Link>
          <Link
            href="/#how"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors"
          >
            Как работает
          </Link>
          {hasProfile ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors text-[#1B3BFF] font-bold"
              >
                Панель
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors text-[#1B3BFF] font-bold"
              >
                Профиль
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 font-mono-c text-[11px] uppercase border-b border-[var(--border)] hover:bg-[var(--blue)] hover:text-[var(--background)] transition-colors text-[#1B3BFF] font-bold"
              >
                Начать →
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
