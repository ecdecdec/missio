"use client";

import React from "react";
import clsx from "clsx";

type InputProps = {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
  autoComplete?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  errorMessage,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  className,
  required,
  name,
  autoComplete,
}) => {
  const describedById = error
    ? "input-error-text"
    : helperText
    ? "input-helper-text"
    : undefined;

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[#1A1A18]">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error || undefined}
        aria-describedby={describedById}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-[#1A1A18] outline-none transition-colors",
          "bg-[#F9F8F6] placeholder:text-[#1A1A18]/40",
          "border-[rgba(0,0,0,0.12)] focus:border-[#1D9E75]",
          error && "border-[#E24B4A] focus:border-[#E24B4A]",
          disabled && "cursor-not-allowed bg-[#F9F8F6]/60 text-[#1A1A18]/40"
        )}
      />
      {helperText && !error && (
        <p
          id="input-helper-text"
          className="text-xs text-[#1A1A18]/60"
        >
          {helperText}
        </p>
      )}
      {error && errorMessage && (
        <p
          id="input-error-text"
          className="text-xs text-[#E24B4A]"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;