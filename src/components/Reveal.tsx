"use client";

import { useEffect } from "react";

/**
 * Runs the page's entrances.
 *
 * Two populations, deliberately different:
 *
 * `[data-set]` / `[data-plot]` — the front page's authored arrival. Staggered by
 * document order at 90ms, exactly as before.
 *
 * `[data-reveal]` — everything below the fold, added when the user asked for
 * the page to feel alive as it is scrolled. Its stagger is computed *within a
 * parent*, capped at six steps, so a nine-card grid does not hand its last
 * card a half-second delay and so the cadence does not drift as sections are
 * added above it. Each element fires once and is then unobserved.
 *
 * Both hidden start states live behind `.js` in globals.css, so with scripting
 * off nothing is hidden.
 */
export function Reveal() {
  useEffect(() => {
    const hero = Array.from(
      document.querySelectorAll<HTMLElement>("[data-set], [data-plot]"),
    );
    const below = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    /* These selectors and the hidden start states in globals.css are one
       contract expressed in two files. When the population was renamed in the
       CSS and not here, every element stayed at opacity 0 and the whole front
       page rendered blank — silently, because hidden text still has valid
       computed styles and passes every automated check. This warns instead. */
    if (process.env.NODE_ENV !== "production" && !hero.length) {
      console.warn(
        "[Reveal] no [data-set] or [data-plot] elements found. If globals.css " +
          "still hides that population behind .js, the front page is blank.",
      );
    }

    if (!hero.length && !below.length) return;

    const show = (el: HTMLElement) => el.classList.add("is-in");

    if (!("IntersectionObserver" in window)) {
      [...hero, ...below].forEach(show);
      return;
    }

    const timers: number[] = [];
    const delayed = (el: HTMLElement, ms: number) =>
      timers.push(window.setTimeout(() => show(el), ms));

    // Hero: stagger derived from document order, so the markup carries no
    // hand-tuned delay attributes that drift when the layout changes.
    const heroOrder = new Map(hero.map((el, i) => [el, i]));

    // Below the fold: stagger derived from position among revealing siblings.
    const groupIndex = new Map<HTMLElement, number>();
    const seen = new Map<Element, number>();
    for (const el of below) {
      const parent = el.parentElement ?? document.body;
      const n = seen.get(parent) ?? 0;
      groupIndex.set(el, Math.min(n, 6));
      seen.set(parent, n + 1);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          delayed(
            el,
            heroOrder.has(el)
              ? (heroOrder.get(el) ?? 0) * 90
              : (groupIndex.get(el) ?? 0) * 60,
          );
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" },
    );

    [...hero, ...below].forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
