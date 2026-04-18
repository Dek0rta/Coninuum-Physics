"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SimulationCanvas, type SimControl } from "./SimulationCanvas";

const W = 600;
const H = 350;
const G = 9.81;

interface State {
  theta: number;  // radians
  omega: number;  // angular velocity
  time: number;
}

const DEFAULT_CONTROLS: SimControl[] = [
  { id: "length", label: "Pendulum Length", min: 0.3, max: 2.5, step: 0.1, value: 1.0, unit: "m" },
  { id: "angle", label: "Initial Angle", min: 5, max: 80, step: 1, value: 30, unit: "°" },
  { id: "damping", label: "Damping", min: 0, max: 0.5, step: 0.01, value: 0.05 },
];

export function Pendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>({ theta: (30 * Math.PI) / 180, omega: 0, time: 0 });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useState<SimControl[]>(DEFAULT_CONTROLS);
  const [info, setInfo] = useState<Record<string, string | number>>({});

  const getControl = (id: string) => controls.find((c) => c.id === id)?.value ?? 0;

  const draw = useCallback((state: State, length: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, W, H);

    const bg = "#0a0f1e";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const pivotX = W / 2;
    const pivotY = 60;
    const pxPerM = 130;
    const bobX = pivotX + Math.sin(state.theta) * length * pxPerM;
    const bobY = pivotY + Math.cos(state.theta) * length * pxPerM;

    // Ceiling
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(pivotX - 40, 0, 80, pivotY);

    // Shadow arc (rest position reference)
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + length * pxPerM);
    ctx.stroke();
    ctx.setLineDash([]);

    // String
    const gradient = ctx.createLinearGradient(pivotX, pivotY, bobX, bobY);
    gradient.addColorStop(0, "#475569");
    gradient.addColorStop(1, "#94a3b8");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Pivot point
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#475569";
    ctx.fill();

    // Bob
    const bobRadius = 18;
    const bobGradient = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
    bobGradient.addColorStop(0, "#60a5fa");
    bobGradient.addColorStop(1, "#2563eb");
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fillStyle = bobGradient;
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Angle arc
    ctx.strokeStyle = "#f59e0b40";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 50, Math.PI / 2 - 0.01, Math.PI / 2 + state.theta, state.theta < 0);
    ctx.stroke();
  }, []);

  const step = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const length = getControl("length");
    const damping = getControl("damping");
    const s = stateRef.current;

    // RK4 for pendulum ODE: θ'' = -(g/L)sin(θ) - b*θ'
    const f = (theta: number, omega: number) => {
      const alpha = -(G / length) * Math.sin(theta) - damping * omega;
      return { dTheta: omega, dOmega: alpha };
    };

    const k1 = f(s.theta, s.omega);
    const k2 = f(s.theta + 0.5 * dt * k1.dTheta, s.omega + 0.5 * dt * k1.dOmega);
    const k3 = f(s.theta + 0.5 * dt * k2.dTheta, s.omega + 0.5 * dt * k2.dOmega);
    const k4 = f(s.theta + dt * k3.dTheta, s.omega + dt * k3.dOmega);

    s.theta += (dt / 6) * (k1.dTheta + 2 * k2.dTheta + 2 * k3.dTheta + k4.dTheta);
    s.omega += (dt / 6) * (k1.dOmega + 2 * k2.dOmega + 2 * k3.dOmega + k4.dOmega);
    s.time += dt;

    const period = 2 * Math.PI * Math.sqrt(length / G);
    setInfo({
      "θ (°)": (s.theta * 180) / Math.PI,
      "ω (rad/s)": s.omega,
      "Period (s)": period,
      "Time (s)": s.time,
    });

    draw(s, length);
    rafRef.current = requestAnimationFrame(step);
  }, [controls, draw]);

  useEffect(() => {
    const l = getControl("length");
    draw(stateRef.current, l);
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

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleReset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
    const angle = getControl("angle");
    stateRef.current = { theta: (angle * Math.PI) / 180, omega: 0, time: 0 };
    setInfo({});
    draw(stateRef.current, getControl("length"));
  };

  const handleControlChange = (id: string, value: number) => {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
    if (id === "angle") {
      stateRef.current.theta = (value * Math.PI) / 180;
    }
  };

  return (
    <SimulationCanvas
      title="Simple Pendulum"
      controls={controls}
      info={info}
      onControlChange={handleControlChange}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onReset={handleReset}
    >
      <canvas ref={canvasRef} width={W} height={H} className="w-full" />
    </SimulationCanvas>
  );
}
