const testimonials = [
  {
    name: "Аружан К.",
    school: "НИШ Алматы",
    grade: "11 класс",
    quote: "Нашла FLEX через Missio за 20 минут. Подала. Прошла.",
    program: "FLEX · США",
    idx: "001",
  },
  {
    name: "Данияр М.",
    school: "БИЛ Костанай",
    grade: "10 класс",
    quote: "Раньше я просто скроллил чаты. Теперь алерт приходит, когда ещё можно спокойно собрать документы.",
    program: "Zhautykov Olympiad",
    idx: "002",
  },
  {
    name: "Сабина Т.",
    school: "Школа №165",
    grade: "9 класс",
    quote: "Совместимость объяснили простым языком — поняла, куда реально тянуться, а куда пока рано.",
    program: "Samsung Innovation Campus",
    idx: "003",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 04 · архив отзывов</p>
        <h2 className="font-display font-bold tight text-[40px] md:text-[56px] mb-16">
          Истории школьников
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-[var(--border)]">
          {testimonials.map((t) => (
            <div key={t.name} className="border-r border-b border-[var(--border)] p-8">
              <p className="font-mono-c text-[9px] uppercase opacity-40 mb-6">{t.idx} / archive</p>
              <blockquote className="font-display text-xl leading-snug mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-t border-[var(--border)] pt-5">
                <p className="font-display font-bold text-sm">{t.name}</p>
                <p className="font-mono-c text-[10px] uppercase opacity-50 mt-1">
                  {t.school} · {t.grade}
                </p>
                <p className="font-mono-c text-[10px] uppercase text-[var(--blue)] mt-2">
                  ↗ {t.program}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
