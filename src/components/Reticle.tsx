"use client";

import { useEffect, useRef } from "react";

/**
 * A viewfinder that follows the pointer, with a live coordinate readout, and
 * that opens up when the pointer is over something you can act on.
 *
 * The native cursor is deliberately left alone. Replacing it costs the text
 * I-beam, the link pointer and the resize handles, and buys a slightly
 * cooler screenshot; an instrument that *watches* the pointer keeps both.
 *
 * Everything is written straight to the element through a ref inside one rAF
 * loop, so pointer movement never re-renders React. Fine pointers only, off
 * under reduced motion.
 */

const HOT = "a, button, input, textarea, select, summary, [role='button']";

export function Reticle() {
  const ref = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const read = readRef.current;
    if (!el || !read) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let live = false;
    let hot = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!live) {
        // Jump to the first position rather than flying in from the corner.
        x = tx;
        y = ty;
        live = true;
        el.classList.add("is-live");
      }
      const over = !!(e.target as Element)?.closest?.(HOT);
      if (over !== hot) {
        hot = over;
        el.classList.toggle("is-hot", hot);
      }
    };

    const onLeave = () => {
      live = false;
      el.classList.remove("is-live");
    };

    const frame = () => {
      // A light lag: the instrument trails the pointer instead of being
      // welded to it, which is what makes it read as a separate object.
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      read.textContent = `${Math.round(tx)} ${Math.round(ty)}`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="reticle" ref={ref} aria-hidden>
      <i />
      <i />
      <i />
      <i />
      <b ref={readRef} />
    </div>
  );
}
