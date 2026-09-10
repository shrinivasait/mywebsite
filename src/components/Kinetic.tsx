"use client";

import { useEffect, useRef, useState } from "react";

/* ── Shared plumbing ────────────────────────────────────────────────────── */

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fire once, the first time the element is on screen.
 *
 * The callback is held in a ref and the effect has no dependencies on
 * purpose: these animations set state every frame, and an effect keyed on a
 * freshly-created callback would tear down and restart itself — and so
 * restart the animation — on every one of those renders.
 */
function useOnScreen<T extends HTMLElement>(run: (el: T) => (() => void) | void) {
  const ref = useRef<T>(null);
  const cb = useRef(run);
  // Kept current in an effect rather than during render: a ref written in the
  // render body is a hook-rules violation, and this one only has to be right
  // by the time the observer fires.
  useEffect(() => {
    cb.current = run;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let stop: (() => void) | void;
    if (!("IntersectionObserver" in window)) {
      stop = cb.current(el);
      return () => stop?.();
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          stop = cb.current(el);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, []);

  return ref;
}

/* ── Scramble ───────────────────────────────────────────────────────────────
   A heading resolves out of noise the first time it is scrolled to: every
   character starts as a random glyph and settles left to right. It is the
   page's signature move, so it is used on section heads and nowhere else.

   The final text is in the DOM from the first render (the scramble only
   overwrites `textContent` afterwards), so it is what a crawler and a screen
   reader get, and it is what shows with scripting off.
   ─────────────────────────────────────────────────────────────────────────── */

const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\|{}[]";

export function Scramble({
  text,
  className = "",
  as: Tag = "span",
  speed = 34,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  speed?: number;
}) {
  const ref = useOnScreen<HTMLElement>((el) => {
    if (reduced()) return;
    const chars = [...text];
    let settled = 0;
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const tick = (now: number) => {
      acc += now - last;
      last = now;
      while (acc > speed && settled <= chars.length) {
        acc -= speed;
        settled += 1;
      }
      el.textContent = chars
        .map((c, i) =>
          i < settled || c === " " ? c : NOISE[(Math.random() * NOISE.length) | 0],
        )
        .join("");
      if (settled <= chars.length) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {text}
    </Tag>
  );
}

/* ── Ticker ─────────────────────────────────────────────────────────────────
   A measured value rolls its digits before it settles, the way a mechanical
   counter does. Only digits move: units, arrows, ranges and currency marks
   stay put, so "650–800 ms" and "6 → 10" both survive.
   ─────────────────────────────────────────────────────────────────────────── */

export function Ticker({ value, className = "" }: { value: string; className?: string }) {
  const [shown, setShown] = useState(value);

  const ref = useOnScreen<HTMLSpanElement>(() => {
    if (reduced()) return;
    const src = [...value];
    let frame = 0;
    const total = 26;
    let raf = 0;

    const tick = () => {
      frame += 1;
      const settle = (frame / total) * src.length;
      setShown(
        src
          .map((c, i) => (/\d/.test(c) && i > settle ? String((Math.random() * 10) | 0) : c))
          .join(""),
      );
      if (frame < total) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

/* ── Scroll progress ────────────────────────────────────────────────────────
   A hairline of the second ink across the top of the running head, written
   straight to the DOM through a ref so a scroll frame never re-renders React.
   ─────────────────────────────────────────────────────────────────────────── */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const write = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="progress" aria-hidden ref={ref} />;
}

/* ── Marquee ────────────────────────────────────────────────────────────────
   The stack, running. Duplicated once and translated by exactly half, which
   is the only way a CSS marquee loops without a seam. It pauses on hover so
   a reader can actually read an item, and it is a plain list underneath.
   ─────────────────────────────────────────────────────────────────────────── */

export function Marquee({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {run.map((s, i) => (
          <span key={i} className="marquee-item">
            {s}
            <i className="marquee-sep">/</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Magnetic ───────────────────────────────────────────────────────────────
   A control leans a couple of pixels toward the pointer inside its own box.
   Pointer devices only, capped at 4px, dropped under reduced motion: it is a
   hint that the thing is alive, not a toy that moves targets away from a
   cursor trying to hit them.
   ─────────────────────────────────────────────────────────────────────────── */

export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      target.style.transform = `translate(${dx * 4}px, ${dy * 3}px)`;
    };
    const onLeave = () => {
      target.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
