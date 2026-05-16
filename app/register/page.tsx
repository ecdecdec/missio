"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import("@/lib/supabase");
      
      // Register with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Create student record in students table
      if (data.user) {
        const { error: dbError } = await supabase
          .from("students")
          .insert({
            id: data.user.id,
            email: form.email,
            name: form.name,
          });
          
        if (dbError) {
          console.warn("Failed to insert into students table, it might not exist yet:", dbError.message);
        }
      }

      // Save initial state to localStorage for onboarding flow compatibility
      localStorage.setItem("missio_profile", JSON.stringify({ email: form.email, name: form.name }));
      
      router.push("/onboarding?email=" + encodeURIComponent(form.email));
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            Missi<span className="text-[var(--green-400)]">o•</span>
          </Link>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Создать аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          <Input
            label="Имя"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Аружан"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
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
            {loading ? "Создаю аккаунт..." : "Зарегистрироваться"}
          </Button>

          <div className="text-center text-sm text-[var(--text-secondary)]">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[var(--green-600)] hover:underline font-medium">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
