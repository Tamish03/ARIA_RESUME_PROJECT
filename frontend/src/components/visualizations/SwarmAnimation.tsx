"use client";

import { useEffect, useRef } from "react";

export function SwarmAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    // PSO Parameters
    const numParticles = 12;
    const gBest = { x: width * 0.7, y: height * 0.3 }; // Goal area
    
    const particles = Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      pBest: { x: 0, y: 0 },
      history: [] as {x: number, y: number}[]
    }));

    // Initialize pBest
    particles.forEach(p => {
      p.pBest.x = p.x;
      p.pBest.y = p.y;
    });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw global best
      ctx.beginPath();
      ctx.arc(gBest.x, gBest.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 166, 35, 1)";
      ctx.shadowColor = "rgba(245, 166, 35, 0.8)";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      particles.forEach((p) => {
        // Simple PSO update
        const w = 0.5; // inertia
        const c1 = 0.8; // cognitive
        const c2 = 0.9; // social
        
        const r1 = Math.random();
        const r2 = Math.random();
        
        p.vx = w * p.vx + c1 * r1 * (p.pBest.x - p.x) + c2 * r2 * (gBest.x - p.x);
        p.vy = w * p.vy + c1 * r1 * (p.pBest.y - p.y) + c2 * r2 * (gBest.y - p.y);
        
        // Limit velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4;
          p.vy = (p.vy / speed) * 4;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Keep in bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Record history
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 20) {
          p.history.shift();
        }

        // Draw trail
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let i = 1; i < p.history.length; i++) {
            ctx.lineTo(p.history[i].x, p.history[i].y);
          }
          ctx.strokeStyle = "rgba(245, 166, 35, 0.2)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 166, 35, 0.8)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-xl bg-bg-surface border border-border"
    />
  );
}
