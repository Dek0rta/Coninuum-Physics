"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated" | "interactive";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const baseClass = cn(
    "rounded-[var(--radius-lg)] bg-[var(--bg-card)]",
    variant === "default" && "border border-[var(--border)]",
    variant === "bordered" && "border-2 border-[var(--border)]",
    variant === "elevated" && "shadow-[var(--shadow-md)]",
    variant === "interactive" && "border border-[var(--border)] cursor-pointer",
    className
  );

  if (variant === "interactive") {
    return (
      <motion.div
        className={baseClass}
        whileHover={{ scale: 1.015, y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClass} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4 border-b border-[var(--border)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-[var(--text)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-3 border-t border-[var(--border)] flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}
