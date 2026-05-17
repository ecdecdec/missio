"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { supabase } = await import("@/lib/supabase");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Save profile stub if not existing to ensure onboarding flow capability
    try {
      const raw = localStorage.getItem("missio_profile");
      if (!raw) {
        localStorage.setItem("missio_profile", JSON.stringify({ email: form.email }));
      }
    } catch { /* ignore */ }

    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 font-mono-c">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl uppercase tracking-tight text-[var(--foreground)] hover:text-[#1B3BFF] transition-colors">
            POAM
          </Link>
          <p className="text-xs text-[var(--text-secondary)] mt-2 uppercase">Войди в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] p-6 flex flex-col gap-4">
          {error && <div className="text-xs text-red-600 bg-red-50 p-3 border border-red-100 uppercase">{error}</div>}
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase opacity-60">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-xs outline-none focus:border-[#1B3BFF] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase opacity-60">Пароль</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-xs outline-none focus:border-[#1B3BFF] transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[var(--foreground)] text-white hover:bg-[#1B3BFF] transition-colors py-3.5 text-xs uppercase font-bold border border-transparent"
            disabled={loading}
          >
            {loading ? "Вхожу..." : "Войти →"}
          </button>

          <div className="text-center text-xs text-[var(--text-secondary)] mt-2">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-[#1B3BFF] hover:underline font-bold">
              Зарегистрироваться
            </Link>
          </div>
        </form>

        <p className="text-center text-[10px] uppercase text-[var(--text-tertiary)] mt-6">
          <Link href="/privacy" className="hover:underline">Политика</Link>
          {" · "}
          <Link href="/terms" className="hover:underline">Условия</Link>
        </p>
      </div>
    </div>
  );
}
