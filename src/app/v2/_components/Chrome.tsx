"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { BUDGET_MS, CEILING_MS, offsets, sideEffects, stages } from "./turn";

const SECTIONS = [
  { id: "path", label: "Latency" },
  { id: "blocks", label: "Work" },
  { id: "org", label: "Leadership" },
  { id: "stack", label: "Depth" },
  { id: "revs", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** The running head. Plain section names: a label that needs decoding is a defect. */
export function Head() {
  const [live, setLive] = useState<string>("path");

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
      { rootMargin: "-54px 0px -62% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="d-head">
      <div className="d-shell d-head-in">
        <span className="d-head-id">
          {site.name} <em>· {site.role}</em>
        </span>
        <nav className="d-head-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-live={live === s.id ? "1" : "0"}>
              {s.label}
            </a>
          ))}
        </nav>
        <a className="d-key d-key--live d-head-cta" href={`mailto:${site.email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}

/** Sections settle as they arrive; nothing is hidden waiting for an observer. */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".d-in"));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.seen = "1";
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
      className="d-copy"
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

const SCALE = 100 / CEILING_MS;

/**
 * The critical path, opened up.
 *
 * The die shows the charge crossing it; this is the timing for the same turn,
 * leg by leg. Pick one and the panel states what that hop does and the
 * decision that keeps it inside its slice.
 */
export function CriticalPath() {
  const [active, setActive] = useState(3); // the reasoning hop: the expensive one
  const hop = stages[active];

  return (
    <div className="d-path">
      <div className="d-legs" role="tablist" aria-label="Legs of the critical path">
        {stages.map((s, i) => {
          const left = offsets[i] * SCALE;
          const width = s.ms * SCALE;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`d-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="d-leg-detail"
              className="d-leg"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="d-leg-name">{s.name}</span>
              <span className="d-leg-track">
                <span className="d-leg-bar" style={{ left: `${left}%`, width: `${width}%` }} />
                <span className="d-leg-ms" style={{ left: `calc(${left + width}% + 8px)` }}>
                  {s.ms}
                </span>
              </span>
            </button>
          );
        })}
        <div className="d-axis" aria-hidden>
          {[0, 200, 400, 600].map((ms) => (
            <i key={ms} style={{ left: `${ms * SCALE}%` }}>
              {ms}
            </i>
          ))}
          <i data-ceil="1" style={{ left: "100%" }}>
            {CEILING_MS} ceiling
          </i>
        </div>
      </div>

      <aside
        className="d-leg-detail"
        id="d-leg-detail"
        role="tabpanel"
        aria-labelledby={`d-tab-${hop.id}`}
      >
        <h3>{hop.name}</h3>
        <p>{hop.what}</p>
        <p>{hop.lever}</p>
        <dl>
          <dt>budget</dt>
          <dd>{hop.ms} ms</dd>
          <dt>share</dt>
          <dd>{Math.round((hop.ms / BUDGET_MS) * 100)}% of the turn</dd>
          <dt>method</dt>
          <dd>{hop.technique}</dd>
          <dt>tools</dt>
          <dd>{sideEffects.join("  ")}</dd>
        </dl>
      </aside>
    </div>
  );
}
