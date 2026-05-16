"use client";

import { useEffect, useRef } from "react";

export function PixelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 200, H = 120;
    canvas.width = W;
    canvas.height = H;

    let t = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const edgeLeft = Math.floor(W * 0.05);
      const edgeRight = Math.floor(W * 0.95);

      ctx.fillStyle = "#1B3BFF";
      for (let i = 0; i < 14; i++) {
        const seed = Math.sin(t * 0.3 + i * 1.7);
        const y = ((i * 11 + Math.floor(t * 2)) % H);
        const xL = Math.floor(Math.abs(seed) * edgeLeft);
        ctx.fillRect(xL, y, 1, 1);
        const xR = edgeRight + Math.floor(Math.abs(Math.cos(t * 0.2 + i)) * (W - edgeRight));
        ctx.fillRect(xR, (y + 30) % H, 1, 1);
      }

      ctx.fillStyle = "#080808";
      for (let i = 0; i < 8; i++) {
        const y = ((i * 17 + Math.floor(t * 1.3)) % H);
        ctx.fillRect(Math.floor(Math.random() * edgeLeft), y, 1, 1);
        ctx.fillRect(edgeRight + Math.floor(Math.random() * (W - edgeRight)), (y + 60) % H, 1, 1);
      }

      t += 0.05;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
