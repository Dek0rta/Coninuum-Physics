"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SimulationCanvas, type SimControl } from "./SimulationCanvas";

const W = 600;
const H = 350;
const R_GAS = 8.314;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const DEFAULT_CONTROLS: SimControl[] = [
  { id: "temp", label: "Temperature", min: 100, max: 1000, step: 10, value: 300, unit: "K" },
  { id: "n", label: "Particle Count", min: 10, max: 100, step: 5, value: 40 },
  { id: "mass", label: "Particle Mass", min: 1, max: 50, step: 1, value: 10, unit: "u" },
];

function initParticles(n: number, temp: number, mass: number): Particle[] {
  const kT = R_GAS * temp / (6.022e23) * 1e20 / mass; // scale factor for visualization
  const speedScale = Math.sqrt(kT * 2);
  const particles: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = speedScale * (0.5 + Math.random());
    particles.push({
      x: 20 + Math.random() * (W - 40),
      y: 20 + Math.random() * (H - 40),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
    });
  }
  return particles;
}

export function IdealGas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useState<SimControl[]>(DEFAULT_CONTROLS);
  const [info, setInfo] = useState<Record<string, string | number>>({});

  const getControl = (id: string) => controls.find((c) => c.id === id)?.value ?? 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const temp = getControl("temp");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, W, H);

    // Container walls
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Draw particles
    particlesRef.current.forEach((p) => {
      const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
      const maxSpeed = 300;
      const t = Math.min(speed / maxSpeed, 1);
      // Color: blue (slow) → red (fast)
      const r = Math.round(t * 239 + (1 - t) * 59);
      const g = Math.round(t * 68 + (1 - t) * 130);
      const b = Math.round(t * 68 + (1 - t) * 246);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();
    });

    // Stats
    const particles = particlesRef.current;
    if (particles.length > 0) {
      const avgKE = particles.reduce((s, p) => s + 0.5 * (p.vx ** 2 + p.vy ** 2), 0) / particles.length;
      const avgSpeed = particles.reduce((s, p) => s + Math.sqrt(p.vx ** 2 + p.vy ** 2), 0) / particles.length;

      setInfo({
        "Temperature": `${temp} K`,
        "Particles": particles.length,
        "Avg Speed": `${avgSpeed.toFixed(1)} px/s`,
        "Avg KE": avgKE.toFixed(1),
      });
    }
  }, [controls]);

  const step = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.033);
    lastTimeRef.current = timestamp;

    const particles = particlesRef.current;
    const margin = 10;

    particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Wall collisions
      if (p.x - p.radius < margin) { p.x = margin + p.radius; p.vx = Math.abs(p.vx); }
      if (p.x + p.radius > W - margin) { p.x = W - margin - p.radius; p.vx = -Math.abs(p.vx); }
      if (p.y - p.radius < margin) { p.y = margin + p.radius; p.vy = Math.abs(p.vy); }
      if (p.y + p.radius > H - margin) { p.y = H - margin - p.radius; p.vy = -Math.abs(p.vy); }
    });

    // Particle-particle collisions (simplified)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0) {
          // Elastic collision
          const nx = dx / dist;
          const ny = dy / dist;
          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const dot = dvx * nx + dvy * ny;
          if (dot > 0) {
            a.vx -= dot * nx;
            a.vy -= dot * ny;
            b.vx += dot * nx;
            b.vy += dot * ny;
          }
          // Separate
          const overlap = minDist - dist;
          a.x -= (overlap / 2) * nx;
          a.y -= (overlap / 2) * ny;
          b.x += (overlap / 2) * nx;
          b.y += (overlap / 2) * ny;
        }
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(step);
  }, [draw]);

  useEffect(() => {
    const n = getControl("n");
    const temp = getControl("temp");
    const mass = getControl("mass");
    particlesRef.current = initParticles(n, temp, mass);
    draw();
  }, []);

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
      title="Ideal Gas — Particle Simulation"
      controls={controls}
      info={info}
      onControlChange={(id, value) => {
        setControls((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
        if (id === "temp" || id === "n" || id === "mass") {
          const n = id === "n" ? value : getControl("n");
          const temp = id === "temp" ? value : getControl("temp");
          const mass = id === "mass" ? value : getControl("mass");
          particlesRef.current = initParticles(n, temp, mass);
        }
      }}
      isPlaying={isPlaying}
      onPlayPause={() => setIsPlaying((p) => !p)}
      onReset={() => {
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
        particlesRef.current = initParticles(getControl("n"), getControl("temp"), getControl("mass"));
        draw();
      }}
    >
      <canvas ref={canvasRef} width={W} height={H} className="w-full aspect-[600/350]" />
    </SimulationCanvas>
  );
}
