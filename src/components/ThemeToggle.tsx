"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The theme lives on <html>, set by the inline script in layout.tsx before
 * first paint. This subscribes to that class rather than keeping a second copy
 * of the truth in React state, so the button stays correct even if something
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
    () => false, // server render: assume light, corrected on hydration
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
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className="grid size-9 place-items-center text-ink-2 transition-colors hover:bg-stock-sunken hover:text-ink"
    >
      {/* Both icons ship and CSS picks one, so nothing swaps on hydration. */}
      <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] dark:hidden" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="hidden size-[18px] dark:block" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
