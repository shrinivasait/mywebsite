"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneHandle } from "./core-scene";
import { BUDGET_MS } from "./turn";

/**
 * Mounts the object behind the page.
 *
 * One fixed canvas for the whole document rather than a scene per section:
 * that is what makes the page feel like one continuous shot instead of a stack
 * of widgets, and it costs a single WebGL context.
 *
 * three.js arrives through a dynamic import fired on mount, so it is never in
 * the initial bundle. Until it lands — and permanently, if WebGL is missing or
 * the context is lost twice — the CSS stage underneath is what ships: a lit
 * black room with a soft core, drawn in the same values as the scene that
 * replaces it, so a visitor who never gets the object still gets a page that
 * looks deliberate.
 */

const MAX_REBUILDS = 2;
/** One spoken turn, slowed so the core's breath is legible rather than frantic. */
const BEAT_MS = BUDGET_MS / 0.22;

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [build, setBuild] = useState(0);
  const rebuilds = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let handle: SceneHandle | null = null;
    let raf = 0;
    let cancelled = false;
    let prev = performance.now();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Read position across the whole document, 0–1. */
    const progress = () => {
      const doc = document.documentElement;
      const span = doc.scrollHeight - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      setLive(false);
      if (rebuilds.current >= MAX_REBUILDS) return;
      rebuilds.current += 1;
      setBuild((n) => n + 1);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    import("./core-scene")
      .then(({ createScene }) => {
        if (cancelled) return;
        handle = createScene(canvas, still);
        setLive(true);

        if (still) {
          // One settled frame, mid-turn, and nothing after it.
          handle.update(0.08, 0.5, 0);
          return;
        }

        let veil = -1;
        const loop = (now: number) => {
          const dt = Math.min((now - prev) / 1000, 0.05);
          prev = now;
          const p = progress();
          const beat = ((now % BEAT_MS) / BEAT_MS) as number;
          handle?.update(p, beat, dt);

          // The object is the opening shot; below it, it becomes the room the
          // page is read in. The veil deepens with read position so a lit ring
          // can never cross a paragraph and take it with it — and it deepens
          // faster on a narrow screen, where the object sits behind the reading
          // column rather than beside it.
          const narrow = window.innerWidth < 1100;
          const want =
            Math.round(Math.min(narrow ? 0.88 : 0.62, p * (narrow ? 3.4 : 1.5)) * 50) / 50;
          if (want !== veil) {
            veil = want;
            hostRef.current?.style.setProperty("--veil", String(want));
          }

          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {
        // No WebGL, or the chunk failed. The CSS stage stays, and stays good.
        if (!cancelled) setLive(false);
      });

    const onResize = () => handle?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      handle?.dispose();
    };
  }, [build]);

  return (
    <div className="cn-stage" ref={hostRef} aria-hidden data-live={live ? "1" : "0"}>
      <canvas key={build} ref={canvasRef} />
    </div>
  );
}
