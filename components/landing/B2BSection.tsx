import Link from "next/link";

const stats = [
  { value: "12 400+", label: "верифицированных профилей" },
  { value: "580+", label: "активных программ" },
  { value: "94%", label: "точность матчинга" },
];

const features = [
  { n: "A", title: "Точный таргетинг", desc: "Город, класс, предметы, английский, олимпиады — без слепого охвата." },
  { n: "B", title: "Быстрый запуск", desc: "Разместите программу и получите первые отклики за считанные дни." },
  { n: "C", title: "Аналитика", desc: "Охват, клики, заявки — в одном дашборде в реальном времени." },
];

export default function B2BSection() {
  return (
    <section id="base" className="border-b border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 05 · для организаций</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="font-display font-bold tight text-[40px] md:text-[56px]">
            Находите сильных<br />аппликантов в КЗ
          </h2>
          <Link
            href="/org"
            className="font-mono-c text-[11px] uppercase border border-[rgba(242,240,235,0.3)] px-6 py-3 hover:bg-[var(--blue)] hover:border-[var(--blue)] transition-colors shrink-0"
          >
            Для школ и фондов →
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[rgba(242,240,235,0.15)] mb-12">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-8 ${i < stats.length - 1 ? "md:border-r border-b md:border-b-0 border-[rgba(242,240,235,0.15)]" : ""}`}>
              <p className="font-display font-bold tight text-[56px] md:text-[72px]">{s.value}</p>
              <p className="font-mono-c text-[11px] uppercase opacity-50 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="border border-[rgba(242,240,235,0.15)]">
          {features.map((f, i) => (
            <div
              key={f.n}
              className={`grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr_1.5fr] ${i > 0 ? "border-t border-[rgba(242,240,235,0.15)]" : ""}`}
            >
              <div className="font-mono-c text-[11px] uppercase p-6 opacity-40 border-r border-[rgba(242,240,235,0.15)]">
                {f.n}
              </div>
              <div className="font-display font-bold text-xl p-6 md:border-r border-[rgba(242,240,235,0.15)]">
                {f.title}
              </div>
              <div className="font-mono-c text-[12px] p-6 col-span-2 md:col-span-1 opacity-60 border-t md:border-t-0 border-[rgba(242,240,235,0.15)] leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
