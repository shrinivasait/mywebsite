"use client";

import { useEffect, useRef, useState } from "react";

/* ── The name ───────────────────────────────────────────────────────────────
   Set enormous, and arriving one glyph at a time. Each character is its own
   inline-block with a delay set from its index, so the whole thing is one CSS
   transition per glyph rather than a script animating text.

   The plain string stays in the accessible tree via `aria-label` on the
   heading and `aria-hidden` on the pieces, so nothing reads it letter by
   letter, and the spans still contain the real characters for a crawler.
   ─────────────────────────────────────────────────────────────────────────── */

export function MegaName({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // A frame after mount, not on mount: the start state has to be painted
    // once or the transition has nothing to travel from.
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const words = text.split(" ");
  let n = 0;

  return (
    <h1
      ref={ref}
      aria-label={text}
      className={`mega ${ready ? "is-in" : ""} ${className}`}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((ch) => {
            const d = n * 34;
            n += 1;
            return (
              <span key={n} className="mega-ch" data-ch={ch} style={{ ["--d" as string]: `${d}ms` }}>
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="mega-ch">&nbsp;</span>}
        </span>
      ))}
    </h1>
  );
}

/* ── Tilt ───────────────────────────────────────────────────────────────────
   A panel leans into the pointer. Five degrees maximum, written as two CSS
   variables so the easing stays in the stylesheet and the card settles back
   rather than snapping.
   ─────────────────────────────────────────────────────────────────────────── */

export function Tilt({
  children,
  className = "",
  max = 5,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", `${px * max * 2}deg`);
        el.style.setProperty("--rx", `${-py * max * 2}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

/* ── The status rail ────────────────────────────────────────────────────────
   Four readouts under the hero, each with a trace behind it.

   An honesty note, because this is the one place a portfolio is tempted to
   lie: three of these are figures from the résumé and they do not move. Only
   the trace behind them moves, and the rail says in its own label that the
   traces are the shape these systems run at, not a live feed from anything.
   A fake dashboard reporting fake live traffic would be the exact thing this
   whole document is built to avoid.
   ─────────────────────────────────────────────────────────────────────────── */

type Gauge = {
  label: string;
  value: string;
  unit: string;
  /** Centre of the trace, 0–1, and how much it wanders. */
  base: number;
  swing: number;
};

const GAUGES: Gauge[] = [
  { label: "Voice round trip", value: "650–800", unit: "ms", base: 0.62, swing: 0.16 },
  { label: "Team led", value: "18", unit: "engineers", base: 0.78, swing: 0.06 },
  { label: "Retrieval p95", value: "1.9", unit: "s", base: 0.45, swing: 0.2 },
  { label: "Years in AI", value: "5", unit: "years", base: 0.55, swing: 0.1 },
];

const N = 44;

function Spark({ base, swing, phase }: { base: number; swing: number; phase: number }) {
  const ref = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const path = ref.current;
    const head = headRef.current;
    if (!path || !head) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A ring buffer seeded with the resting shape, advanced a few times a
    // second — not every frame. A trace that redraws at 60 Hz is noise.
    const data = Array.from({ length: N }, (_, i) => base + Math.sin(i * 0.4 + phase) * swing * 0.5);
    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      if (now - last > 90) {
        last = now;
        data.shift();
        const prev = data[data.length - 1];
        // A random walk pulled back toward the resting value, so it wanders
        // without drifting off the top of the box.
        const next = prev + (Math.random() - 0.5) * swing * 0.9 + (base - prev) * 0.25;
        data.push(Math.max(0.06, Math.min(0.94, next)));

        const d = data
          .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (N - 1)) * 100).toFixed(2)} ${((1 - v) * 22).toFixed(2)}`)
          .join(" ");
        path.setAttribute("d", d);
        head.setAttribute("x", "98.6");
        head.setAttribute("y", ((1 - data[data.length - 1]) * 22 - 1.4).toFixed(2));
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [base, swing, phase]);

  const seed = Array.from({ length: N }, (_, i) => base + Math.sin(i * 0.4 + phase) * swing * 0.5)
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (N - 1)) * 100).toFixed(2)} ${((1 - v) * 22).toFixed(2)}`)
    .join(" ");

  return (
    <svg className="spark" viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden>
      <path ref={ref} className="spark-path" d={seed} />
      <rect ref={headRef} className="spark-head" x="98.6" y="10" width="2.8" height="2.8" />
    </svg>
  );
}

export function StatusRail() {
  return (
    <div className="rail" role="group" aria-label="Key figures">
      {GAUGES.map((g, i) => (
        <div key={g.label} className="rail-cell">
          <p className="hud">{g.label}</p>
          <p className="rail-value mt-1.5">
            {g.value}
            <span className="ml-1 text-[0.75rem] font-normal tracking-normal text-ink-3">
              {g.unit}
            </span>
          </p>
          <Spark base={g.base} swing={g.swing} phase={i * 1.7} />
        </div>
      ))}
    </div>
  );
}

/* ── The timeline spine ─────────────────────────────────────────────────────
   A line down the experience list that fills as the list is scrolled, with a
   node at each role that lights as it passes. The list itself is unchanged
   underneath: this is a scroll indicator for one section, not the structure.
   ─────────────────────────────────────────────────────────────────────────── */

export function TimelineSpine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fill = el?.firstElementChild as HTMLElement | undefined;
    const section = el?.closest("ol");
    if (!el || !fill || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.height = "100%";
      return;
    }

    const nodes = Array.from(section.querySelectorAll<HTMLElement>(".timeline-node"));
    let raf = 0;

    const write = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const mark = window.innerHeight * 0.55;
      const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
      fill.style.height = `${p * 100}%`;
      const lit = mark;
      for (const n of nodes) {
        n.classList.toggle("is-lit", n.getBoundingClientRect().top <= lit);
      }
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

  return (
    <div className="timeline-spine" ref={ref} aria-hidden>
      <i />
    </div>
  );
}

/* ── Uptime ─────────────────────────────────────────────────────────────────
   How long this tab has been open, in the running head. It is the one number
   on the page that is genuinely live, and it is honest about being trivial.
   ─────────────────────────────────────────────────────────────────────────── */

export function Uptime() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const s = Math.floor((performance.now() - t0) / 1000);
      el.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span ref={ref} suppressHydrationWarning>
      00:00
    </span>
  );
}

/* ── Words ──────────────────────────────────────────────────────────────────
   A sentence split into words so it can land one at a time. The split is
   done in the markup, not by script, so the text is complete in the HTML and
   a screen reader gets one continuous string rather than a stack of spans —
   the wrapper carries the sentence as its accessible name and the pieces are
   hidden from the tree.
   ─────────────────────────────────────────────────────────────────────────── */

export function Words({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} data-words aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="word">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* ── Parallax ───────────────────────────────────────────────────────────────
   Two planes leaving at different rates. `depth` is a fraction of the scroll
   distance, so 0.12 means the element lags the page by twelve per cent.

   Kept deliberately shallow. Parallax on a document is a way of saying "this
   surface is closer than that one"; past about fifteen per cent it starts
   saying "this text is not attached to anything", which is a different and
   much worse sentence.
   ─────────────────────────────────────────────────────────────────────────── */

export function Parallax({
  children,
  depth = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const write = () => {
      raf = 0;
      // Only while the hero is anywhere near the viewport: past that the
      // element is off screen and the transform is wasted work.
      const y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      el.style.transform = `translate3d(0, ${(y * depth).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [depth]);

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}
