"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MMRDisplayProps {
  mmr: number;
  delta?: number;
  showDelta?: boolean;
  className?: string;
}

export function MMRDisplay({ mmr, delta, showDelta = true, className }: MMRDisplayProps) {
  const [displayDelta, setDisplayDelta] = useState<number | null>(null);

  useEffect(() => {
    if (delta !== undefined && delta !== 0) {
      setDisplayDelta(delta);
      const timer = setTimeout(() => setDisplayDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [delta]);

  return (
    <div className={cn("relative flex items-baseline gap-1", className)}>
      <span className="text-2xl font-bold tabular-nums text-[var(--text)]">
        {mmr.toLocaleString()}
      </span>
      <span className="text-sm text-[var(--text-muted)]">MMR</span>

      <AnimatePresence>
        {showDelta && displayDelta !== null && (
          <motion.span
            key={displayDelta}
            initial={{ opacity: 0, y: 0, x: 10 }}
            animate={{ opacity: 1, y: -20, x: 10 }}
            exit={{ opacity: 0, y: -35, x: 10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "absolute -top-1 left-full text-sm font-bold tabular-nums",
              displayDelta > 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {displayDelta > 0 ? `+${displayDelta}` : displayDelta}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
