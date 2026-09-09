"use client";

import { useEffect, useRef, useState } from "react";
import { nav, sheets, site } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The running head.
 *
 * A reference document names itself on every sheet: the subject at the left,
 * the section you are reading in the middle, the sheet number at the right.
 * That is this header, and the sheet counter is the page's whole progress
 * indicator — a document has page numbers, not a coloured bar creeping across
 * the top. It replaces the previous world's accent hairline, and it tells the
 * visitor something the hairline never could: how much document is left, and
 * what they are currently inside.
 *
 * The counter is written straight to the DOM through a ref rather than through
 * state, so a scroll frame does not re-render the header.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLSpanElement>(null);
  const sheetNameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const linked = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => !!el);

    const all = sheets.flatMap((s) => {
      const el = document.getElementById(s.id);
      return el ? [{ label: s.label as string, el }] : [];
    });

    const onScroll = () => {
      setScrolled(window.scrollY > 4);

      // The sheet whose head has most recently passed the running head wins.
      let i = 0;
      for (let n = 0; n < all.length; n += 1) {
        if (all[n].el.getBoundingClientRect().top <= 88) i = n;
      }
      if (sheetRef.current) {
        sheetRef.current.textContent = `${pad(i + 1)} / ${pad(all.length)}`;
      }
      if (sheetNameRef.current) {
        sheetNameRef.current.textContent = all[i]?.label ?? "";
      }

      let current = "";
      for (const s of linked) {
        if (s.getBoundingClientRect().top <= 88) current = `#${s.id}`;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Also on resize: section offsets move with the viewport, so without this
    // the counter shows the old sheet until the next scroll event.
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Disclosure behaviour a keyboard and a pointer both expect: Escape closes
   * and hands focus back to the control that opened it, and a pointer down
   * outside dismisses. Without these the menu is a trap on a phone.
   */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || toggleRef.current?.contains(t)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "border-ink bg-stock/92 shadow-[var(--lift-sm)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[68rem] items-center gap-4 px-5 sm:px-8">
        <a href="#top" className="spec-label shrink-0 text-ink">
          {site.name}
        </a>

        {/* The section name and sheet number: the middle and right fields of a
            running head, kept together so they read as one document mark. On a
            narrow viewport the name has nowhere to go and only the number
            survives, which is still a page number. */}
        <p
          aria-hidden
          className={`spec-datum ml-auto flex min-w-0 items-baseline gap-2.5 text-ink-3 transition-opacity duration-200 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <span ref={sheetNameRef} className="hidden truncate lg:inline" />
          <span aria-hidden className="hidden h-3 w-px shrink-0 bg-reticule-2 lg:block" />
          <span ref={sheetRef} className="shrink-0 tabular-nums" />
        </p>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-0.5 md:flex md:ml-4"
        >
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "true" : undefined}
              /* The current section is marked by a well, never by a coloured
                 underline — the second ink stays on the primary action. */
              className={`px-2.5 py-1.5 text-[0.8125rem] transition-colors duration-150 ${
                active === n.href
                  ? "bg-stock-sunken text-ink"
                  : "text-ink-2 hover:bg-stock-sunken hover:text-ink"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:ml-2">
          <ThemeToggle />
          <a
            href={site.resume}
            download
            /* `max-sm:!hidden`, not `hidden sm:inline-flex`: `.key` is
               unlayered CSS and would out-cascade a layered `display: none`. */
            className="key key-secondary !px-2.5 !py-1.5 !text-[0.8125rem] max-sm:!hidden"
          >
            Résumé
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center text-ink-2 transition-colors hover:bg-stock-sunken hover:text-ink md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Always rendered so `aria-controls` resolves to a real element even
          while closed; the `hidden` attribute does the hiding. */}
      <nav
        ref={menuRef}
        id="mobile-nav"
        aria-label="Sections"
        hidden={!open}
        className="border-t border-reticule-2 bg-stock px-5 py-1 md:hidden"
      >
        {nav.map((n, i) => (
          <a
            key={n.href}
            href={n.href}
            onClick={close}
            className={`block px-1 py-3.5 text-[0.9375rem] text-ink-2 active:text-ink ${
              i > 0 ? "border-t border-reticule" : ""
            }`}
          >
            {n.label}
          </a>
        ))}
        <a
          href={site.resume}
          download
          onClick={close}
          className="flex items-center justify-between border-t border-reticule px-1 py-3.5 text-[0.9375rem] font-semibold text-ink"
        >
          Résumé
          <span className="spec-label text-ink-3">PDF</span>
        </a>
      </nav>
    </header>
  );
}
