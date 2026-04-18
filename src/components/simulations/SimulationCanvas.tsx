"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SimControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
}

interface SimulationCanvasProps {
  title: string;
  width?: number;
  height?: number;
  controls: SimControl[];
  info: Record<string, string | number>;
  onControlChange: (id: string, value: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  children: React.ReactNode; // canvas element
}

export function SimulationCanvas({
  title,
  controls,
  info,
  onControlChange,
  isPlaying,
  onPlayPause,
  onReset,
  children,
}: SimulationCanvasProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text)]">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[var(--radius)]",
              "bg-[var(--bg-secondary)] border border-[var(--border)]",
              "text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]",
              "transition-colors"
            )}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onReset}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[var(--radius)]",
              "bg-[var(--bg-secondary)] border border-[var(--border)]",
              "text-[var(--text-muted)] hover:text-[var(--text)]",
              "transition-colors"
            )}
            aria-label="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
        {children}
      </div>

      {/* Controls + Info grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Controls */}
        {controls.length > 0 && (
          <div className="space-y-3 p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)]">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Controls
            </p>
            {controls.map((ctrl) => (
              <div key={ctrl.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--text)]">{ctrl.label}</label>
                  <span className="text-xs font-mono text-[var(--accent)]">
                    {ctrl.value.toFixed(ctrl.step < 1 ? 2 : 1)}
                    {ctrl.unit && ` ${ctrl.unit}`}
                  </span>
                </div>
                <Slider.Root
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={[ctrl.value]}
                  onValueChange={([v]) => onControlChange(ctrl.id, v)}
                  className="relative flex h-4 w-full items-center"
                >
                  <Slider.Track className="relative h-1 w-full rounded-full bg-[var(--border)]">
                    <Slider.Range className="absolute h-full rounded-full bg-[var(--accent)]" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-3.5 w-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-card)] shadow cursor-pointer hover:scale-110 transition-transform focus:outline-none" />
                </Slider.Root>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {Object.keys(info).length > 0 && (
          <div className="space-y-2 p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)]">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Real-time Data
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(info).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-[var(--text-muted)]">{key}</span>
                  <span className="text-sm font-mono font-medium text-[var(--text)]">
                    {typeof val === "number" ? val.toFixed(3) : val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
