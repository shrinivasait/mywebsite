"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BUDGET, FIELD, STAGES, offsets, runDurations, total } from "./latency-budget";
import type { Sample, SceneHandle } from "./latency-budget-scene";

/** How many times to rebuild after a lost GPU context before giving up. */
const MAX_REBUILDS = 2;

/**
 * Mounts the WebGL latency budget.
 *
 * Deliberately the same shape as HeroArtifact: a dynamic import fired from an
 * IntersectionObserver so three.js is neither bundled nor fetched for a visitor
 * who never sees it, a server-rendered flat drawing underneath that is correct
 * with no JavaScript and no WebGL, and a readout written through a ref rather
 * than through state. If this object replaces the loss surface it should be a
 * swap, not a rewrite of everything around it.
 */
export function LatencyArtifact() {
  const host = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  const [live, setLive] = useState(false);
  const [build, setBuild] = useState(0);
  const rebuilds = useRef(0);

  const onContextLost = useCallback(() => {
    setLive(false);
    if (rebuilds.current >= MAX_REBUILDS) return;
    rebuilds.current += 1;
    setBuild((n) => n + 1);
  }, []);

  const onSample = useCallback((sample: Sample) => {
    const el = readout.current;
    if (!el) return;
    el.hidden = false;
    el.textContent =
      `t ${String(sample.ms).padStart(3, " ")} ms` +
      `  ·  ${STAGES[sample.stage].label}` +
      `  ·  ${sample.total} of ${BUDGET} ms${sample.hot ? "  ·  hot" : ""}`;
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let handle: SceneHandle | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        const { createLatencyBudget } = await import("./latency-budget-scene");
        if (cancelled) return;
        handle = createLatencyBudget(el, onContextLost, onSample);
        if (handle) setLive(true);
      } catch {
        /* Fallback stays. */
      }
    };

    if (build > 0) {
      start();
      return () => {
        cancelled = true;
        handle?.destroy();
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        start();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      handle?.destroy();
    };
  }, [build, onContextLost, onSample]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      data-artifact={live ? "live" : "static"}
    >
      <div
        className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          live ? "opacity-0" : "opacity-100"
        }`}
      >
        <StaticTiming />
      </div>
      <div ref={host} className="absolute inset-0" />
      <p
        ref={readout}
        aria-hidden
        hidden
        className="spec-datum absolute bottom-2.5 left-2.5 border border-reticule-2 bg-stock-plate px-2 py-1 text-ink-3 tabular-nums"
      />
    </div>
  );
}

/**
 * The same run read from the side: a flat timing diagram.
 *
 * Not a compromise but the other standard drawing of the figure — a waterfall
 * on paper is exactly this. It reads the first cycle out of the same module the
 * scene does, so the two cannot disagree about the numbers.
 */
const VIEW_W = 300;
const VIEW_H = 150;
const PAD_L = 4;
const LANE_H = 22;
const GAP = 8;

const DURS = runDurations(0);
const OFFS = offsets(DURS);
const SUM = total(DURS);
const x = (ms: number) => PAD_L + (ms / FIELD) * (VIEW_W - PAD_L * 2);

function StaticTiming() {
  const top = (i: number) => 26 + i * (LANE_H + GAP);
  const budgetX = x(BUDGET);

  return (
    <svg
      viewBox={`-6 -6 ${VIEW_W + 12} ${VIEW_H + 12}`}
      className="h-[88%] w-auto max-w-[92%]"
      role="img"
      aria-label={`A timing diagram of one end-to-end spoken turn: endpoint ${DURS[0]} ms, transcribe ${DURS[1]} ms, first token ${DURS[2]} ms, first audio ${DURS[3]} ms, totalling ${SUM} ms against an ${BUDGET} ms budget.`}
      style={{ fill: "none", stroke: "var(--ink)" }}
    >
      {/* The scale. */}
      {[0, 200, 400, 600, 800, 1000].map((ms) => (
        <path
          key={ms}
          d={`M${x(ms).toFixed(1)} 18V${VIEW_H - 14}`}
          strokeWidth={0.8}
          opacity={0.18}
          style={{ stroke: "var(--ink)" }}
        />
      ))}

      {/* The stages, in the height ramp the scene shades them with. */}
      {DURS.map((d, i) => (
        <rect
          key={STAGES[i].key}
          x={x(OFFS[i])}
          y={top(i)}
          width={x(OFFS[i] + d) - x(OFFS[i])}
          height={LANE_H}
          strokeWidth={1.2}
          style={{
            fill: `var(--scene-ramp-${["low", "low", "mid", "high"][i]})`,
            stroke: "var(--ink)",
          }}
        />
      ))}

      {/* The ceiling, and the only element besides the total in the accent. */}
      <path
        d={`M${budgetX.toFixed(1)} 12V${VIEW_H - 8}`}
        strokeWidth={1.8}
        style={{ stroke: "var(--trace)" }}
      />
      <path
        d={`M${x(SUM).toFixed(1)} 12V${VIEW_H - 8}`}
        strokeWidth={1.2}
        strokeDasharray="3 3"
        opacity={0.7}
        style={{ stroke: "var(--trace)" }}
      />

      {/* The baseline. A timing diagram needs a datum and a frame, nothing more. */}
      <path
        d={`M${PAD_L} ${VIEW_H - 14}H${VIEW_W - PAD_L}`}
        strokeWidth={1.5}
        style={{ stroke: "var(--ink)" }}
      />
    </svg>
  );
}
