"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nav, site } from "@/lib/content";

/**
 * The command palette.
 *
 * A page that presents itself as a machine should take commands. ⌘K / Ctrl-K
 * opens it, typing filters, arrows move, Enter runs.
 *
 * It is a shortcut and never the only route: every section here is in the
 * running head's menu, every action here is a control somewhere on the page.
 * That is what makes it safe to hide behind a keystroke.
 *
 * Accessibility: the input owns the keyboard (a listbox pattern with
 * `aria-activedescendant`, not roving focus), Escape closes and returns focus
 * to whatever opened it, and the scrim traps nothing — closing is always one
 * key away.
 */

type Cmd = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
};

const go = (hash: string) => () => {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.hash = hash;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const commands = useMemo<Cmd[]>(() => {
    const sections: Cmd[] = nav.map((n) => ({
      id: `go${n.href}`,
      label: n.label,
      group: "Go to",
      hint: "section",
      run: go(n.href),
    }));

    const actions: Cmd[] = [
      {
        id: "email",
        label: `Email ${site.email}`,
        group: "Do",
        hint: "mailto",
        run: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
      {
        id: "resume",
        label: "Download résumé",
        group: "Do",
        hint: "pdf",
        run: () => {
          window.location.href = site.resume;
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Do",
        hint: "external",
        run: () => window.open(site.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "copy",
        label: "Copy email address",
        group: "Do",
        hint: "clipboard",
        run: () => {
          navigator.clipboard?.writeText(site.email).catch(() => {
            /* clipboard blocked: the address is on screen in Contact anyway */
          });
        },
      },
      {
        id: "theme",
        label: "Toggle daylight / console",
        group: "Do",
        hint: "theme",
        run: () => {
          const root = document.documentElement;
          const next = root.classList.contains("dark") ? "light" : "dark";
          root.classList.toggle("dark", next === "dark");
          try {
            localStorage.setItem("theme", next);
          } catch {
            /* the choice simply does not persist */
          }
        },
      },
      {
        id: "top",
        label: "Back to top",
        group: "Do",
        hint: "scroll",
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
    ];

    return [...sections, ...actions];
  }, []);

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    // Subsequence match, so "dlr" finds "Download résumé" — the behaviour a
    // palette is expected to have, in six lines rather than a fuzzy library.
    return commands.filter((c) => {
      const t = c.label.toLowerCase();
      let k = 0;
      for (const ch of s) {
        k = t.indexOf(ch, k) + 1;
        if (k === 0) return false;
      }
      return true;
    });
  }, [commands, q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setI(0);
    opener.current?.focus();
  }, []);

  // The global hotkey.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        opener.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Keep the active option in view as the arrows move through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [i, open]);

  if (!open) {
    return (
      <button
        type="button"
        className="cmdk-hint hud"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(true);
        }}
      >
        <span className="kbd">⌘K</span>
        Command
      </button>
    );
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setI((n) => (hits.length ? (n + 1) % hits.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI((n) => (hits.length ? (n - 1 + hits.length) % hits.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = hits[i];
      if (!cmd) return;
      close();
      cmd.run();
    }
  };

  let lastGroup = "";

  return (
    <div
      className="cmdk-scrim"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <div className="cmdk-field">
          <span aria-hidden className="cmdk-prompt">
            &gt;
          </span>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Type a section or an action…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setI(0);
            }}
            role="combobox"
            aria-expanded
            aria-controls="cmdk-list"
            aria-activedescendant={hits[i] ? `cmdk-${hits[i].id}` : undefined}
            aria-label="Command"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="kbd">esc</span>
        </div>

        <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
          {hits.length === 0 && <p className="cmdk-empty">no match — try “work”, “voice”, “pdf”</p>}
          {hits.map((c, n) => {
            const head = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <div key={c.id}>
                {head && <p className="cmdk-group hud">{head}</p>}
                <button
                  type="button"
                  id={`cmdk-${c.id}`}
                  role="option"
                  aria-selected={n === i}
                  className="cmdk-item"
                  onPointerMove={() => setI(n)}
                  onClick={() => {
                    close();
                    c.run();
                  }}
                >
                  <span aria-hidden className="cmdk-prompt">
                    ›
                  </span>
                  {c.label}
                  {c.hint && <span className="cmdk-item-key">{c.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>

        <div className="cmdk-foot hud">
          <span>↑↓ move</span>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
