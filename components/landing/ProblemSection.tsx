export default function ProblemSection() {
  const before = [
    { msg: "кто-нибудь знал про FLEX??", mine: true },
    { msg: "подача была на прошлой неделе", mine: false },
    { msg: "ладно, в следующем году…", mine: true },
  ];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <p className="font-mono-c text-[11px] uppercase mb-6 opacity-60">§ 03</p>
        <h2 className="font-display font-bold tight text-[40px] md:text-[56px] mb-16">
          Узнаёшь о гранте<br />за 2 дня до дедлайна?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-[rgba(242,240,235,0.15)]">
          {/* Before */}
          <div className="p-8 md:border-r border-[rgba(242,240,235,0.15)]">
            <p className="font-mono-c text-[11px] uppercase mb-8 opacity-60">Без платформы ✗</p>
            <div className="space-y-4 mb-8">
              {before.map((item, i) => (
                <div key={i} className={`flex gap-3 ${item.mine ? "" : "flex-row-reverse"}`}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[rgba(242,240,235,0.2)] font-mono-c text-[10px] opacity-40">
                    ?
                  </div>
                  <div className={`max-w-[85%] border border-[rgba(242,240,235,0.15)] px-4 py-2 font-display text-sm ${item.mine ? "" : "opacity-60"}`}>
                    {item.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-[rgba(242,240,235,0.15)] px-4 py-3 font-mono-c text-[11px] uppercase opacity-60">
              Дедлайн прошёл · тревога и пустая неделя
            </div>
          </div>

          {/* After */}
          <div className="p-8 border-t md:border-t-0 border-[rgba(242,240,235,0.15)]">
            <p className="font-mono-c text-[11px] uppercase mb-8 text-[var(--blue)]">С платформой ✓</p>
            <div className="border border-[rgba(242,240,235,0.15)] p-5 mb-4">
              <p className="font-mono-c text-[9px] uppercase opacity-50 mb-2">Новый матч · 21 день</p>
              <p className="font-display font-bold text-xl tight mb-1">FLEX Program</p>
              <p className="font-mono-c text-[10px] opacity-50">США · Обмен · 1 год</p>
              <div className="mt-4">
                <div className="flex justify-between font-mono-c text-[9px] opacity-50 mb-1">
                  <span>Совместимость</span>
                  <span className="text-[var(--blue)] opacity-100">94%</span>
                </div>
                <div className="h-px bg-[rgba(242,240,235,0.15)]">
                  <div className="h-px bg-[var(--blue)]" style={{ width: "94%" }} />
                </div>
              </div>
            </div>
            <div className="border border-[rgba(242,240,235,0.15)] px-4 py-3 font-mono-c text-[11px] uppercase text-[var(--blue)]">
              Напоминание за 21 день · спокойный темп подачи
            </div>
            <p className="font-mono-c text-[10px] uppercase opacity-50 mt-4">
              ✓ Чеклист документов · AI-помощь с эссе
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
