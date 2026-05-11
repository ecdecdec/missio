import Link from "next/link";

const footerLinks = {
  Платформа: [
    { label: "Как работает", href: "/#how-it-works" },
    { label: "База программ", href: "/programs" },
    { label: "О нас", href: "/about" },
  ],
  Организациям: [
    { label: "Для фондов", href: "/org" },
    { label: "Для университетов", href: "/org" },
    { label: "Партнёрство", href: "/org" },
  ],
  Контакты: [
    { label: "Instagram", href: "https://instagram.com/missio.kz" },
    { label: "hello@missio.kz", href: "mailto:hello@missio.kz" },
    { label: "Астана, Казахстан", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <span
                className="text-xl font-normal text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                Missi
              </span>
              <span
                className="text-xl font-normal text-[var(--green-400)]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                o•
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Инфраструктура возможностей для школьников Центральной Азии.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            © 2026 Missio · Все права защищены
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
