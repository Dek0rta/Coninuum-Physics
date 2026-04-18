"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SimulationCanvas, type SimControl } from "./SimulationCanvas";

const W = 600;
const H = 350;
const GRAVITY = 9.81;
const SCALE = 40; // px per meter

interface State {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
  launched: boolean;
  landed: boolean;
}

const DEFAULT_CONTROLS: SimControl[] = [
  { id: "speed", label: "Initial Speed", min: 5, max: 50, step: 1, value: 25, unit: "m/s" },
  { id: "angle", label: "Launch Angle", min: 5, max: 85, step: 1, value: 45, unit: "°" },
];

function initialState(speed: number, angleDeg: number): State {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: 60,
    y: H - 40,
    vx: speed * Math.cos(angle),
    vy: -speed * Math.sin(angle),
    trail: [],
    launched: true,
    landed: false,
  };
}

export function ProjectileMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>({ x: 60, y: H - 40, vx: 0, vy: 0, trail: [], launched: false, landed: false });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useState<SimControl[]>(DEFAULT_CONTROLS);
  const [info, setInfo] = useState<Record<string, string | number>>({});

  const getControl = (id: string) => controls.find((c) => c.id === id)?.value ?? 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const s = stateRef.current;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-secondary").trim() || "#0f172a";
    const accent = "#3b82f6";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim() || "#94a3b8";

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, H - 40);
    ctx.lineTo(W, H - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Grid lines
    ctx.strokeStyle = textColor + "20";
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += SCALE) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H - 40);
      ctx.stroke();
    }

    // Trail
    if (s.trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = accent + "60";
      ctx.lineWidth = 1.5;
      ctx.moveTo(s.trail[0].x, s.trail[0].y);
      for (const pt of s.trail) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // Ball
    const gradient = ctx.createRadialGradient(s.x - 3, s.y - 3, 1, s.x, s.y, 10);
    gradient.addColorStop(0, "#60a5fa");
    gradient.addColorStop(1, accent);
    ctx.beginPath();
    ctx.arc(s.x, s.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Velocity vector
    if (s.launched && !s.landed) {
      ctx.strokeStyle = "#f59e0b80";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.vx * 1.5, s.y + s.vy * 1.5);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = textColor;
    ctx.font = "11px monospace";
    ctx.fillText("0 m", 55, H - 20);
    for (let m = 1; m * SCALE < W - 60; m++) {
      ctx.fillText(`${m * 1}`, 60 + m * SCALE - 3, H - 20);
    }
  }, []);

  const step = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const s = stateRef.current;
    if (!s.launched || s.landed) {
      draw();
      return;
    }

    // Physics
    s.vy += GRAVITY * dt;
    s.x += s.vx * SCALE * dt;
    s.y += s.vy * SCALE * dt;

    // Trail (max 120 points)
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 120) s.trail.shift();

    // Hit ground
    if (s.y >= H - 40) {
      s.y = H - 40;
      s.vx = 0;
      s.vy = 0;
      s.landed = true;
      setIsPlaying(false);
    }

    const speed = controls.find((c) => c.id === "speed")?.value ?? 25;
    setInfo({
      "v_x (m/s)": s.vx,
      "v_y (m/s)": -s.vy,
      "Height (m)": Math.max(0, (H - 40 - s.y) / SCALE),
      "Range (m)": Math.max(0, (s.x - 60) / SCALE),
    });

    draw();
    rafRef.current = requestAnimationFrame(step);
  }, [controls, draw]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, step]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (stateRef.current.landed || !stateRef.current.launched) {
        const speed = getControl("speed");
        const angle = getControl("angle");
        stateRef.current = initialState(speed, angle);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
    stateRef.current = { x: 60, y: H - 40, vx: 0, vy: 0, trail: [], launched: false, landed: false };
    setInfo({});
    draw();
  };

  const handleControlChange = (id: string, value: number) => {
    setControls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
    );
  };

  return (
    <SimulationCanvas
      title="Projectile Motion"
      controls={controls}
      info={info}
      onControlChange={handleControlChange}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onReset={handleReset}
    >
      <canvas ref={canvasRef} width={W} height={H} className="w-full aspect-[600/350]" />
    </SimulationCanvas>
  );
}
