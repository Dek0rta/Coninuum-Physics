import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius)] bg-[var(--bg-secondary)]",
        className
      )}
    />
  );
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn("h-16 w-16 rounded-full shrink-0", className)} />
  );
}

export function SkeletonText({ className, wide }: SkeletonProps & { wide?: boolean }) {
  return (
    <Skeleton className={cn("h-4", wide ? "w-48" : "w-28", className)} />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-3",
        className
      )}
    >
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-6">
      <div className="flex items-start gap-5">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2 pt-1">
          <SkeletonText wide />
          <SkeletonText />
          <Skeleton className="h-6 w-32 mt-3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-5 flex flex-col items-center gap-2"
        >
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
