"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated" | "interactive" | "glass";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const baseClass = cn(
    variant === "default" && "card-base",
    variant === "bordered" && "card-base border-2",
    variant === "elevated" && "card-base shadow-[var(--shadow-md)]",
    variant === "interactive" && "card-base card-lift cursor-pointer",
    variant === "glass" && "glass-card",
    className
  );

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
