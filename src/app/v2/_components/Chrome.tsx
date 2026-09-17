"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";
import { BUDGET_MS, CEILING_MS, offsets, stages } from "./turn";

const SECTIONS = [
  { id: "systems", label: "Systems" },
  { id: "latency", label: "Latency" },
  { id: "scale", label: "Scale" },
  { id: "depth", label: "Depth" },
  { id: "record", label: "Record" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * The running head.
 *
 * Transparent over the opening shot and solid once the page has moved, which
 * is the one piece of chrome a cinematic page is allowed: it keeps the first
 * frame clean and the rest of the document navigable.
 */
export function Head() {
  const [live, setLive] = useState<string>("systems");
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setLive(hit.target.id);
      },
      { rootMargin: "-80px 0px -66% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className="cn-head" data-stuck={stuck ? "1" : "0"}>
      <div className="cn-shell cn-head-in">
        <a className="cn-mark" href="#top">
          {site.name}
        </a>
        <nav className="cn-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-live={live === s.id ? "1" : "0"}>
              {s.label}
            </a>
          ))}
        </nav>
        <a className="cn-btn cn-btn--light" href={`mailto:${site.email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}

/** Entrance. One gesture, staggered between siblings, with a hard fallback. */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".cn-in"));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement;
            el.style.setProperty("--d", `${Math.min(i, 6) * 80}ms`);
            el.dataset.seen = "1";
            io.unobserve(el);
          });
      },
      { rootMargin: "120px 0px 0px 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.dataset.seen !== "1") el.dataset.fallback = "1";
      });
    }, 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
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
      className="cn-copy"
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

/**
 * A figure that counts up once, when it arrives.
 *
 * The value is a string from the résumé — "20+", "₹3", "5+" — so only the
 * digits inside it are animated. The written value is what ships in the
 * markup; the count is decoration on top of it, and with scripting off or
 * motion reduced the reader simply gets the number.
 */
export function Figure({ value, unit, label }: { value: string; unit: string; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/\d+/);
    if (!match) return;
    const target = Number(match[0]);
    const digits = match[0];
    let raf = 0;
    let start = 0;

    const run = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / 1100);
      const eased = 1 - (1 - t) ** 3;
      setShown(value.replace(digits, String(Math.round(target * eased))));
      if (t < 1) raf = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    // The count is decoration; the figure is evidence. If the animation never
    // runs or stalls part way, the real value is put back rather than left
    // showing a number that was never true.
    const safety = window.setTimeout(() => setShown(value), 2200);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [value]);

  return (
    <div className="cn-figure">
      <b ref={ref}>
        {shown}
        <i>{unit}</i>
      </b>
      <small>{label}</small>
    </div>
  );
}

/**
 * The turn, as a sequence.
 *
 * Six services on one track that fills as the section is read: scroll position
 * is the transport, so the reader is the one moving the turn through its
 * budget. Taking a hop holds it and states what it does and the decision that
 * keeps it inside its slice.
 *
 * It plays the designed budget, not live traffic, and the caption says so.
 */
export function Sequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(0);
  const [held, setHeld] = useState<number | null>(null);

  const playedMs = Math.round(played * CEILING_MS);
  const reached = stages.findIndex((s, i) => playedMs < offsets[i] + s.ms);
  const active = held ?? (reached < 0 ? stages.length - 1 : reached);
  const hop = stages[active];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The whole turn, stated once, on the next frame rather than inline —
      // a message from the viewport, not a cascading render in the effect.
      raf = requestAnimationFrame(() => setPlayed(BUDGET_MS / CEILING_MS));
      return () => cancelAnimationFrame(raf);
    }

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // The track fills as the section crosses the screen and holds full once
      // it is centred, so the turn is transported by the reader.
      const span = window.innerHeight * 0.66;
      const t = (window.innerHeight - r.top - window.innerHeight * 0.26) / span;
      setPlayed(Math.min(BUDGET_MS / CEILING_MS, Math.max(0, t)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="cn-seq" ref={ref}>
      <div className="cn-seq-head">
        <span className="cn-seq-ms">
          {playedMs}
          <i>ms</i>
        </span>
        <span className="cn-label">elapsed of the {CEILING_MS} ms ceiling</span>
      </div>

      <div className="cn-track" role="tablist" aria-label="Hops in one spoken turn">
        {stages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`cn-hop-${s.id}`}
            aria-selected={i === active}
            aria-controls="cn-hop-panel"
            className="cn-seg"
            style={{ flexGrow: s.ms }}
            onMouseEnter={() => setHeld(i)}
            onMouseLeave={() => setHeld(null)}
            onFocus={() => setHeld(i)}
            onBlur={() => setHeld(null)}
          >
            <span
              className="cn-seg-bar"
              style={{
                // How much of this hop the reader has transported.
                ["--fill" as string]: Math.min(
                  1,
                  Math.max(0, (playedMs - offsets[i]) / s.ms),
                ),
              }}
            />
            <span className="cn-seg-name">{s.name.split(" · ")[0]}</span>
            <span className="cn-seg-ms">{s.ms}</span>
          </button>
        ))}
      </div>

      <div
        className="cn-hop"
        id="cn-hop-panel"
        role="tabpanel"
        aria-labelledby={`cn-hop-${hop.id}`}
      >
        <h3>{hop.name}</h3>
        <div>
          <p>{hop.what}</p>
          <p>{hop.lever}</p>
        </div>
        <dl>
          <div>
            <dt>Budget</dt>
            <dd>{hop.ms} ms</dd>
          </div>
          <div>
            <dt>Share of turn</dt>
            <dd>{Math.round((hop.ms / BUDGET_MS) * 100)}%</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>{hop.technique}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
