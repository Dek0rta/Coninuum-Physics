import { Skeleton } from "@/components/ui/Skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-8 w-40" />
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)]">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] divide-y divide-[var(--border)]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
