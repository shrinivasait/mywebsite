"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGET_MS, CEILING_MS, stages } from "./turn";

/**
 * The featured track, playing.
 *
 * One spoken turn of the phone-call negotiator laid out as a single band of
 * ink: six segments, each as wide as its share of the clock, played left to
 * right against the trim edge at 800 ms. Under it, the last few takes — every
 * fourth one runs long, because a tail exists and drawing it is more honest
 * than a page that pretends otherwise.
 *
 * It is a drawing of a designed budget, not a live probe, and the caption says
 * so. Every figure comes from `turn.ts`, so this file cannot invent one.
 */

const RATE = 0.28; // animation ms → real ms
const GAP_MS = 560; // the pause between takes, in animation time
const HOT_EVERY = 4;
const TAKES = 10;
const HOT_STAGE = 2; // retrieval: where an overrun actually comes from

type Readout = { hop: string; elapsed: number; take: number; longest: number };

export function Pipeline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readout, setReadout] = useState<Readout>({
    hop: stages[0].name,
    elapsed: 0,
    take: BUDGET_MS,
    longest: BUDGET_MS,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(host);
    const read = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;

    const ink = {
      plate: read("--bn-plate", "#d5411f"),
      lift: read("--bn-plate-lift", "#f0764e"),
      bone: read("--bn-bone", "#f4efe4"),
      bone2: read("--bn-bone-2", "#b8afa0"),
      bone3: read("--bn-bone-3", "#8d8578"),
      sleeve: read("--bn-sleeve", "#15120f"),
    };
    const billFamily = read("--font-bill", "sans-serif");
    const monoFamily = read("--font-chivo-mono", "monospace");
    const caps = `600 9px ${billFamily}, sans-serif`;
    const digits = `10px ${monoFamily}, monospace`;

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

    let t = 0;
    let takes = 0;
    let stretch = 1;
    let lastTake = BUDGET_MS;
    let longest = BUDGET_MS;
    const history: number[] = [];

    const beginTake = () => {
      takes += 1;
      stretch = takes % HOT_EVERY === 0 ? 1.22 : 0.97 + Math.random() * 0.06;
      const total = Math.round(BUDGET_MS * stretch);
      lastTake = total;
      longest = Math.max(longest, total);
      history.unshift(total);
      if (history.length > TAKES) history.pop();
    };

    /** Where each hop starts and ends in milliseconds, for the current take. */
    const extents = () => {
      const out: { start: number; end: number }[] = [];
      let acc = 0;
      stages.forEach((s, i) => {
        const cost = s.ms + (i === HOT_STAGE ? BUDGET_MS * (stretch - 1) : 0);
        out.push({ start: acc, end: acc + cost });
        acc += cost;
      });
      return out;
    };

    const draw = (elapsed: number, activeIdx: number) => {
      ctx.clearRect(0, 0, w, h);

      const padX = 18;
      const inner = w - padX * 2;
      const scale = inner / CEILING_MS; // ms → px, the whole band is the ceiling
      const bandY = 42;
      const bandH = 52;
      const spans = extents();

      // The band: six segments of ink, each as wide as its share of the clock.
      spans.forEach((span, i) => {
        const x = padX + span.start * scale;
        const segW = Math.max(1, (span.end - span.start) * scale - 2);
        const played = elapsed >= span.end;
        const playing = i === activeIdx && elapsed < span.end;

        ctx.fillStyle = playing ? ink.plate : played ? ink.bone : "rgb(244 239 228 / 0.18)";
        ctx.fillRect(x, bandY, segW, bandH);

        // Hop name, set in the band when it fits, under it when it does not.
        ctx.font = caps;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        const label = stages[i].short;
        const fits = ctx.measureText(label).width + 10 < segW;
        if (fits) {
          ctx.fillStyle = playing || played ? ink.sleeve : ink.bone2;
          ctx.fillText(label, x + segW / 2, bandY + bandH / 2);
        } else {
          ctx.fillStyle = ink.bone3;
          ctx.fillText(label, x + segW / 2, bandY - 11);
        }

        // Its budget, hung beneath.
        ctx.font = digits;
        ctx.textBaseline = "top";
        ctx.fillStyle = playing ? ink.lift : ink.bone3;
        ctx.fillText(`${stages[i].ms}`, x + segW / 2, bandY + bandH + 9);
      });

      // The playhead, and the elapsed figure riding on it.
      const headX = padX + Math.min(elapsed, CEILING_MS) * scale;
      ctx.strokeStyle = ink.plate;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(headX) + 0.5, bandY - 22);
      ctx.lineTo(Math.round(headX) + 0.5, bandY + bandH + 6);
      ctx.stroke();

      ctx.font = digits;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = headX > w - 90 ? "right" : "left";
      ctx.fillStyle = ink.lift;
      ctx.fillText(
        `${Math.round(elapsed)} MS`,
        headX + (headX > w - 90 ? -6 : 6),
        bandY - 24,
      );

      // The trim edge. Past it the ink runs off the sheet.
      const trimX = padX + inner;
      ctx.strokeStyle = ink.bone2;
      ctx.beginPath();
      ctx.moveTo(trimX + 0.5, bandY - 22);
      ctx.lineTo(trimX + 0.5, bandY + bandH + 22);
      ctx.stroke();
      ctx.font = caps;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = ink.bone2;
      ctx.fillText(`TRIM ${CEILING_MS} MS`, trimX - 6, bandY + bandH + 26);

      // Previous takes, stacked as thin rules. A take that crosses the trim is
      // struck in the plate colour.
      const takeY = bandY + bandH + 46;
      const pitch = 9;
      history.forEach((total, i) => {
        const y = takeY + i * pitch;
        if (y > h - 4) return;
        ctx.fillStyle = total > CEILING_MS ? ink.lift : "rgb(244 239 228 / 0.5)";
        ctx.fillRect(padX, y, Math.max(2, Math.min(total, CEILING_MS * 1.04) * scale), 2);
      });

      ctx.font = caps;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = ink.bone3;
      ctx.fillText("PREVIOUS TAKES", padX, takeY - 16);
    };

    const push = (hop: string, elapsed: number) =>
      setReadout({ hop, elapsed: Math.round(elapsed), take: lastTake, longest });

    if (still) {
      for (let i = 0; i < TAKES; i += 1) {
        history.push(Math.round(BUDGET_MS * (i % HOT_EVERY === 0 ? 1.22 : 1)));
      }
      draw(BUDGET_MS, stages.length - 1);
      push(stages[stages.length - 1].name, BUDGET_MS);
      return () => ro.disconnect();
    }

    for (let i = TAKES; i > 0; i -= 1) {
      history.push(Math.round(BUDGET_MS * (i % HOT_EVERY === 0 ? 1.22 : 1)));
    }
    beginTake();

    let raf = 0;
    let prev = performance.now();
    let sinceReadout = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;
      t += dt;

      const len = (BUDGET_MS * stretch) / RATE;
      if (t > len + GAP_MS) {
        t = 0;
        beginTake();
      }

      const elapsed = (Math.min(t, len) / len) * BUDGET_MS * stretch;
      const spans = extents();
      let idx = spans.findIndex((s) => elapsed <= s.end);
      if (idx < 0) idx = stages.length - 1;

      draw(elapsed, idx);

      sinceReadout += dt;
      if (sinceReadout > 90) {
        sinceReadout = 0;
        push(stages[idx].name, elapsed);
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
    <figure className="bn-panel" style={{ margin: 0 }}>
      <div className="bn-panel-bar">
        <p className="bn-caps">A1 · one turn, playing</p>
        <p className="bn-caps bn-spacer">{BUDGET_MS} ms budget</p>
      </div>
      <div ref={hostRef} className="bn-canvas-host">
        <canvas ref={canvasRef} aria-hidden />
      </div>
      <figcaption className="bn-readout">
        <div>
          <span className="k">hop</span>
          <span className="v">{readout.hop}</span>
        </div>
        <div>
          <span className="k">elapsed</span>
          <span className="v" data-over={readout.elapsed > CEILING_MS ? "1" : "0"}>
            {readout.elapsed} ms
          </span>
        </div>
        <div>
          <span className="k">last take</span>
          <span className="v" data-over={readout.take > CEILING_MS ? "1" : "0"}>
            {readout.take} ms
          </span>
        </div>
        <div>
          <span className="k">longest</span>
          <span className="v" data-over={readout.longest > CEILING_MS ? "1" : "0"}>
            {readout.longest} ms
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
