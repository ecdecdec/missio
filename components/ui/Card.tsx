import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type CardVariant = "default" | "elevated" | "accent";

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = "default",
  children,
  className,
  onClick,
}) => {
  const baseClasses =
    "bg-white border border-black/8 rounded-2xl p-5 transition-transform duration-200 ease-out hover:-translate-y-1";
  const variantClasses: Record<CardVariant, string> = {
    default: "",
    elevated: "shadow-[0_18px_45px_rgba(0,0,0,0.08)]",
    accent: "border-l-[3px] border-l-[#1D9E75]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onClick}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </motion.div>
  );
};

export default Card;