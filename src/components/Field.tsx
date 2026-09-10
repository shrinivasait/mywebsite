"use client";

import { useEffect, useRef } from "react";

/**
 * The room the document is read in.
 *
 * A lattice of points on a fixed grid. Three things move them: a slow
 * standing wave, the pointer (which pushes points away and brightens them),
 * and scroll velocity (which shears the whole lattice and then settles). A
 * handful of packets run along the rows, because a machine room should have
 * something going somewhere.
 *
 * This replaces the falling-glyph backdrop of the first pass. Glyph rain is
 * the single most-used "technical" backdrop there is, and it was competing
 * with the terminal — which is the thing on this page that actually has code
 * in it. A lattice says "structure under everything" without pretending to
 * be a second screen.
 *
 * It is cheap on purpose: one canvas, capped DPR, points drawn as 1–2px
 * rects with no shadows, halted whenever the tab is hidden.
 */

const GAP = 34;
const MAX_POINTS = 5200;

type Packet = { row: number; x: number; v: number };

export function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let step = GAP;

    const paint = { dot: "#4fe3ff", line: "#e9f4f6", alpha: 0.34 };
    const readTheme = () => {
      const s = getComputedStyle(document.documentElement);
      paint.dot = s.getPropertyValue("--field-dot").trim() || paint.dot;
      paint.alpha = Number(s.getPropertyValue("--ambient-alpha")) || 0.12;
    };
    readTheme();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Coarsen the lattice rather than let the point count explode on a
      // large display: the look is the spacing, not the absolute count.
      step = GAP;
      while (Math.ceil(w / step) * Math.ceil(h / step) > MAX_POINTS) step += 6;
      cols = Math.ceil(w / step) + 1;
      rows = Math.ceil(h / step) + 1;
    };
    resize();

    const packets: Packet[] = Array.from({ length: 5 }, () => ({
      row: Math.floor(Math.random() * rows),
      x: Math.random() * w,
      v: 90 + Math.random() * 220,
    }));

    const ptr = { x: -999, y: -999, tx: -999, ty: -999 };
    const onMove = (e: PointerEvent) => {
      ptr.tx = e.clientX;
      ptr.ty = e.clientY;
    };

    // Scroll velocity, decayed each frame: a fast flick shears the lattice,
    // and it eases back to rest on its own.
    let lastY = window.scrollY;
    let shear = 0;
    const onScroll = () => {
      const y = window.scrollY;
      shear += (y - lastY) * 0.06;
      shear = Math.max(-26, Math.min(26, shear));
      lastY = y;
    };

    let t = 0;
    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      ptr.x += (ptr.tx - ptr.x) * 0.12;
      ptr.y += (ptr.ty - ptr.y) * 0.12;
      shear *= 0.9;

      for (let r = 0; r < rows; r += 1) {
        const gy = r * step;
        for (let c = 0; c < cols; c += 1) {
          const gx = c * step;

          // The standing wave. Two frequencies so the lattice never reads as
          // one obvious sine.
          const wave =
            Math.sin(gx * 0.008 + t * 0.5) * 2.2 + Math.cos(gy * 0.011 - t * 0.35) * 1.8;

          // The pointer push.
          const dx = gx - ptr.x;
          const dy = gy - ptr.y;
          const d2 = dx * dx + dy * dy;
          const near = d2 < 42000 ? 1 - d2 / 42000 : 0;
          const push = near * near * 26;
          const len = Math.sqrt(d2) || 1;

          const x = gx + wave + (dx / len) * push + shear * (r / rows);
          const y = gy + wave * 0.6 + (dy / len) * push;

          // A point is dim by default and lights near the pointer. The cap
          // keeps it under prose at all times.
          const a = paint.alpha * (0.32 + near * 2.6);
          ctx.globalAlpha = Math.min(0.42, a);
          ctx.fillStyle = paint.dot;
          const s = near > 0.55 ? 2 : 1;
          ctx.fillRect(x, y, s, s);
        }
      }

      // Packets: a bright mark running a row, wrapping at the edge.
      for (const p of packets) {
        p.x += p.v / 60;
        if (p.x > w + 40) {
          p.x = -40;
          p.row = Math.floor(Math.random() * rows);
          p.v = 90 + Math.random() * 220;
        }
        const y = p.row * step;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = paint.dot;
        ctx.fillRect(p.x, y - 0.5, 14, 1.5);
        ctx.globalAlpha = 0.18;
        ctx.fillRect(p.x - 34, y, 34, 1);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastY = window.scrollY;
        raf = requestAnimationFrame(frame);
      }
    };

    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // The CSS grid on this element is the static floor of the room; the canvas
  // is the part that moves. If the canvas never starts, the room still has a
  // floor.
  return (
    <div className="field" aria-hidden>
      <canvas ref={ref} className="block size-full" />
    </div>
  );
}
