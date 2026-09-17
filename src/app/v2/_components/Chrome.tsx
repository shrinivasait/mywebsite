"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

const SECTIONS = [
  { id: "turn", label: "Latency" },
  { id: "systems", label: "Systems" },
  { id: "scale", label: "Scale" },
  { id: "stack", label: "Stack" },
  { id: "log", label: "Record" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * The running head. It tracks read position the way a console tracks a
 * selected pane — the current section is lit, nothing slides.
 */
export function Head() {
  const [live, setLive] = useState<string>("turn");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The section occupying the band just under the head wins; ties go to
        // whichever is further down the page, so the head never lags a scroll.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setLive(hit.target.id);
      },
      { rootMargin: "-58px 0px -62% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="rt-head">
      <div className="rt-shell rt-head-in">
        <span className="rt-head-id">
          {site.name} <span>· {site.role}</span>
        </span>
        <nav className="rt-head-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-live={live === s.id ? "1" : "0"}>
              {s.label}
            </a>
          ))}
        </nav>
        <a className="rt-btn rt-btn--key rt-head-cta" href={`mailto:${site.email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}

/**
 * Entrance. One observer for the whole page rather than one per section, and
 * the class it sets is inert under `prefers-reduced-motion`.
 */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rt-in, .rt-alloc article"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.seen = "1";
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
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
      className="rt-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
        } catch {
          // Clipboard refused (insecure context, or the user said no). The
          // value is on screen and selectable either way, so this is silent.
        }
      }}
    >
      {done ? "copied" : `copy ${label}`}
    </button>
  );
}
