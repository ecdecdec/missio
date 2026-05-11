import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "green" | "amber" | "blue" | "gray" | "coral" | "red";
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = "gray", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
        {
          "bg-[var(--green-50)] text-[var(--green-600)]": variant === "green",
          "bg-amber-50 text-amber-700": variant === "amber",
          "bg-blue-50 text-blue-700": variant === "blue",
          "bg-[var(--gray-100)] text-[var(--gray-700)]": variant === "gray",
          "bg-orange-50 text-orange-700": variant === "coral",
          "bg-red-50 text-red-600": variant === "red",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
