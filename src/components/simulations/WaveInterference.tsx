"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SimulationCanvas, type SimControl } from "./SimulationCanvas";

const W = 600;
const H = 350;

const DEFAULT_CONTROLS: SimControl[] = [
  { id: "freq", label: "Frequency", min: 0.5, max: 4, step: 0.1, value: 1.5, unit: "Hz" },
  { id: "separation", label: "Source Separation", min: 20, max: 120, step: 5, value: 60, unit: "px" },
  { id: "wavelength", label: "Wavelength", min: 20, max: 80, step: 5, value: 40, unit: "px" },
];

export function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useState<SimControl[]>(DEFAULT_CONTROLS);
  const [info, setInfo] = useState<Record<string, string | number>>({});

  const getControl = (id: string) => controls.find((c) => c.id === id)?.value ?? 0;

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const freq = getControl("freq");
    const separation = getControl("separation");
    const wavelength = getControl("wavelength");
    const omega = 2 * Math.PI * freq;
    const k = (2 * Math.PI) / wavelength;

    const imgData = ctx.createImageData(W, H);
    const data = imgData.data;

    const s1 = { x: W / 2 - separation / 2, y: H / 2 };
    const s2 = { x: W / 2 + separation / 2, y: H / 2 };

    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const r1 = Math.sqrt((px - s1.x) ** 2 + (py - s1.y) ** 2);
        const r2 = Math.sqrt((px - s2.x) ** 2 + (py - s2.y) ** 2);

        const amp1 = r1 > 0 ? Math.sin(k * r1 - omega * t) / Math.sqrt(Math.max(r1, 1)) : 1;
        const amp2 = r2 > 0 ? Math.sin(k * r2 - omega * t) / Math.sqrt(Math.max(r2, 1)) : 1;
        const combined = amp1 + amp2;

        const normalized = (combined + 2) / 4; // 0-1
        const idx = (py * W + px) * 4;

        // Blue-cyan color map
        data[idx] = Math.round(normalized * 20);
        data[idx + 1] = Math.round(normalized * 100);
        data[idx + 2] = Math.round(normalized * 220 + 35);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Source dots
    for (const src of [s1, s2]) {
      ctx.beginPath();
      ctx.arc(src.x, src.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
    }

    // Constructive interference lines (approximate)
    ctx.fillStyle = "rgba(251,191,36,0.6)";
    ctx.font = "10px monospace";
    ctx.fillText("S₁", s1.x - 15, s1.y - 10);
    ctx.fillText("S₂", s2.x + 5, s2.y - 10);

    setInfo({
      "Frequency": `${freq} Hz`,
      "λ (px)": wavelength,
      "Δd (px)": separation,
      "ω (rad/s)": (omega).toFixed(2),
    });
  }, [controls]);

  const step = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;
    timeRef.current += dt;
    draw(timeRef.current);
    rafRef.current = requestAnimationFrame(step);
  }, [draw]);

  useEffect(() => {
    draw(0);
  }, [draw]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, step]);

  return (
    <SimulationCanvas
      title="Wave Interference (2 Sources)"
      controls={controls}
      info={info}
      onControlChange={(id, value) =>
        setControls((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)))
      }
      isPlaying={isPlaying}
      onPlayPause={() => setIsPlaying((p) => !p)}
      onReset={() => {
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
        timeRef.current = 0;
        draw(0);
      }}
    >
      <canvas ref={canvasRef} width={W} height={H} className="w-full" />
    </SimulationCanvas>
  );
}
