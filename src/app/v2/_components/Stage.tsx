"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneHandle } from "./core-scene";
import { BUDGET_MS } from "./turn";

/**
 * Mounts the object behind the opening.
 *
 * The canvas is absolutely positioned inside the hero rather than fixed behind
 * the document: the object is the opening shot and nothing else. Below the
 * fold it is neither drawn nor rendered, which keeps the reading sections on a
 * plain black ground and stops the loop entirely once the hero leaves view.
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

    /** How far the opening itself has been scrolled away, 0–1. */
    const progress = () => {
      const host = hostRef.current;
      if (!host) return 0;
      const r = host.getBoundingClientRect();
      const span = Math.max(1, r.height);
      return Math.min(1, Math.max(0, -r.top / span));
    };

    /** The loop sleeps as soon as the opening is off screen. */
    let onScreen = true;
    const seen = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    if (hostRef.current) seen.observe(hostRef.current);

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

        const loop = (now: number) => {
          const dt = Math.min((now - prev) / 1000, 0.05);
          prev = now;
          if (onScreen) {
            const beat = ((now % BEAT_MS) / BEAT_MS) as number;
            handle?.update(progress(), beat, dt);
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
      seen.disconnect();
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
