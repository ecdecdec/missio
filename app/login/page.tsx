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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            Missi<span className="text-[var(--green-400)]">o•</span>
          </Link>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Войди в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="твой@email.kz"
            required
          />
          <Input
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Вхожу..." : "Войти"}
          </Button>

          <div className="text-center text-sm text-[var(--text-secondary)]">
            Нет аккаунта?{" "}
            <Link href="/onboarding" className="text-[var(--green-600)] hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-[var(--text-tertiary)] mt-6">
          <Link href="/privacy" className="hover:underline">Политика конфиденциальности</Link>
          {" · "}
          <Link href="/terms" className="hover:underline">Условия использования</Link>
        </p>
      </div>
    </div>
  );
}
