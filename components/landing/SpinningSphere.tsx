"use client";

import { useEffect, useRef } from "react";

const WORDS = [
  "SYSTEM", "NEURAL", "QUANTUM", "CYBER", "VOID",
  "NEXUS", "MATRIX", "FLUX", "SYNC", "DATA",
  "NODE", "PULSE", "AETHER", "CORE", "GRID",
  "ECHO", "ARCHIVE", "PROTOCOL", "ORBIT", "VECTOR",
  "LOGIC", "SYNAPSE", "VERTEX", "WAVE", "ZENITH",
];

interface Point3D {
  x: number;
  y: number;
  z: number;
  word: string;
}

export default function SpinningSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Golden angle sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    const points: Point3D[] = WORDS.map((word, i) => {
      const y = 1 - (i / (WORDS.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      return {
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        word,
      };
    });

    let angleY = 0;
    let angleX = 0.3;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.min(W, H) * 0.38;

      ctx.clearRect(0, 0, W, H);

      angleY += 0.004;
      angleX += 0.002;

      const sinY = Math.sin(angleY), cosY = Math.cos(angleY);
      const sinX = Math.sin(angleX), cosX = Math.cos(angleX);

      // Rotate + project each point
      const projected = points.map((p) => {
        // Rotate Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = (z2 + 2) / 3; // perspective
        return {
          sx: cx + x1 * radius * scale,
          sy: cy + y2 * radius * scale,
          scale,
          word: p.word,
        };
      });

      // Sort back to front
      projected.sort((a, b) => a.scale - b.scale);

      const dpr = window.devicePixelRatio;
      projected.forEach(({ sx, sy, scale, word }) => {
        const alpha = Math.max(0.05, (scale - 0.33) / 0.67);
        const fontSize = Math.round(9 * scale * dpr);
        ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
        ctx.fillStyle = `rgba(27, 59, 255, ${alpha})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, sx, sy);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-transparent">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
