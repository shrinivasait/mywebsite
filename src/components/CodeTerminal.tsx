"use client";

import { useEffect, useRef, useState } from "react";
import { snippets, tokenize, type Tok } from "./code-snippets";

/**
 * The hero's moving part: a terminal that writes real code, runs it, prints
 * what it measured, wipes, and moves to the next file — forever.
 *
 * Why this and not a drawing: everything else on this page is a claim about
 * building production AI systems. A panel that is visibly *doing* the work,
 * with the numbers falling out of the bottom of it, is the only decoration
 * here that is also evidence.
 *
 * The whole cycle runs off one rAF loop and one piece of state (a character
 * count plus a phase), so a frame costs a slice of an array, not a re-layout.
 * With reduced motion requested it renders the first file complete and still.
 */

const PHASE = {
  /** Milliseconds per character, jittered per keystroke so it reads as hands. */
  typeMs: 13,
  /** After the last character, before the console starts. */
  runMs: 420,
  /** Between console lines. */
  logMs: 190,
  /** After the last log line, before the wipe. */
  holdMs: 2600,
  /** The wipe itself. */
  wipeMs: 420,
};

const files = snippets.map((s) => {
  const lines = tokenize(s.code);
  // Character budget per line, plus the newline that ends it.
  const total = lines.reduce((n, l) => n + l.reduce((m, t) => m + t.s.length, 0) + 1, 0);
  return { ...s, lines, total };
});

const KIND_CLASS: Record<string, string> = {
  com: "text-code-com italic",
  str: "text-code-str",
  num: "text-code-num",
  key: "text-code-key",
  fn: "text-code-fn",
  punc: "text-code-punc",
  txt: "text-code-txt",
};

/** Slice a tokenised line down to `budget` characters, keeping the colours. */
function sliceLine(line: Tok[], budget: number) {
  if (budget <= 0) return [];
  const out: { s: string; k: string }[] = [];
  let left = budget;
  for (const t of line) {
    if (left <= 0) break;
    out.push(left >= t.s.length ? t : { s: t.s.slice(0, left), k: t.k });
    left -= t.s.length;
  }
  return out;
}

/**
 * Distribute a character budget across the tokenised lines, and say which
 * line the caret is sitting on — the first one the budget has not run past.
 */
function layout(lines: Tok[][], chars: number) {
  let start = 0;
  let caretLine = -1;
  const rendered = lines.map((line, i) => {
    const len = line.reduce((m, t) => m + t.s.length, 0);
    const take = Math.max(0, Math.min(chars - start, len));
    if (caretLine === -1 && chars <= start + len) caretLine = i;
    start += len + 1;
    return { toks: sliceLine(line, take) };
  });
  return { rendered, caretLine };
}

export function CodeTerminal() {
  const [file, setFile] = useState(0);
  const [chars, setChars] = useState(0);
  const [logs, setLogs] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [still, setStill] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    if (quiet.matches) {
      // Settled, not animated: the first file complete, its run already
      // printed. Deferred a frame so the effect body itself stays free of
      // synchronous state writes.
      raf = requestAnimationFrame(() => {
        setStill(true);
        setChars(files[0].total);
        setLogs(files[0].out.length);
      });
      return () => cancelAnimationFrame(raf);
    }

    let cancelled = false;
    let idx = 0;
    let typed = 0;
    let acc = 0;
    let last = performance.now();
    // "typing" → "running" → "logging" → "holding" → "wiping"
    let phase: "typing" | "running" | "logging" | "holding" | "wiping" = "typing";
    let clock = 0;
    let shown = 0;

    const frame = (now: number) => {
      if (cancelled) return;
      // A backgrounded tab hands back a multi-second delta; clamp it so the
      // panel resumes where it was rather than skipping a whole file.
      const dt = Math.min(now - last, 100);
      last = now;

      if (phase === "typing") {
        acc += dt;
        const f = files[idx];
        while (acc > 0 && typed < f.total) {
          // Punctuation and newlines land fast, letters at the base rate, and
          // every keystroke carries a little jitter.
          acc -= PHASE.typeMs * (0.55 + Math.random() * 1.1);
          typed += 1;
        }
        if (typed >= f.total) {
          typed = f.total;
          phase = "running";
          clock = 0;
        }
        setChars(typed);
      } else {
        clock += dt;
        if (phase === "running" && clock > PHASE.runMs) {
          phase = "logging";
          clock = 0;
        } else if (phase === "logging" && clock > PHASE.logMs) {
          clock = 0;
          shown += 1;
          setLogs(shown);
          if (shown >= files[idx].out.length) phase = "holding";
        } else if (phase === "holding" && clock > PHASE.holdMs) {
          phase = "wiping";
          clock = 0;
          setWiping(true);
        } else if (phase === "wiping" && clock > PHASE.wipeMs) {
          idx = (idx + 1) % files.length;
          typed = 0;
          shown = 0;
          acc = 0;
          phase = "typing";
          setWiping(false);
          setFile(idx);
          setChars(0);
          setLogs(0);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  const f = files[file];

  // Keep the newest line in view while the file is longer than the pane.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chars]);

  const { rendered, caretLine } = layout(f.lines, chars);

  return (
    <div className={`term ${wiping ? "is-wiping" : ""}`}>
      {/* Tab strip. The active tab is the file being written; the others are
          where the panel has been and where it is going. */}
      <div className="term-bar">
        <span aria-hidden className="term-lamps">
          <i />
          <i />
          <i />
        </span>
        <div className="term-tabs" role="presentation">
          {files.map((t, i) => (
            <span key={t.name} className={`term-tab ${i === file ? "is-on" : ""}`}>
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* The editor. aria-hidden because it is an animation of code, not
          content a screen reader should be made to sit through — the summary
          below carries the same claim in one line. */}
      <div className="term-body" ref={scrollRef} aria-hidden>
        <pre className="term-code">
          <code>
            {rendered.map((r, i) => (
              <span key={i} className="term-line">
                <span className="term-gutter">{String(i + 1).padStart(2, "0")}</span>
                <span className="term-text">
                  {r.toks.map((t, j) => (
                    <span key={j} className={KIND_CLASS[t.k]}>
                      {t.s}
                    </span>
                  ))}
                  {i === caretLine && !still && <span className="term-caret" />}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      {/* The console. Where the code stops being a decoration and starts
          being the numbers the rest of the page claims. */}
      <div className="term-out" aria-hidden>
        <div className="term-out-head">
          <span className={`term-run ${logs >= f.out.length ? "is-done" : ""}`} />
          <span>{logs >= f.out.length ? "exit 0" : "running"}</span>
          <span className="term-out-file">{f.lang}</span>
        </div>
        <div className="term-log">
          {f.out.slice(0, logs).map((l, i) => (
            <p key={`${file}-${i}`} className={`term-log-line is-${l.kind ?? "dim"}`}>
              <span className="term-log-mark">›</span>
              {l.text}
            </p>
          ))}
        </div>
      </div>

      <p className="sr-only">
        An animated terminal writing retrieval, agent and voice pipeline code, then
        printing the latency and grounding figures listed in the characteristics table
        below.
      </p>
    </div>
  );
}
