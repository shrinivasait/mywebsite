"use client";

import { useEffect } from "react";

/**
 * Headlines that arrive a word at a time.
 *
 * The markup ships whole and readable — this only enhances it on the client,
 * so with scripting off, or under `prefers-reduced-motion`, the headings are
 * simply headings. Nothing is hidden waiting for a frame either: the words are
 * masked by their own line box, which means a word that never animates is
 * still on screen, not invisible.
 *
 * It wraps text nodes rather than rewriting `innerHTML`, so the accent spans
 * inside a heading survive the treatment intact.
 */
export function Kinetic() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-kinetic]"));
    if (targets.length === 0) return;

    let index = 0;

    targets.forEach((el) => {
      if (el.dataset.split === "1") return;

      // Collect the text nodes first: wrapping as we walk would have the walker
      // descend into the spans it has just created.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.textContent && node.textContent.trim() !== "") nodes.push(node);
      }

      nodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        // Keep the whitespace: splitting on it and re-joining is how word
        // spacing quietly disappears from a headline.
        (node.textContent ?? "").split(/(\s+)/).forEach((chunk) => {
          if (chunk.trim() === "") {
            frag.appendChild(document.createTextNode(chunk));
            return;
          }
          const mask = document.createElement("span");
          mask.className = "cn-word";
          const inner = document.createElement("span");
          inner.className = "cn-word-in";
          inner.style.setProperty("--i", String(index));
          index += 1;
          inner.textContent = chunk;
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        node.parentNode?.replaceChild(frag, node);
      });

      el.dataset.split = "1";
      index = 0;
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
    targets.forEach((el) => io.observe(el));

    // A headline that the observer never reaches plays anyway rather than
    // sitting under its own mask.
    const safety = window.setTimeout(() => {
      targets.forEach((el) => {
        if (el.dataset.play !== "1") el.dataset.play = "1";
      });
    }, 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
