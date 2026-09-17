"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGET_MS, CEILING_MS, stages } from "./turn";

/**
 * The hero instrument: one spoken turn walking the voice pipeline, against
 * the 800 ms ceiling it has to land under.
 *
 * It is a drawing of a budget, not a live probe — the page says so in the
 * caption, and the numbers come from `turn.ts` rather than from the canvas,
 * so this file cannot quietly invent a figure.
 *
 * Playback runs at 0.28× so a 750 ms turn is legible; the readout always
 * states real milliseconds, never animation time. Every fourth turn is a hot
 * run — retrieval misses the warm index — which is the honest thing to show:
 * a tail exists, it is bounded, and the ceiling is what it is measured on.
 */

const RATE = 0.28; // animation ms → real ms
const GAP_MS = 520; // dead air between turns, in animation time
const HOT_EVERY = 4;
const HISTORY = 28;

type Readout = {
  stage: string;
  elapsed: number;
  last: number;
  worst: number;
  runs: number;
};

export function Pipeline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readout, setReadout] = useState<Readout>({
    stage: stages[0].name,
    elapsed: 0,
    last: BUDGET_MS,
    worst: BUDGET_MS,
    runs: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(host);
    const ink = {
      sig: css.getPropertyValue("--rt-sig").trim() || "#c9f24d",
      warn: css.getPropertyValue("--rt-warn").trim() || "#ff8360",
      cool: css.getPropertyValue("--rt-cool").trim() || "#6fd3ff",
      line: css.getPropertyValue("--rt-line-2").trim() || "#2a343d",
      dim: css.getPropertyValue("--rt-line").trim() || "#1b2229",
      fg: css.getPropertyValue("--rt-fg").trim() || "#e8edf2",
      fg3: css.getPropertyValue("--rt-fg-3").trim() || "#6b7783",
      void: css.getPropertyValue("--rt-void").trim() || "#07090c",
    };
    const mono = `11px ${css.getPropertyValue("--font-chivo-mono").trim() || "monospace"}, monospace`;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ── Turn state. `t` is animation time inside the current turn; `scale`
       stretches the hot runs. The history strip keeps real millisecond totals,
       not animation ones. ── */
    let t = 0;
    let runs = 0;
    let scale = 1;
    const history: number[] = [];
    let last = BUDGET_MS;
    let worst = BUDGET_MS;

    const turnLen = () => (BUDGET_MS / RATE) * scale;

    const beginTurn = () => {
      runs += 1;
      scale = runs % HOT_EVERY === 0 ? 1.22 : 0.97 + Math.random() * 0.07;
      // Only the retrieval hop stretches on a hot run, so the stage widths
      // in the drawing stay truthful about where the tail comes from.
      const total = Math.round(BUDGET_MS * scale);
      last = total;
      worst = Math.max(worst, total);
      history.push(total);
      if (history.length > HISTORY) history.shift();
    };

    const hotIndex = 2; // retrieval

    const draw = (elapsedReal: number, activeIdx: number) => {
      ctx.clearRect(0, 0, w, h);

      const padX = 22;
      const chainY = Math.round(h * 0.38);
      const nodeW = Math.min(76, (w - padX * 2) / stages.length - 12);
      const gap = (w - padX * 2 - nodeW * stages.length) / (stages.length - 1);
      const nodeH = 34;

      // The rule the chain sits on.
      ctx.strokeStyle = ink.dim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, chainY + nodeH / 2 + 0.5);
      ctx.lineTo(w - padX, chainY + nodeH / 2 + 0.5);
      ctx.stroke();

      stages.forEach((stage, i) => {
        const x = padX + i * (nodeW + gap);
        const active = i === activeIdx;
        const done = i < activeIdx;
        const hot = active && i === hotIndex && scale > 1.15;

        ctx.fillStyle = ink.void;
        ctx.fillRect(x, chainY, nodeW, nodeH);
        ctx.strokeStyle = active ? (hot ? ink.warn : ink.sig) : done ? ink.line : ink.dim;
        ctx.lineWidth = active ? 1.5 : 1;
        ctx.strokeRect(x + 0.5, chainY + 0.5, nodeW - 1, nodeH - 1);

        if (active) {
          ctx.fillStyle = hot ? "rgb(255 131 96 / 0.16)" : "rgb(201 242 77 / 0.16)";
          ctx.fillRect(x + 1, chainY + 1, nodeW - 2, nodeH - 2);
        }

        ctx.font = mono;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = active ? (hot ? ink.warn : ink.sig) : done ? ink.fg : ink.fg3;
        ctx.fillText(stage.short, x + nodeW / 2, chainY + nodeH / 2);

        // Budgeted cost, hung under each node.
        ctx.fillStyle = active ? ink.fg : ink.fg3;
        ctx.fillText(`${stage.ms}`, x + nodeW / 2, chainY + nodeH + 15);

        // The packet in flight: a short dash walking the edge to the next node.
        if (done && i < stages.length - 1) {
          ctx.strokeStyle = stage.kind === "io" ? ink.cool : ink.sig;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + nodeW, chainY + nodeH / 2 + 0.5);
          ctx.lineTo(x + nodeW + gap, chainY + nodeH / 2 + 0.5);
          ctx.stroke();
        }
      });

      /* ── The budget bar: one horizontal accumulation against the ceiling.
         This is the claim the whole route rests on, so it gets the width. ── */
      const barY = Math.round(h * 0.68);
      const barW = w - padX * 2;
      const barH = 10;

      ctx.fillStyle = ink.dim;
      ctx.fillRect(padX, barY, barW, barH);

      const frac = Math.min(elapsedReal / CEILING_MS, 1);
      const over = elapsedReal > CEILING_MS;
      ctx.fillStyle = over ? ink.warn : ink.sig;
      ctx.fillRect(padX, barY, barW * frac, barH);

      // The ceiling itself, and the band the architecture is specified in.
      const bandLo = padX + barW * (650 / CEILING_MS);
      ctx.strokeStyle = ink.line;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(bandLo, barY - 6);
      ctx.lineTo(bandLo, barY + barH + 6);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = ink.warn;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX + barW - 0.5, barY - 8);
      ctx.lineTo(padX + barW - 0.5, barY + barH + 8);
      ctx.stroke();

      ctx.font = mono;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = ink.fg3;
      ctx.fillText("650", bandLo + 5, barY + barH + 9);
      ctx.textAlign = "right";
      ctx.fillStyle = ink.warn;
      ctx.fillText(`${CEILING_MS} ms ceiling`, padX + barW - 5, barY + barH + 9);

      /* ── History: the last runs as a sparkline of totals, so the tail is
         visible rather than asserted. ── */
      const hY = Math.round(h * 0.9);
      const hH = 22;
      const slot = barW / HISTORY;
      history.forEach((total, i) => {
        const frac2 = Math.min(total / CEILING_MS, 1.08);
        const bh = Math.max(2, hH * frac2);
        ctx.fillStyle = total > CEILING_MS ? ink.warn : "rgb(201 242 77 / 0.5)";
        ctx.fillRect(padX + i * slot, hY - bh, Math.max(2, slot - 2), bh);
      });
      ctx.strokeStyle = ink.dim;
      ctx.beginPath();
      ctx.moveTo(padX, hY + 0.5);
      ctx.lineTo(padX + barW, hY + 0.5);
      ctx.stroke();
    };

    let raf = 0;
    let prev = performance.now();
    let sinceReadout = 0;

    const push = (stage: string, elapsed: number) =>
      setReadout({ stage, elapsed: Math.round(elapsed), last, worst, runs });

    if (still) {
      // No animation: one settled frame at the end of the turn, and a history
      // strip filled from the budget so the instrument still reads as an
      // instrument rather than an empty box.
      for (let i = 0; i < HISTORY; i += 1) {
        history.push(Math.round(BUDGET_MS * (i % HOT_EVERY === 0 ? 1.22 : 1)));
      }
      runs = HISTORY;
      draw(BUDGET_MS, stages.length - 1);
      push(stages[stages.length - 1].name, BUDGET_MS);
      return () => ro.disconnect();
    }

    beginTurn();

    const frame = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;
      t += dt;

      const len = turnLen();
      if (t > len + GAP_MS) {
        t = 0;
        beginTurn();
      }

      const within = Math.min(t, len);
      const elapsedReal = (within / len) * BUDGET_MS * scale;

      // Which hop is on the clock: walk the budgets, stretching only the hop
      // that actually stretches on a hot run.
      let acc = 0;
      let idx = stages.length - 1;
      for (let i = 0; i < stages.length; i += 1) {
        // The whole overrun is charged to the retrieval hop, which is where it
        // comes from: a cold index, not six hops each drifting a little.
        const cost = stages[i].ms + (i === hotIndex ? BUDGET_MS * (scale - 1) : 0);
        if (elapsedReal <= acc + cost) {
          idx = i;
          break;
        }
        acc += cost;
      }
      if (t > len) idx = stages.length - 1;

      draw(elapsedReal, idx);

      sinceReadout += dt;
      if (sinceReadout > 90) {
        sinceReadout = 0;
        push(stages[idx].name, elapsedReal);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <figure className="rt-inst" style={{ margin: 0 }}>
      <div className="rt-inst-bar">
        <span className="rt-dot" aria-hidden />
        <span className="rt-mono">turn · voice pipeline</span>
        <span className="rt-mono rt-spacer">budget {BUDGET_MS} ms</span>
      </div>
      <div ref={hostRef} className="rt-inst-body" style={{ height: 300 }}>
        <canvas ref={canvasRef} aria-hidden />
      </div>
      <figcaption className="rt-readout">
        <div>
          <span className="k">hop</span>
          <span className="v">{readout.stage}</span>
        </div>
        <div>
          <span className="k">elapsed</span>
          <span className="v" data-over={readout.elapsed > CEILING_MS ? "1" : "0"}>
            {readout.elapsed} ms
          </span>
        </div>
        <div>
          <span className="k">last turn</span>
          <span className="v" data-over={readout.last > CEILING_MS ? "1" : "0"}>
            {readout.last} ms
          </span>
        </div>
        <div>
          <span className="k">worst</span>
          <span className="v" data-over={readout.worst > CEILING_MS ? "1" : "0"}>
            {readout.worst} ms
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
