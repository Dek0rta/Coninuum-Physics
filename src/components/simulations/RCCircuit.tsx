"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SimulationCanvas, type SimControl } from "./SimulationCanvas";

const W = 600;
const H = 350;

const DEFAULT_CONTROLS: SimControl[] = [
  { id: "resistance", label: "Resistance (R)", min: 100, max: 10000, step: 100, value: 1000, unit: "Ω" },
  { id: "capacitance", label: "Capacitance (C)", min: 1, max: 100, step: 1, value: 10, unit: "μF" },
  { id: "voltage", label: "Source Voltage", min: 1, max: 24, step: 1, value: 9, unit: "V" },
];

export function RCCircuit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const vcRef = useRef<number>(0); // capacitor voltage
  const chargingRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useState<SimControl[]>(DEFAULT_CONTROLS);
  const [info, setInfo] = useState<Record<string, string | number>>({});
  const historyRef = useRef<{ t: number; vc: number }[]>([]);

  const getControl = (id: string) => controls.find((c) => c.id === id)?.value ?? 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const R = getControl("resistance");
    const C = getControl("capacitance") * 1e-6;
    const Vs = getControl("voltage");
    const tau = R * C;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, W, H);

    // Chart area
    const chartX = 50;
    const chartY = 20;
    const chartW = W - 100;
    const chartH = H - 80;

    // Grid
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = chartY + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartW, y);
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.font = "10px monospace";
      ctx.fillText(`${(Vs * (1 - i / 5)).toFixed(1)}V`, 5, y + 4);
    }

    for (let i = 0; i <= 4; i++) {
      const x = chartX + (chartW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartH);
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.fillText(`${(tau * i).toFixed(3)}s`, x - 10, chartY + chartH + 15);
    }

    // Theoretical curve
    ctx.strokeStyle = "#1d4ed840";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let px = 0; px <= chartW; px++) {
      const t = (px / chartW) * tau * 4;
      const vc = Vs * (1 - Math.exp(-t / tau));
      const py = chartY + chartH - (vc / Vs) * chartH;
      if (px === 0) ctx.moveTo(chartX + px, py);
      else ctx.lineTo(chartX + px, py);
    }
    ctx.stroke();

    // Actual history
    if (historyRef.current.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      historyRef.current.forEach(({ t, vc }, i) => {
        const px = Math.min((t / (tau * 4)) * chartW, chartW);
        const py = chartY + chartH - (vc / Vs) * chartH;
        if (i === 0) ctx.moveTo(chartX + px, py);
        else ctx.lineTo(chartX + px, py);
      });
      ctx.stroke();
    }

    // Current point
    const lastPt = historyRef.current[historyRef.current.length - 1];
    if (lastPt) {
      const px = Math.min((lastPt.t / (tau * 4)) * chartW, chartW);
      const py = chartY + chartH - (lastPt.vc / Vs) * chartH;
      ctx.beginPath();
      ctx.arc(chartX + px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
    }

    // Tau marker
    const tauX = chartX + (1 / 4) * chartW;
    ctx.strokeStyle = "#f59e0b60";
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tauX, chartY);
    ctx.lineTo(tauX, chartY + chartH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "10px monospace";
    ctx.fillText("τ", tauX - 3, chartY - 5);

    // Title
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("V_C(t) = V₀(1 - e^(-t/RC))", chartX + 10, chartY + 15);

    setInfo({
      "V_C (V)": vcRef.current.toFixed(3),
      "τ (ms)": (tau * 1000).toFixed(1),
      "I (mA)": (((Vs - vcRef.current) / R) * 1000).toFixed(3),
      "Time (s)": timeRef.current.toFixed(3),
    });
  }, [controls]);

  const step = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const R = getControl("resistance");
    const C = getControl("capacitance") * 1e-6;
    const Vs = getControl("voltage");
    const tau = R * C;

    timeRef.current += dt;

    // RC charging: V_C(t) = Vs*(1 - e^(-t/τ))
    vcRef.current = Vs * (1 - Math.exp(-timeRef.current / tau));

    historyRef.current.push({ t: timeRef.current, vc: vcRef.current });
    // Keep 4τ worth of history
    const maxT = tau * 4;
    historyRef.current = historyRef.current.filter((p) => p.t >= timeRef.current - maxT);

    if (timeRef.current > tau * 5) {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }

    draw();
    rafRef.current = requestAnimationFrame(step);
  }, [controls, draw]);

  useEffect(() => { draw(); }, [draw]);

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
      title="RC Circuit — Capacitor Charging"
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
        vcRef.current = 0;
        historyRef.current = [];
        setInfo({});
        draw();
      }}
    >
      <canvas ref={canvasRef} width={W} height={H} className="w-full aspect-[600/350]" />
    </SimulationCanvas>
  );
}
