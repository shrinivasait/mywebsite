"use client";

import { useEffect, useRef } from "react";

/**
 * The page's weather: sparse columns of characters falling behind everything,
 * at an opacity where they read as texture rather than as text you are being
 * asked to follow, plus a soft light that tracks the pointer.
 *
 * Rules it keeps so it stays a background and not a nuisance:
 *  · it never draws over prose at readable contrast (alpha caps at ~0.16);
 *  · it stops entirely when the tab is hidden or the user asks for less motion;
 *  · it reads its two colours from the theme tokens, so the negative flips it;
 *  · it is `aria-hidden` and pointer-transparent.
 */

const GLYPHS = "01<>{}[]()=+-*/;:_$#λ∑∆→←↑↓abcdefRAGLLMagentvoice";
const COL_W = 18;
const ROW_H = 20;

export function AmbientCode() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (quiet.matches) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    /** Head position of each column, in rows, and its fall speed. */
    let head: Float32Array = new Float32Array(0);
    let speed: Float32Array = new Float32Array(0);
    let seed: Float32Array = new Float32Array(0);

    const theme = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        ink: s.getPropertyValue("--ambient-ink").trim() || "#0a93c4",
        hot: s.getPropertyValue("--ambient-hot").trim() || "#14171b",
        alpha: Number(s.getPropertyValue("--ambient-alpha")) || 0.14,
      };
    };
    let paint = theme();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / COL_W);
      head = new Float32Array(cols);
      speed = new Float32Array(cols);
      seed = new Float32Array(cols);
      for (let i = 0; i < cols; i += 1) {
        head[i] = -Math.random() * (h / ROW_H) * 2;
        speed[i] = 0.10 + Math.random() * 0.32;
        seed[i] = Math.random() * 1000;
      }
    };
    resize();

    // The pointer light, eased toward the real pointer so it lags like glass.
    const light = { x: w / 2, y: h * 0.3, tx: w / 2, ty: h * 0.3 };
    const onMove = (e: PointerEvent) => {
      light.tx = e.clientX;
      light.ty = e.clientY;
    };

    let raf = 0;
    let running = true;
    const rows = () => Math.ceil(h / ROW_H) + 2;

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      light.x += (light.tx - light.x) * 0.05;
      light.y += (light.ty - light.y) * 0.05;

      const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 340);
      g.addColorStop(0, paint.ink);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textBaseline = "top";

      const R = rows();
      for (let c = 0; c < cols; c += 1) {
        head[c] += speed[c];
        if (head[c] - 14 > R) head[c] = -Math.random() * 18;

        const x = c * COL_W + 3;
        // A short tail behind each head, fading out.
        for (let t = 0; t < 14; t += 1) {
          const r = Math.floor(head[c]) - t;
          if (r < 0 || r > R) continue;
          const y = r * ROW_H;
          // Stable-per-cell glyph choice, so characters do not strobe.
          const n = Math.abs(Math.sin(seed[c] + r * 12.9898) * 43758.5453);
          const ch = GLYPHS[Math.floor(n % GLYPHS.length)];
          const fade = (1 - t / 14) ** 2;
          // Proximity to the pointer light brightens a cell a little.
          const d = Math.hypot(x - light.x, y - light.y);
          const near = Math.max(0, 1 - d / 300);
          ctx.globalAlpha = Math.min(paint.alpha, fade * paint.alpha * (1 + near * 2.2));
          ctx.fillStyle = t === 0 ? paint.hot : paint.ink;
          ctx.fillText(ch, x, y);
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      const hidden = document.hidden;
      if (hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!hidden && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    // The theme tokens change under the toggle; re-read them when the class
    // on <html> flips rather than sampling every frame.
    const mo = new MutationObserver(() => {
      paint = theme();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="ambient" aria-hidden />;
}
