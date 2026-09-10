"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The boot.
 *
 * The page presents itself as a running system, so it starts the way one
 * does. Six lines, a progress bar, about 1.6 seconds, and then it wipes
 * upward out of the way.
 *
 * The rules that keep it from being a toll booth:
 *  · once per session — a second visit in the same tab goes straight in;
 *  · any key or any click ends it immediately, and that is stated on screen;
 *  · it never runs at all under `prefers-reduced-motion: reduce`;
 *  · the page underneath is fully rendered and scrollable the whole time, so
 *    a crawler, a screen reader and a visitor who dismisses it all get the
 *    same document. This is an overlay, not a gate.
 */

const LINES = [
  "init  runtime",
  "mount retrieval index",
  "load  agent tools",
  "open  voice channel",
  "check evaluation suite",
  "ready",
];

const STEP = 190;

export function Boot() {
  // Starts false so the server render and the first client render agree; the
  // effect decides within a frame whether this visit gets a boot at all.
  const [on, setOn] = useState(false);
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let cancel = false;
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
    } catch {
      // Private mode or storage disabled: treat as seen and skip the boot
      // rather than replaying it on every navigation.
      seen = true;
    }
    if (quiet || seen) return;

    const start = requestAnimationFrame(() => {
      if (cancel) return;
      setOn(true);
      document.documentElement.style.overflow = "hidden";
      LINES.forEach((_, i) =>
        timers.current.push(window.setTimeout(() => setLine(i + 1), STEP * (i + 1))),
      );
      timers.current.push(window.setTimeout(() => setDone(true), STEP * LINES.length + 260));
    });

    return () => {
      cancel = true;
      cancelAnimationFrame(start);
      timers.current.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Dismissal, and the teardown that has to happen however it ends.
  useEffect(() => {
    if (!on) return;

    const finish = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setLine(LINES.length);
      setDone(true);
    };

    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });
    return () => {
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [on]);

  useEffect(() => {
    if (!done) return;
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      /* nothing to do: the boot simply runs again next session */
    }
    const t = window.setTimeout(() => {
      setOn(false);
      document.documentElement.style.overflow = "";
    }, 520);
    return () => clearTimeout(t);
  }, [done]);

  if (!on) return null;

  const pct = Math.round((line / LINES.length) * 100);

  return (
    <div className={`boot ${done ? "is-done" : ""}`} aria-hidden>
      <div className="boot-inner">
        {LINES.slice(0, line).map((l, i) => (
          <p key={l} className="boot-line" style={{ animationDelay: `${i * 10}ms` }}>
            <span className="text-ink-3">$</span>
            <span>{l}</span>
            <span className="boot-ok">ok</span>
          </p>
        ))}
        <div className="boot-bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <p className="boot-skip">press any key to skip</p>
      </div>
    </div>
  );
}
