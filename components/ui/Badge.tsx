import React from "react";
import clsx from "clsx";

type BadgeVariant = "green" | "amber" | "blue" | "coral" | "gray" | "red";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-[#E1F5EE] text-[#0F6E56]",
  amber: "bg-[#FAEEDA] text-[#854F0B]",
  blue: "bg-[#E6F1FB] text-[#185FA5]",
  coral: "bg-[#FAECE7] text-[#993C1D]",
  gray: "bg-[#F1EFE8] text-[#5F5E5A]",
  red: "bg-[#FEE2E2] text-[#B91C1C]",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "gray",
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;