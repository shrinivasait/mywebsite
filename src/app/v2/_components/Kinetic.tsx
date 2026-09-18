"use client";

import { useEffect } from "react";

/**
 * Headlines that arrive a word at a time.
 *
 * The splitting is done on the server by `Words` (below, in `words.tsx`), not
 * here. That matters: an earlier version wrapped the words on the client, in
 * an effect, which meant the browser painted the finished heading first and
 * only then applied the mask — a flash of the real headline, then a hole, then
 * the reveal. Rendering the spans server-side puts the masked state in the
 * first frame, so there is nothing to flash.
 *
 * All this does now is decide when each heading plays.
 */
export function Kinetic() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Only headlines that are still below the fold are masked. One already on
       screen is left exactly as it rendered: masking it here would mean the
       reader watched it vanish and come back, and it would be hidden for as
       long as hydration took on a slow device. The opening's own headline is
       not in this set at all — it rises on a CSS animation that needs no
       JavaScript to lift it. */
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-kinetic]"),
    ).filter((el) => !el.closest(".cn-hero"));

    const armed = targets.filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    if (armed.length === 0) return;
    armed.forEach((el) => {
      el.dataset.armed = "1";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.play = "1";
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    armed.forEach((el) => io.observe(el));

    /* A masked headline the observer never reaches plays anyway: a clipped
       word is an unreadable word, so this is the guarantee that no failure
       upstream can cost the reader a heading. */
    const safety = window.setTimeout(() => {
      armed.forEach((el) => {
        if (el.dataset.play !== "1") el.dataset.play = "1";
      });
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
