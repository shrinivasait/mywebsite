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
 * Everything below the fold — `[data-reveal]`, and the four entrances added
 * with the motion vocabulary (`[data-rise]`, `[data-wipe]`, `[data-rows]`,
 * `[data-slide]`, `[data-words]`) — shares one observer and one stagger,
 * computed *within a parent* and capped at six steps, so a nine-card grid
 * does not hand its last card a half-second delay and the cadence does not
 * drift as sections are added above it.
 *
 * `[data-rows]` and `[data-words]` stagger their own children instead: the
 * script writes a `--i` per row or per word once, on first sight, and the
 * stylesheet turns that into a transition delay. Doing it here rather than in
 * the markup keeps the cadence in one place and keeps a table of nine rows
 * from carrying nine hand-written delay attributes.
 *
 * Every hidden start state lives behind `.js` in globals.css, so with
 * scripting off nothing is hidden.
 */

const BELOW = "[data-reveal], [data-rise], [data-wipe], [data-rows], [data-slide], [data-words]";

export function Reveal() {
  useEffect(() => {
    const hero = Array.from(
      document.querySelectorAll<HTMLElement>("[data-set], [data-plot]"),
    );
    const below = Array.from(document.querySelectorAll<HTMLElement>(BELOW));
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

    // Index the children of the two entrances that stagger internally. Done
    // once, up front, rather than at reveal time: writing a style on nine
    // rows while they are transitioning in is the kind of thing that lands
    // mid-frame and shows.
    for (const el of below) {
      const kids =
        el.hasAttribute("data-rows")
          ? el.querySelectorAll<HTMLElement>(":scope > tr, :scope > li")
          : el.hasAttribute("data-words")
            ? el.querySelectorAll<HTMLElement>(".word")
            : null;
      if (!kids) continue;
      kids.forEach((kid, n) => kid.style.setProperty("--i", String(Math.min(n, 14))));
    }

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
