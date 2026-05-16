import Link from "next/link";

const LINKS = {
  Платформа: [
    { label: "Как работает", href: "/#how" },
    { label: "База программ", href: "/programs" },
    { label: "О нас", href: "/about" },
  ],
  Организациям: [
    { label: "Для фондов", href: "/org" },
    { label: "Для университетов", href: "/org" },
    { label: "Партнёрство", href: "/org" },
  ],
  Контакты: [
    { label: "Instagram", href: "https://instagram.com/poam.me" },
    { label: "hello@poam.me", href: "mailto:hello@poam.me" },
    { label: "Астана, Казахстан", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] border-b border-[var(--border)]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 py-10 md:border-r border-[var(--border)] md:pr-10">
              
            <p className="font-mono-c text-[11px] uppercase opacity-50 leading-relaxed max-w-[240px]">
              Архив образовательных возможностей для школьников Казахстана
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="py-10 md:px-8 border-t border-[var(--border)] md:border-t-0 md:border-l">
              <h4 className="font-mono-c text-[10px] uppercase opacity-50 mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono-c text-[11px] uppercase opacity-60 hover:opacity-100 hover:text-[var(--blue)] transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="font-mono-c text-[10px] uppercase opacity-40">
            © 2026 · Все права защищены
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-mono-c text-[10px] uppercase opacity-40 hover:opacity-80 transition-opacity">
              Конфиденциальность
            </Link>
            <Link href="/terms" className="font-mono-c text-[10px] uppercase opacity-40 hover:opacity-80 transition-opacity">
              Условия
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
