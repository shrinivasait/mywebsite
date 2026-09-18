"use client";

import { useEffect } from "react";

/**
 * Light that follows the pointer.
 *
 * One delegated listener for the whole document rather than a listener per
 * card, and it writes two custom properties on the card under the cursor —
 * nothing else. The highlight itself is CSS, so the work per frame is a style
 * write on one element and a composited repaint.
 *
 * Only the surfaces that read as objects take it: the system cards, the
 * organisation panels, the charts and the seats. Text blocks do not, because a
 * light that follows the cursor across a paragraph is a distraction rather
 * than a response.
 */
const GLOW = ".cn-system, .cn-pillar, .cn-chart, .cn-rail-seg, .cn-field-row";

export function Pointer() {
  useEffect(() => {
    // A device without a fine pointer never sees this, so it never listens.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;
    let lit: HTMLElement | null = null;

    const paint = () => {
      raf = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(GLOW) ?? null;

      if (el !== lit) {
        lit?.removeAttribute("data-lit");
        lit = el;
        lit?.setAttribute("data-lit", "1");
      }
      if (!el) return;

      const r = el.getBoundingClientRect();
      pending = {
        el,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      lit?.removeAttribute("data-lit");
      lit = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      lit?.removeAttribute("data-lit");
    };
  }, []);

  return null;
}
