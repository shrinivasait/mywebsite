"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";
import { BUDGET_MS, CEILING_MS, offsets, stages } from "./turn";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "latency", label: "Latency" },
  { id: "leadership", label: "Leadership" },
  { id: "depth", label: "Depth" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** The running head. The live section is marked by a rule that draws itself in. */
export function Head() {
  const [live, setLive] = useState<string>("work");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setLive(hit.target.id);
      },
      { rootMargin: "-78px 0px -64% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="lx-head">
      <div className="lx-shell lx-head-in">
        <span className="lx-mark">
          Shreenivas <span>Joshi</span>
        </span>
        <nav className="lx-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-live={live === s.id ? "1" : "0"}>
              {s.label}
            </a>
          ))}
        </nav>
        <a className="lx-cta" href={`mailto:${site.email}`}>
          Enquire
        </a>
      </div>
    </header>
  );
}

/**
 * Arrival. One gesture for the whole page — rise, resolve, unblur — staggered
 * by a few tens of milliseconds between siblings, with a hard fallback so a
 * stalled observer can never cost the reader the content.
 */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".lx-in"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement;
            el.style.setProperty("--d", `${Math.min(i, 5) * 70}ms`);
            el.dataset.seen = "1";
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));

    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.dataset.seen !== "1") el.dataset.fallback = "1";
      });
    }, 1400);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);
  return null;
}

/** Copies a value and says so, then goes quiet again. */
export function Copy({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 1800);
    return () => window.clearTimeout(id);
  }, [done]);
  return (
    <button
      type="button"
      className="lx-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
        } catch {
          // Clipboard refused; the value is on screen and selectable anyway.
        }
      }}
    >
      {done ? "Copied" : `Copy ${label}`}
    </button>
  );
}

/**
 * The instrument: one spoken turn on a chronometer dial.
 *
 * The ring is the 800 ms ceiling. Each hop of the turn owns a sector of it,
 * sized by its budget, and a hand sweeps the sectors in real proportion —
 * every fourth turn running long in retrieval, because that is where an
 * overrun actually comes from. Hovering a hop lights its sector and states
 * what it does and the decision that keeps it inside its slice.
 *
 * It draws a designed budget rather than live traffic, and the caption says
 * so. Every figure comes from `turn.ts`.
 */
const RATE = 0.26; // animation ms → real ms
const GAP_MS = 700;
const HOT_EVERY = 4;

export function Instrument() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef<number>(-1);
  const [hover, setHover] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const selected = hover >= 0 ? hover : 3; // the reasoning hop, when nothing is picked

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(host);
    const read = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const gold = read("--lx-gold", "#c9a15a");
    const goldLit = read("--lx-gold-lit", "#e6cf9c");
    const goldDeep = read("--lx-gold-deep", "#8c6c33");
    const paper3 = read("--lx-paper-3", "#8d887e");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let size = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = host.getBoundingClientRect();
      size = Math.max(1, Math.min(r.width, r.height));
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* The dial: a 280° sweep with the gap at the bottom, the way a
       chronometer leaves room for its register. */
    const START = Math.PI * 0.62;
    const SWEEP = Math.PI * 1.76;
    const angle = (ms: number) => START + (Math.min(ms, CEILING_MS) / CEILING_MS) * SWEEP;

    let t = 0;
    let turns = 0;
    let stretch = 1;

    const beginTurn = () => {
      turns += 1;
      stretch = turns % HOT_EVERY === 0 ? 1.2 : 0.98 + Math.random() * 0.04;
    };

    const draw = (ms: number) => {
      const c = size / 2;
      const r = size * 0.4;
      ctx.clearRect(0, 0, size, size);

      // Tick ring: every 25 ms, with a longer tick each 100.
      for (let v = 0; v <= CEILING_MS; v += 25) {
        const a = angle(v);
        const long = v % 100 === 0;
        const r1 = r + size * 0.045;
        const r2 = r1 + (long ? size * 0.028 : size * 0.014);
        ctx.strokeStyle = long ? gold : goldDeep;
        ctx.globalAlpha = long ? 0.85 : 0.45;
        ctx.lineWidth = long ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1);
        ctx.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // The seat the sectors sit in: a recessed channel with a lit inner lip.
      ctx.strokeStyle = "rgb(0 0 0 / 0.55)";
      ctx.lineWidth = size * 0.075;
      ctx.beginPath();
      ctx.arc(c, c, r, START, START + SWEEP);
      ctx.stroke();
      ctx.strokeStyle = goldDeep;
      ctx.globalAlpha = 0.34;
      ctx.lineWidth = size * 0.055;
      ctx.beginPath();
      ctx.arc(c, c, r, START, START + SWEEP);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Two hairline circles, inside and outside the channel.
      ctx.strokeStyle = goldDeep;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      [r - size * 0.042, r + size * 0.042].forEach((rr) => {
        ctx.beginPath();
        ctx.arc(c, c, rr, START, START + SWEEP);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // One sector per hop, in proportion, with a hairline of space between.
      const lit = hoverRef.current;
      stages.forEach((s, i) => {
        const a0 = angle(offsets[i]) + 0.012;
        const a1 = angle(offsets[i] + s.ms) - 0.012;
        const isLit = i === lit;
        // Brushed metal: the sector is drawn along a gradient so the light
        // runs across it rather than sitting flat on it.
        const g = ctx.createLinearGradient(
          c + Math.cos(a0) * r,
          c + Math.sin(a0) * r,
          c + Math.cos(a1) * r,
          c + Math.sin(a1) * r,
        );
        g.addColorStop(0, isLit ? gold : goldDeep);
        g.addColorStop(0.5, isLit ? goldLit : gold);
        g.addColorStop(1, isLit ? gold : goldDeep);
        ctx.strokeStyle = g;
        ctx.globalAlpha = isLit ? 1 : 0.58;
        ctx.lineWidth = size * (isLit ? 0.072 : 0.055);
        if (isLit) {
          ctx.shadowColor = "rgb(230 207 156 / 0.55)";
          ctx.shadowBlur = size * 0.05;
        }
        ctx.beginPath();
        ctx.arc(c, c, r, a0, a1);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;

      // The hand, and the mark it has reached.
      const a = angle(ms);
      const hx = c + Math.cos(a) * (r + size * 0.028);
      const hy = c + Math.sin(a) * (r + size * 0.028);
      ctx.strokeStyle = goldLit;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(a) * (size * 0.16), c + Math.sin(a) * (size * 0.16));
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = goldLit;
      ctx.beginPath();
      ctx.arc(hx, hy, size * 0.011, 0, Math.PI * 2);
      ctx.fill();

      // The ceiling, marked once on the ring.
      const ac = angle(CEILING_MS);
      ctx.strokeStyle = paper3;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(ac) * (r - size * 0.05), c + Math.sin(ac) * (r - size * 0.05));
      ctx.lineTo(c + Math.cos(ac) * (r + size * 0.05), c + Math.sin(ac) * (r + size * 0.05));
      ctx.stroke();
    };

    if (still) {
      draw(BUDGET_MS);
      const once = requestAnimationFrame(() => setElapsed(BUDGET_MS));
      return () => {
        cancelAnimationFrame(once);
        ro.disconnect();
      };
    }

    beginTurn();
    let raf = 0;
    let prev = performance.now();
    let since = 0;

    const loop = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;
      t += dt;
      const len = (BUDGET_MS * stretch) / RATE;
      if (t > len + GAP_MS) {
        t = 0;
        beginTurn();
      }
      const ms = (Math.min(t, len) / len) * BUDGET_MS * stretch;
      draw(ms);
      since += dt;
      if (since > 100) {
        since = 0;
        setElapsed(Math.round(ms));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const hop = stages[selected];

  return (
    <div className="lx-instrument lx-in">
      <div>
        <div ref={hostRef} className="lx-dial">
          <canvas ref={canvasRef} aria-hidden />
          <div className="lx-dial-read">
            <b>
              {elapsed}
              <i>ms</i>
            </b>
            <span>elapsed of {CEILING_MS} ms ceiling</span>
          </div>
        </div>
      </div>

      <div>
        <div className="lx-hops" role="tablist" aria-label="Hops in one spoken turn">
          {stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`lx-hop-${s.id}`}
              aria-selected={i === selected}
              aria-controls="lx-hop-note"
              className="lx-hop"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
              onClick={() => setHover(i)}
            >
              <span className="lx-hop-name">{s.name}</span>
              <span className="lx-hop-ms">{s.ms}</span>
            </button>
          ))}
        </div>

        <div
          className="lx-hop-note"
          id="lx-hop-note"
          role="tabpanel"
          aria-labelledby={`lx-hop-${hop.id}`}
        >
          <p>{hop.what}</p>
          <p>{hop.lever}</p>
        </div>
      </div>
    </div>
  );
}

export const TURN_TOTAL = BUDGET_MS;
