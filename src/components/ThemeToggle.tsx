"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The theme lives on <html>, set by the inline script in layout.tsx before
 * first paint. This subscribes to that class rather than keeping a second copy
 * of the truth in React state, so the switch stays correct even if something
 * else flips the theme.
 */
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};

const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    isDark,
    () => true, // server render: the console is the default world
  );

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }, []);

  return (
    <button
      type="button"
      role="switch"
      onClick={toggle}
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      /* A rocker switch drawn the way the rest of the document is drawn: a
         sunken well, a square plate that slides, no radius anywhere. Both
         glyphs are always painted and sit above the plate — the one the plate
         is under lights up in the trace accent, the other stays a dim ink
         label of where the switch is going. Nothing swaps on hydration, so no
         flash. The neon is the document's own accent, not an imported violet
         bloom: one hue, one hairline, one short falloff. */
      className="group relative h-[22px] w-11 shrink-0 border border-reticule-2 bg-stock-sunken md:mr-1"
    >
      {/* The travelling plate. Track content box is 42px, plate is 20px. */}
      <span
        aria-hidden
        className="absolute left-0 top-0 size-5 bg-stock-plate shadow-[inset_0_0_0_1px_var(--trace),0_0_8px_var(--trace-wash),var(--lift-sm)] transition-[transform,box-shadow] duration-200 ease-set group-hover:shadow-[inset_0_0_0_1px_var(--trace),0_0_12px_var(--trace-glow),var(--lift-sm)] dark:translate-x-[22px]"
      />

      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 grid w-5 place-items-center text-trace drop-shadow-[0_0_5px_var(--trace-glow)] transition-colors duration-200 dark:text-ink-3 dark:drop-shadow-none">
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.2v2.4M12 19.4v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
        </svg>
      </span>

      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 grid w-5 place-items-center text-ink-3 transition-colors duration-200 dark:text-trace-bright dark:drop-shadow-[0_0_5px_var(--trace-glow)]">
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
        </svg>
      </span>
    </button>
  );
}
