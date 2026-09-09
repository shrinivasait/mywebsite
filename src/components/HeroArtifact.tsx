"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONTOUR_LEVELS,
  HALF,
  contourSegments,
  cycleStarts,
  descentPath,
} from "./loss-surface";
import type { Sample, SceneHandle } from "./hero-artifact-scene";

/** How many times to rebuild after a lost GPU context before giving up and
 *  leaving the CSS artifact in place for good. */
const MAX_REBUILDS = 2;

/**
 * Mounts the WebGL loss surface.
 *
 * three.js is behind a dynamic import fired from an IntersectionObserver, so it
 * is neither in the initial bundle nor fetched for a visitor who never sees it.
 * Until (or unless) the scene comes up, the SVG contour map underneath is what
 * ships — server-rendered, correct with no JavaScript and no WebGL, and drawn
 * in the same inks as the scene that replaces it. It is the same field read
 * from directly above, with the same descent paths traced on it, rather than a
 * blurred stand-in for a missing image — so a visitor who never gets the scene
 * still gets a chart, and the two drawings cannot disagree.
 */
export function HeroArtifact() {
  const host = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  const [live, setLive] = useState(false);
  const [build, setBuild] = useState(0);
  const rebuilds = useRef(0);

  /**
   * A lost context cannot be recovered in place: three.js does not rebuild GPU
   * resources for a restored context. So the scene is torn down, the CSS
   * artifact fades back in, and a fresh scene is built — bounded, so a machine
   * that keeps dropping the context settles on the fallback instead of
   * thrashing.
   */
  const onContextLost = useCallback(() => {
    setLive(false);
    if (rebuilds.current >= MAX_REBUILDS) return;
    rebuilds.current += 1;
    setBuild((n) => n + 1);
  }, []);

  /**
   * The live readout. Written straight to the DOM through a ref rather than
   * through state: the scene reports whenever the leading loss moves, and a
   * `setState` per report would re-render the component several times a second
   * to change three characters.
   */
  const onSample = useCallback((sample: Sample) => {
    const el = readout.current;
    if (!el) return;
    /* Revealed by the first sample, not by `.js-only`: that class resolves to
       `display: contents`, which generates no box and would silently discard
       this element's absolute positioning. The `hidden` attribute keeps the box
       and simply withholds it until there is a value to show, so no-JS and
       no-WebGL visitors never see an empty readout frame. */
    el.hidden = false;
    const sign = sample.loss < 0 ? "\u2212" : "+";
    el.textContent =
      `loss ${sign}${Math.abs(sample.loss).toFixed(3)}` +
      `  \u00b7  step ${String(sample.step).padStart(3, "0")}/${sample.steps}` +
      `  \u00b7  ${sample.trapped ? "local min" : "global min"}`;
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let handle: SceneHandle | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        const { createHeroArtifact } = await import("./hero-artifact-scene");
        if (cancelled) return;
        handle = createHeroArtifact(el, onContextLost, onSample);
        if (handle) setLive(true);
      } catch {
        /* Fallback stays. */
      }
    };

    // A rebuild is already past the in-view test; only the first build waits.
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
      {/* The drawn outline. Fades out only once WebGL has actually taken over,
          and fades back in if the context is lost. No mask and no blur: the
          object is bounded, so it ends where it ends. */}
      <div
        className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          live ? "opacity-0" : "opacity-100"
        }`}
      >
        <StaticOutline />
      </div>
      <div ref={host} className="absolute inset-0" />

      {/* A readout box, not a caption. It carries a measurement that changes as
          the traces descend — the number a visitor watches fall — which is why
          it earns a place where a line describing the drawing did not. It sits
          on its own plate so its ink is never read against the canvas, and it
          starts out `hidden` and is revealed by the first sample, so with no
          scripting or no WebGL there is never an empty frame. */}
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
 * The package in plan and elevation, at 1.5 stroke, in the document's inks.
 * This is what prints, what a no-JavaScript visitor sees, and what stands in
 * while the scene chunk is still in flight.
 */
/* A single-hue sequential ramp: every unmasked cell is the second ink, and the
   weight sets its opacity. That is how a heatmap encodes a scalar, and it keeps
   the flat drawing inside the document's two inks. A masked cell is a well,
   because it holds no value at all rather than a low one. */
/**
 * The loss surface read from directly above: a contour map of the same field,
 * with the same four descents traced across it.
 *
 * A 2D loss contour with the optimisers' paths on it is how this figure is
 * shown on paper, so the flat version is not a compromise — it is the other
 * standard drawing of the same thing. The field, the iso-lines and the paths
 * all come from `loss-surface.ts`, including the marching squares, so nothing
 * here can disagree with the scene.
 *
 * An earlier version of this drawing was a grid of 1,600 opacity-ramped tiles:
 * 150KB of the page's 335KB of HTML, 45% of the document spent on a fallback
 * that is replaced within a second of load. Eight contour paths are a
 * twentieth of the bytes and a better drawing — nested rings read as depth,
 * where a tile grid reads as a screenshot of a heatmap.
 */
const RES = 48;
const VIEW = 260;

/** Field coordinates to SVG coordinates. */
const px = (v: number) => ((v + HALF) / (HALF * 2)) * VIEW;

/** One `<path>` per level, built from the shared marching-squares segments. */
const CONTOURS = CONTOUR_LEVELS.map((level) => {
  const segs = contourSegments(level, RES);
  let d = "";
  for (let i = 0; i < segs.length; i += 4) {
    d +=
      `M${px(segs[i]).toFixed(1)} ${px(segs[i + 1]).toFixed(1)}` +
      `L${px(segs[i + 2]).toFixed(1)} ${px(segs[i + 3]).toFixed(1)}`;
  }
  return { level, d };
});

/** The same four runners the scene opens its first cycle with. */
const TRACES = cycleStarts(0).map((start) =>
  descentPath(start)
    .map(([x, z]) => `${px(x).toFixed(1)},${px(z).toFixed(1)}`)
    .join(" "),
);

function StaticOutline() {
  return (
    <svg
      viewBox={`-6 -6 ${VIEW + 12} ${VIEW + 12}`}
      className="h-[88%] w-auto max-w-[88%]"
      role="img"
      aria-label="A contour map of a loss surface with four gradient-descent paths traced across it. Three converge on the deep basin at the centre; one settles in a shallower local minimum near the lower-left corner."
      style={{ fill: "none", stroke: "var(--ink)" }}
    >
      {/* The iso-lines. Levels below zero are the basins, so they are drawn
          heavier — the depth of the field is carried by line weight, which is
          how a contour map carries it. */}
      {CONTOURS.map(({ level, d }) => (
        <path
          key={level}
          d={d}
          strokeWidth={level < 0 ? 1.1 : 0.8}
          opacity={level < 0 ? 0.5 : 0.26}
          style={{ fill: "none", stroke: "var(--ink)" }}
        />
      ))}

      {/* The descents. The last of the four is the run that ends in the local
          minimum; it is drawn at the same weight as the rest, because the
          point is that it does not look worse on the way. */}
      {TRACES.map((points, n) => (
        <polyline
          key={n}
          points={points}
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.85}
          style={{ fill: "none", stroke: "var(--trace)" }}
        />
      ))}

      {/* The frame and its ticks, which is all a contour map needs. */}
      <rect
        x={0}
        y={0}
        width={VIEW}
        height={VIEW}
        strokeWidth={1.5}
        style={{ fill: "none", stroke: "var(--ink)" }}
      />
      {[0.25, 0.5, 0.75].map((k) => (
        <path
          key={k}
          d={`M${k * VIEW} ${VIEW}v5M0 ${k * VIEW}h-5`}
          strokeWidth={1}
          style={{ fill: "none", stroke: "var(--ink-3)" }}
        />
      ))}
    </svg>
  );
}
