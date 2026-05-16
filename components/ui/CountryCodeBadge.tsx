import { cn } from "@/lib/utils";

/** ISO 3166-1 alpha-2 country code — no emoji flags (design system). */
export default function CountryCodeBadge({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const upper = code.slice(0, 2).toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-1.5 text-[10px] font-bold tracking-wide text-[var(--text-secondary)]",
        className
      )}
      aria-label={`Страна: ${upper}`}
    >
      {upper}
    </span>
  );
}
