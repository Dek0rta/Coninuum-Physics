"use client";

import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getRankProgress, getRankName } from "@/lib/mmr";
import type { RankName } from "@/types";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  mmr: number;
  rankName: RankName;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({
  mmr,
  rankName,
  showProgress = true,
  size = "md",
  className,
}: RankBadgeProps) {
  const { rank, nextRank, progress } = getRankProgress(mmr);

  const sizeStyles = {
    sm: { icon: "text-base", text: "text-xs", bar: "h-1" },
    md: { icon: "text-2xl", text: "text-sm", bar: "h-1.5" },
    lg: { icon: "text-4xl", text: "text-base", bar: "h-2" },
  };

  const styles = sizeStyles[size];

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-center gap-2">
              <span
                className={cn(styles.icon)}
                style={{ color: rank.color }}
                aria-hidden="true"
              >
                {rank.icon}
              </span>
              <div className="flex flex-col">
                <span
                  className={cn("font-semibold", styles.text)}
                  style={{ color: rank.color }}
                >
                  {rank.label}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {mmr.toLocaleString()} MMR
                </span>
              </div>
            </div>

            {showProgress && nextRank && (
              <div className="flex flex-col gap-1">
                <div
                  className={cn(
                    "w-full bg-[var(--border)] rounded-full overflow-hidden",
                    styles.bar
                  )}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: rank.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", duration: 1, bounce: 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>{rank.label}</span>
                  <span>{nextRank.label} ({nextRank.minMmr.toLocaleString()})</span>
                </div>
              </div>
            )}

            {showProgress && !nextRank && (
              <p className="text-xs text-[var(--text-muted)]">Maximum rank reached</p>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            className={cn(
              "z-50 rounded-[var(--radius)] border border-[var(--border)]",
              "bg-[var(--bg-card)] px-3 py-2 text-xs shadow-[var(--shadow-md)]",
              "text-[var(--text)]"
            )}
          >
            <p className="font-medium">{rank.label}</p>
            <p className="text-[var(--text-muted)]">
              {mmr.toLocaleString()} / {nextRank?.minMmr?.toLocaleString() ?? "MAX"} MMR
            </p>
            {nextRank && (
              <p className="text-[var(--text-muted)]">
                {(nextRank.minMmr - mmr).toLocaleString()} to {nextRank.label}
              </p>
            )}
            <Tooltip.Arrow className="fill-[var(--border)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
