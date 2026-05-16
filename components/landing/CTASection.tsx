import Link from "next/link";

export default function CTASection() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <div className="border border-[var(--border)] p-10 md:p-16 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 06 · начать</p>
            <h2 className="font-display font-bold tight text-[40px] md:text-[64px]">
              Узнай, какие<br />программы ждут тебя
            </h2>
            <p className="font-mono-c text-[12px] uppercase opacity-50 mt-6">
              580+ программ · персональный матчинг · дедлайны под контролем
            </p>
          </div>
          <div className="flex flex-col gap-4 shrink-0">
            <Link
              href="/onboarding"
              className="font-mono-c text-[11px] uppercase bg-[var(--foreground)] text-[var(--background)] px-10 py-4 hover:bg-[var(--blue)] transition-colors text-center"
            >
              Заполнить профиль →
            </Link>
            <Link
              href="/programs"
              className="font-mono-c text-[11px] uppercase border border-[var(--border)] px-10 py-4 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors text-center"
            >
              Открыть каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
