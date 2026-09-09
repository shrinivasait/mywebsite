"use client";

import { useSyncExternalStore } from "react";

/**
 * The current year.
 *
 * Every route here is statically prerendered, so a bare
 * `new Date().getFullYear()` in a server component bakes the *build* year into
 * the HTML and shows a stale copyright until the next deploy. The build year is
 * the server snapshot — correct on the day, and correct for a visitor without
 * scripting — and the client snapshot reads the real clock on hydration.
 *
 * Read through `useSyncExternalStore` rather than an effect, the same way
 * `ThemeToggle` reads the theme: the year is external state, not React state.
 */
const BUILD_YEAR = new Date().getFullYear();

// Nothing to subscribe to — the value is read once per hydration.
const subscribe = () => () => {};

export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  );

  return <>{year}</>;
}
