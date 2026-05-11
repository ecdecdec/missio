import { cn } from "@/lib/utils";

interface CardProps {
  variant?: "default" | "elevated" | "accent";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Card({ variant = "default", className, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border rounded-2xl p-5 transition-all duration-200",
        {
          "border-[var(--border)] hover:border-[var(--border-hover)]": variant === "default",
          "border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--border-hover)]":
            variant === "elevated",
          "border-[var(--border)] border-l-2 border-l-[var(--green-400)] hover:border-[var(--border-hover)]":
            variant === "accent",
        },
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
