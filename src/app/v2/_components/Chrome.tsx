"use client";

import { useEffect, useState } from "react";
import { projects, site } from "@/lib/content";

const SECTIONS = [
  { id: "systems", label: "Work" },
  { id: "turn", label: "Latency" },
  { id: "personnel", label: "Leadership" },
  { id: "notes", label: "Depth" },
  { id: "sessions", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * The running head. Plain section names, because a label that has to be
 * decoded is a defect — the sleeve does the talking, not the navigation.
 */
export function Head() {
  const [live, setLive] = useState<string>("systems");

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
      { rootMargin: "-56px 0px -62% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="bn-head">
      <div className="bn-shell bn-head-in">
        <span className="bn-head-id">{site.name}</span>
        <nav className="bn-head-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-live={live === s.id ? "1" : "0"}>
              {s.label}
            </a>
          ))}
        </nav>
        <a className="bn-press bn-press--plate bn-head-cta" href={`mailto:${site.email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}

/** Sections settle as they arrive. One transition, no per-section choreography. */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".bn-in"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.seen = "1";
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
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
      className="bn-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
        } catch {
          // Clipboard refused (insecure context, or the user declined). The
          // value is on screen and selectable, so this stays silent.
        }
      }}
    >
      {done ? "Copied" : `Copy ${label}`}
    </button>
  );
}

/**
 * The track listing.
 *
 * Each system is a track: number, title, the one hard figure, and a liner note
 * that opens underneath. The first is open on arrival because it is the
 * hardest claim on the page and the one the band above is playing.
 */
export function Tracks({ facts }: { facts: Record<string, string> }) {
  const [open, setOpen] = useState<string | null>(projects[0].slug);

  return (
    <div className="bn-tracks">
      {projects.map((p, i) => {
        const isOpen = open === p.slug;
        return (
          <article key={p.slug} className="bn-track" data-open={isOpen ? "1" : "0"}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="bn-track-btn"
                aria-expanded={isOpen}
                aria-controls={`bn-track-${p.slug}`}
                onClick={() => setOpen(isOpen ? null : p.slug)}
              >
                <span className="bn-track-no">A{i + 1}</span>
                <span className="bn-track-title">{p.title}</span>
                <span className="bn-track-fact">{facts[p.slug]}</span>
              </button>
            </h3>
            <div className="bn-track-body" id={`bn-track-${p.slug}`} role="region">
              <div>
                <div className="bn-track-inner">
                  <div>
                    <p>{p.summary}</p>
                    <p style={{ marginTop: 12 }}>{p.detail}</p>
                  </div>
                  <div className="bn-track-inst">
                    <span style={{ borderTop: 0, paddingTop: 0 }}>Instrumentation</span>
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
