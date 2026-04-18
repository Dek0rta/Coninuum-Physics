"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm",
  secondary:
    "bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] border border-[var(--border)]",
  ghost:
    "bg-transparent text-[var(--text)] hover:bg-[var(--bg-secondary)]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, icon, children, disabled, ...rest },
    ref
  ) => {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", duration: 0.2, bounce: 0.3 }}
        className="inline-flex"
      >
        <button
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center rounded-[var(--radius)] font-medium",
            "transition-colors duration-150 cursor-pointer select-none",
            "disabled:opacity-50 disabled:pointer-events-none",
            variantStyles[variant],
            sizeStyles[size],
            className
          )}
          disabled={disabled || loading}
          {...rest}
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            icon
          )}
          {children}
        </button>
      </motion.div>
    );
  }
);

Button.displayName = "Button";
