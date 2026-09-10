"use client";

import { useEffect, useRef } from "react";
import { BUDGET, FIELD, STAGES, offsets, runDurations, total } from "./latency-budget";

/**
 * The voice pipeline's latency budget, played in real time.
 *
 * A spoken turn is four stages against one contractual ceiling, and the whole
 * claim of the featured system is that the four of them fit inside 800 ms over
 * telephony. So this runs turns: the playhead advances at 1 ms per
 * millisecond, each stage fills as the playhead reaches it, the total lands,
 * and the run is added to the strip of recent turns underneath. Every fourth
 * run is a *hot* one where every stage lands at the slow end at once and the
 * bar nearly touches the ceiling — a budget you always clear by 150 ms is not
 * a budget anyone had to engineer.
 *
 * It shares `latency-budget.ts` with the WebGL object in /lab, so the flat
 * version and the dimensional one cannot disagree about what the figure says.
 * Runs are generated from a cycle index rather than `Math.random`, so a given
 * cycle is the same run on the server, on the client and on a reload.
 *
 * Nothing here is React state: one rAF loop writes widths and text through
 * refs, because a 60 Hz re-render of nine nodes to move a playhead is the
 * definition of work for nothing.
 */

/** Milliseconds of stillness between one turn landing and the next starting. */
const REST = 900;
/** How many finished turns the strip remembers. */
const HISTORY = 14;

const H = 34;
const pct = (ms: number) => (ms / FIELD) * 100;

export function LatencyBudget() {
  const wrap = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const chips = useRef<(HTMLSpanElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Settled state: one representative turn, fully landed, no loop. The
    // figure is the point; the animation is only how it is shown.
    const settle = (cycle: number) => {
      const durs = runDurations(cycle);
      const offs = offsets(durs);
      durs.forEach((d, i) => {
        const bar = bars.current[i];
        if (bar) {
          bar.style.left = `${pct(offs[i])}%`;
          bar.style.width = `${pct(d)}%`;
        }
        const chip = chips.current[i];
        if (chip) chip.textContent = `${d}`;
      });
      if (head.current) head.current.style.left = `${pct(total(durs))}%`;
      if (readout.current) {
        readout.current.textContent = `${total(durs)} of ${BUDGET} ms  ·  turn complete`;
      }
      return durs;
    };

    if (quiet.matches) {
      settle(0);
      return;
    }

    let cycle = 0;
    let durs = runDurations(cycle);
    let offs = offsets(durs);
    let sum = total(durs);
    let ms = 0;
    let resting = 0;
    let last = performance.now();
    let raf = 0;
    let running = true;
    const history: { t: number; hot: boolean }[] = [];

    const paintStrip = () => {
      const el = strip.current;
      if (!el) return;
      el.replaceChildren(
        ...history.map((h) => {
          const i = document.createElement("i");
          i.className = `lat-tick${h.hot ? " is-hot" : ""}`;
          // Scaled inside the band above the typical floor, so the difference
          // between a 660 ms turn and a 780 ms one is actually visible.
          i.style.height = `${Math.round(((h.t - 560) / (BUDGET - 560)) * 100)}%`;
          i.title = `${h.t} ms`;
          return i;
        }),
      );
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(now - last, 64);
      last = now;

      if (resting > 0) {
        resting -= dt;
        if (resting <= 0) {
          cycle += 1;
          durs = runDurations(cycle);
          offs = offsets(durs);
          sum = total(durs);
          ms = 0;
          for (const bar of bars.current) if (bar) bar.style.width = "0%";
        }
      } else {
        ms += dt;
        if (ms >= sum) {
          ms = sum;
          resting = REST;
          history.push({ t: sum, hot: cycle % 4 === 3 });
          if (history.length > HISTORY) history.shift();
          paintStrip();
        }

        // Each stage is filled to however far the playhead has run into it.
        let stage = 0;
        durs.forEach((d, i) => {
          const into = Math.max(0, Math.min(ms - offs[i], d));
          const bar = bars.current[i];
          if (bar) {
            bar.style.left = `${pct(offs[i])}%`;
            bar.style.width = `${pct(into)}%`;
          }
          const chip = chips.current[i];
          if (chip) chip.textContent = into >= d ? `${d}` : `${Math.round(into)}`;
          if (ms > offs[i]) stage = i;
        });

        if (head.current) head.current.style.left = `${pct(ms)}%`;
        if (readout.current) {
          readout.current.textContent =
            ms >= sum
              ? `${sum} of ${BUDGET} ms  ·  turn complete${cycle % 4 === 3 ? "  ·  hot" : ""}`
              : `${Math.round(ms)} ms  ·  ${STAGES[stage].label}`;
        }
        if (wrap.current) wrap.current.classList.toggle("is-hot", cycle % 4 === 3);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // The server render is the first deterministic turn, landed. With no
  // scripting, and in print, that is what the figure shows — a correct
  // drawing rather than an empty frame waiting for a loop.
  const seed = runDurations(0);
  const seedOffs = offsets(seed);

  return (
    <figure className="lat" ref={wrap}>
      <figcaption className="lat-head">
        <span className="hud">Latency budget · one spoken turn</span>
        <p className="lat-read hud" ref={readout}>
          {total(seed)} of {BUDGET} ms &nbsp;·&nbsp; turn complete
        </p>
      </figcaption>

      <div className="lat-track">
        {/* The ceiling. It sits inside the field rather than at its edge, so
            it reads as a limit the run approaches and not as the end of the
            chart. */}
        <div className="lat-ceiling" style={{ left: `${pct(BUDGET)}%` }}>
          <span className="lat-ceiling-tag hud">{BUDGET} ms</span>
        </div>
        {STAGES.map((s, i) => (
          <div
            key={s.key}
            ref={(el) => {
              bars.current[i] = el;
            }}
            className={`lat-bar lat-bar-${i}`}
            style={{ left: `${pct(seedOffs[i])}%`, width: `${pct(seed[i])}%`, height: H }}
          />
        ))}
        <div className="lat-playhead" ref={head} style={{ left: `${pct(total(seed))}%` }} />
      </div>

      <ul className="lat-legend">
        {STAGES.map((s, i) => (
          <li key={s.key} className={`lat-key lat-key-${i}`}>
            <span aria-hidden className="lat-swatch" />
            <span className="lat-label">{s.label}</span>
            <span className="lat-ms">
              <span
                ref={(el) => {
                  chips.current[i] = el;
                }}
              >
                {seed[i]}
              </span>
              <i>ms</i>
            </span>
          </li>
        ))}
      </ul>

      <div className="lat-strip" ref={strip} aria-hidden />
      <p className="sr-only">
        Animated latency budget for one spoken turn: endpoint detection, transcription,
        first language-model token and first audio out, totalling {total(seed)} of a{" "}
        {BUDGET} millisecond ceiling.
      </p>
    </figure>
  );
}
