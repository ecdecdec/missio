"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "#programs", label: "Программы" },
  { href: "#how-it-works", label: "Как работает" },
  { href: "#for-orgs", label: "Для организаций" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "backdrop-blur-md bg-bg/80 border-b border-black/5" : "bg-bg"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Home"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-text">
            <span className="text-primary"></span>
          </span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          <ul className="flex items-center space-x-6 text-sm font-medium text-text/80">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors hover:text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3">
            <button
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-text/80 transition-colors hover:text-text"
              type="button"
            >
              Войти
            </button>
            <button
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow"
              type="button"
            >
              Начать бесплатно
            </button>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-text/80 transition-colors hover:bg-black/5 hover:text-text md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          <div className="relative h-5 w-5">
            <span
              className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-text transition-transform duration-200 ${
                mobileOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 top-2.5 h-0.5 rounded bg-text transition-opacity duration-200 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute inset-x-0 top-3.5 h-0.5 rounded bg-text transition-transform duration-200 ${
                mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t border-black/5 bg-bg md:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 pb-4 pt-2">
              <ul className="flex flex-col space-y-2 text-sm font-medium text-text/90">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-lg px-2 py-2 transition-colors hover:bg-black/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-col space-y-2">
                <button
                  className="w-full rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-text/80 transition-colors hover:bg-black/5"
                  type="button"
                >
                  Войти
                </button>
                <button
                  className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  type="button"
                >
                  Начать бесплатно
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;