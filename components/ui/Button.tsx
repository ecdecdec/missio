import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--green-400)] focus-visible:ring-offset-[var(--bg-primary)] rounded-xl";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--green-400)] text-white shadow-sm shadow-[var(--green-400)]/25 hover:bg-[var(--green-600)] hover:shadow-md hover:shadow-[var(--green-600)]/20 active:scale-[0.99] disabled:bg-neutral-300 disabled:text-white/80 disabled:shadow-none disabled:active:scale-100",
  secondary:
    "border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-neutral-300 hover:bg-neutral-50 disabled:border-neutral-100 disabled:text-neutral-400",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-[15px] gap-2 leading-snug",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  className,
  disabled,
  type = "button",
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { y: -0.5 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "cursor-not-allowed",
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export default Button;
