import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "ghost";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]",
  accent: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-500 border border-red-500/20",
  ghost: "bg-transparent text-[var(--text-muted)]",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
