"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blocks, path, pads } from "./die";
import { BUDGET_MS, CEILING_MS, stages } from "./turn";

/**
 * The die.
 *
 * The canvas is the photomicrograph — substrate, routing, cell arrays, pad
 * ring and the charge running the critical path. Every label and every control
 * is real DOM on top of it, so the floorplan is readable by a screen reader,
 * operable from the keyboard, and crisp at any pixel ratio. The two layers
 * share one model (`die.ts`), which is what keeps them aligned without either
 * measuring the other.
 *
 * The moving part is not decoration: the packet is one spoken turn, its legs
 * timed from the same budget the page quotes, and the readout counts real
 * milliseconds. Every fourth turn stalls in RETRIEVAL, because that is where
 * an overrun actually comes from.
 */

const RATE = 0.3; // animation ms → real ms
const GAP_MS = 620;
const HOT_EVERY = 4;

const msFor = (hop: string) => stages.find((s) => s.id === hop)?.ms ?? 100;

type Readout = { hop: string; elapsed: number; last: number };

export function Floorplan() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [readout, setReadout] = useState<Readout>({
    hop: stages[0].name,
    elapsed: 0,
    last: BUDGET_MS,
  });

  const focus = useCallback((id: string | null) => {
    activeRef.current = id;
    setActive(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(host);
    const read = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const ink = {
      sub: read("--d-sub", "#04141a"),
      subLift: read("--d-sub-2", "#0a2129"),
      metal: read("--d-metal", "#dfe8e6"),
      metalDim: read("--d-metal-3", "#4a6066"),
      poly: read("--d-poly", "#f0a938"),
      implant: read("--d-implant", "#ff4f86"),
      via: read("--d-via", "#57e0d4"),
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let pad = 30;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      pad = Math.max(18, Math.min(34, w * 0.026));
      host.style.setProperty("--d-pad", `${pad}px`);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* Die space → canvas space. */
    const X = (u: number) => pad + u * (w - pad * 2);
    const Y = (v: number) => pad + v * (h - pad * 2);
    const W = (u: number) => u * (w - pad * 2);
    const H = (v: number) => v * (h - pad * 2);

    /* ── Turn state ─────────────────────────────────────────────────────── */
    let t = 0;
    let turns = 0;
    let stretch = 1;
    let last = BUDGET_MS;

    const legMs = () =>
      path.map((leg) =>
        leg.hop === "retrieve" ? msFor(leg.hop) + BUDGET_MS * (stretch - 1) : msFor(leg.hop),
      );

    const beginTurn = () => {
      turns += 1;
      stretch = turns % HOT_EVERY === 0 ? 1.22 : 0.98 + Math.random() * 0.05;
      last = Math.round(BUDGET_MS * stretch);
    };

    /** Where the charge is, and which hop it is spending. */
    const locate = (elapsed: number) => {
      const costs = legMs();
      let acc = 0;
      for (let i = 0; i < path.length; i += 1) {
        if (elapsed <= acc + costs[i] || i === path.length - 1) {
          const f = Math.min(1, Math.max(0, (elapsed - acc) / costs[i]));
          const leg = path[i];
          return {
            i,
            x: leg.from[0] + (leg.to[0] - leg.from[0]) * f,
            y: leg.from[1] + (leg.to[1] - leg.from[1]) * f,
            hop: leg.hop,
          };
        }
        acc += costs[i];
      }
      return { i: 0, x: path[0].from[0], y: path[0].from[1], hop: path[0].hop };
    };

    /* ── Drawing ────────────────────────────────────────────────────────── */

    const drawPadRing = () => {
      ctx.fillStyle = ink.metalDim;
      const n = Math.max(10, Math.round(w / 46));
      const m = Math.max(6, Math.round(h / 46));
      const s = Math.max(5, pad * 0.34);
      for (let i = 0; i < n; i += 1) {
        const x = pad + ((i + 0.5) / n) * (w - pad * 2) - s / 2;
        ctx.fillRect(x, pad * 0.3, s, s);
        ctx.fillRect(x, h - pad * 0.3 - s, s, s);
      }
      for (let i = 0; i < m; i += 1) {
        const y = pad + ((i + 0.5) / m) * (h - pad * 2) - s / 2;
        ctx.fillRect(pad * 0.3, y, s, s);
        ctx.fillRect(w - pad * 0.3 - s, y, s, s);
      }
      // The live pads sit on the left edge and are struck in the via colour.
      ctx.fillStyle = ink.via;
      pads.forEach((p) => {
        const y = Y(p.at);
        ctx.fillRect(pad * 0.3, y - s / 2, s, s);
      });
      // Seal ring.
      ctx.strokeStyle = ink.metalDim;
      ctx.lineWidth = 1;
      ctx.strokeRect(pad - 6.5, pad - 6.5, w - pad * 2 + 13, h - pad * 2 + 13);
    };

    /** Routing: fine parallel traces filling the channels between macros. */
    const drawRouting = () => {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = ink.metalDim;
      ctx.lineWidth = 1;
      const midY = Y(0.5);
      for (let k = -4; k <= 4; k += 1) {
        const y = Math.round(midY + k * 5) + 0.5;
        ctx.beginPath();
        ctx.moveTo(X(0.02), y);
        ctx.lineTo(X(0.98), y);
        ctx.stroke();
      }
      [0.305, 0.595, 0.845, 0.29, 0.575].forEach((u, idx) => {
        for (let k = -1; k <= 1; k += 1) {
          const x = Math.round(X(u) + k * 5) + 0.5;
          ctx.beginPath();
          ctx.moveTo(x, Y(idx > 2 ? 0.5 : 0.02));
          ctx.lineTo(x, Y(idx > 2 ? 0.98 : 0.5));
          ctx.stroke();
        }
      });
      ctx.restore();

      // Vias where a channel turns.
      ctx.fillStyle = ink.via;
      ctx.globalAlpha = 0.75;
      [
        [0.305, 0.5],
        [0.595, 0.5],
        [0.845, 0.5],
        [0.73, 0.5],
      ].forEach(([u, v]) => ctx.fillRect(X(u) - 2, Y(v) - 2, 4, 4));
      ctx.globalAlpha = 1;
    };

    /** A macro: a filled well, a polysilicon edge, and standard-cell rows. */
    const drawBlock = (b: (typeof blocks)[number], lit: boolean) => {
      const x = X(b.x);
      const y = Y(b.y);
      const bw = W(b.w);
      const bh = H(b.h);

      ctx.fillStyle = lit ? ink.subLift : ink.sub;
      ctx.fillRect(x, y, bw, bh);

      // Cell rows. Density carries the block's kind: signal macros are dense,
      // the organisation blocks are drawn coarser, so the die reads as two
      // populations rather than eight identical rectangles.
      const pitch = b.kind === "org" ? 9 : b.kind === "signal" ? 4 : 6;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, bw, bh);
      ctx.clip();
      ctx.globalAlpha = lit ? 0.5 : 0.28;
      ctx.fillStyle = b.kind === "org" ? ink.implant : ink.metal;
      for (let yy = y + 6; yy < y + bh - 3; yy += pitch) {
        const rowW = bw - 12 - ((yy * 37) % 11);
        ctx.fillRect(x + 6, Math.round(yy), Math.max(8, rowW), 1);
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = lit ? ink.poly : b.kind === "org" ? ink.implant : ink.poly;
      ctx.globalAlpha = lit ? 1 : 0.55;
      ctx.lineWidth = lit ? 2 : 1;
      ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(bw) - 1, Math.round(bh) - 1);
      ctx.globalAlpha = 1;
    };

    const drawPath = (headX: number, headY: number, legIndex: number) => {
      // The routed track, dim along its whole length.
      ctx.strokeStyle = ink.via;
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(X(path[0].from[0]), Y(path[0].from[1]));
      path.forEach((leg) => ctx.lineTo(X(leg.to[0]), Y(leg.to[1])));
      ctx.stroke();

      // The part already carried, bright.
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ink.via;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(X(path[0].from[0]), Y(path[0].from[1]));
      for (let i = 0; i < legIndex; i += 1) ctx.lineTo(X(path[i].to[0]), Y(path[i].to[1]));
      ctx.lineTo(X(headX), Y(headY));
      ctx.stroke();

      // The charge, and the wake it leaves along the leg it is crossing.
      const hx = X(headX);
      const hy = Y(headY);
      const leg = path[Math.min(legIndex, path.length - 1)];
      const wake = ctx.createLinearGradient(X(leg.from[0]), Y(leg.from[1]), hx, hy);
      wake.addColorStop(0, "rgb(87 224 212 / 0)");
      wake.addColorStop(1, "rgb(87 224 212 / 0.85)");
      ctx.strokeStyle = wake;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(X(leg.from[0]), Y(leg.from[1]));
      ctx.lineTo(hx, hy);
      ctx.stroke();

      ctx.fillStyle = ink.via;
      ctx.fillRect(hx - 3.5, hy - 3.5, 7, 7);
      ctx.strokeStyle = ink.via;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.strokeRect(hx - 8.5, hy - 8.5, 17, 17);
      ctx.globalAlpha = 1;
    };

    /* ── Frame ──────────────────────────────────────────────────────────── */

    const frameOnce = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);
      drawPadRing();
      drawRouting();
      const lit = activeRef.current;
      blocks.forEach((b) => drawBlock(b, b.id === lit));
      const p = locate(elapsed);
      drawPath(p.x, p.y, p.i);
      return p;
    };

    if (still) {
      // One settled frame, mid-turn, and the readout that goes with it. Posted
      // on the next frame rather than inline, so this stays a message from the
      // drawing rather than a cascading render inside the effect body.
      frameOnce(BUDGET_MS * 0.46);
      const once = requestAnimationFrame(() =>
        setReadout({
          hop: stages[3].name,
          elapsed: Math.round(BUDGET_MS * 0.46),
          last: BUDGET_MS,
        }),
      );
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
      const elapsed = (Math.min(t, len) / len) * BUDGET_MS * stretch;
      const p = frameOnce(elapsed);

      since += dt;
      if (since > 90) {
        since = 0;
        const stage = stages.find((s) => s.id === p.hop);
        setReadout({ hop: stage?.name ?? p.hop, elapsed: Math.round(elapsed), last });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const shown = active ? blocks.find((b) => b.id === active) : null;

  return (
    <figure className="d-die">
      <div className="d-die-bar">
        <span className="d-mono">floorplan · 8 macros</span>
        <span className="d-mono d-push">
          critical path {BUDGET_MS} / {CEILING_MS} ms
        </span>
      </div>

      <div ref={hostRef} className="d-die-stage">
        <canvas ref={canvasRef} aria-hidden />

        {/* Every macro is a real control sitting on the drawing. */}
        <ul className="d-macros">
          {blocks.map((b) => (
            <li
              key={b.id}
              style={{
                left: `calc(var(--d-pad) + (100% - 2 * var(--d-pad)) * ${b.x})`,
                top: `calc(var(--d-pad) + (100% - 2 * var(--d-pad)) * ${b.y})`,
                width: `calc((100% - 2 * var(--d-pad)) * ${b.w})`,
                height: `calc((100% - 2 * var(--d-pad)) * ${b.h})`,
              }}
            >
              <a
                href={b.href}
                data-kind={b.kind}
                data-lit={active === b.id ? "1" : "0"}
                onMouseEnter={() => focus(b.id)}
                onMouseLeave={() => focus(null)}
                onFocus={() => focus(b.id)}
                onBlur={() => focus(null)}
              >
                <span className="d-macro-label">{b.label}</span>
                <span className="d-macro-datum">{b.datum}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="d-die-foot">
        <div className="d-readout">
          <span className="k">hop</span>
          <span className="v">{readout.hop}</span>
          <span className="k">elapsed</span>
          <span className="v" data-over={readout.elapsed > CEILING_MS ? "1" : "0"}>
            {readout.elapsed} ms
          </span>
          <span className="k">last turn</span>
          <span className="v" data-over={readout.last > CEILING_MS ? "1" : "0"}>
            {readout.last} ms
          </span>
        </div>
        <p className="d-inspect" aria-live="polite">
          {shown ? (
            <>
              <b>{shown.title}.</b> {shown.note}
            </>
          ) : (
            <>
              <b>Eight macros on one die.</b> Six are the technical surface, two are the
              organisation — drawn on the same silicon because that pairing is the argument.
              The charge tracing the interconnect is one spoken turn, timed from the real
              budget. Point at a block to read it.
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
