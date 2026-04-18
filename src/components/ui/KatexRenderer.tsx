"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface KatexRendererProps {
  formula: string;
  display?: boolean;
  className?: string;
}

export function KatexRenderer({ formula, display = false, className }: KatexRendererProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    import("katex").then((katex) => {
      try {
        katex.default.render(formula, ref.current!, {
          displayMode: display,
          throwOnError: false,
          trust: false,
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = formula;
        }
      }
    });
  }, [formula, display]);

  return (
    <span
      ref={ref}
      className={cn(display && "block text-center", className)}
      aria-label={formula}
    />
  );
}
