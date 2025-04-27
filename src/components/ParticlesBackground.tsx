
import { useCallback, useEffect, useRef } from "react";

export function ParticlesBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  // Canvas particle code: lightweight, responsive, theme-aware
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 85; i++) {
      // x/y as percentages for responsiveness
      const x = (Math.random() * w) | 0;
      const y = (Math.random() * h) | 0;
      const radius = Math.random() * 1.5 + 0.6;
      // Soft color for dark/light
      const color = dark 
        ? `rgba(${150+Math.random()*70},${70+Math.random()*60},${255-Math.random()*60},${0.14 + Math.random() * 0.16})`
        : `rgba(${150+Math.random()*80},${130+Math.random()*70},${255-Math.random()*90},${0.09 + Math.random() * 0.16})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 * Math.random();
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame: number;
    let lastTheme = document.documentElement.classList.contains("dark");
    function resizeAndDraw() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      drawParticles(ctx, canvas.width, canvas.height, lastTheme);
    }
    function loop() {
      let nowTheme = document.documentElement.classList.contains("dark");
      if (nowTheme !== lastTheme) {
        lastTheme = nowTheme;
        resizeAndDraw();
      }
      frame = requestAnimationFrame(loop);
    }
    resizeAndDraw();
    window.addEventListener("resize", resizeAndDraw);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeAndDraw);
      cancelAnimationFrame(frame);
    };
  }, [drawParticles]);

  return (
    <canvas 
      ref={ref} 
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none transition-colors duration-500"
      aria-hidden="true"
    />
  );
}

export default ParticlesBackground;
