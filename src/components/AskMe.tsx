"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { chatIntro, chatTopics, site, type ChatTopic } from "@/lib/content";

/**
 * A scripted answer panel — a fixed set of questions, each with one fixed
 * answer written by hand in `content.ts`.
 *
 * Deliberately not a language model: there is no request, no API key and no
 * running cost, the site stays statically prerendered, and it cannot say
 * anything that is not on the résumé. The panel says so in its first line
 * rather than letting a visitor discover it by typing and being ignored —
 * which is also why there is no text input. Clicking a question is the whole
 * interaction, and every control is a real one.
 *
 * The whole widget sits behind `.js-only`, so with scripting off a visitor
 * gets no dead button.
 */
export function AskMe() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  /** Topic ids in the order they were asked — the transcript is derived. */
  const [asked, setAsked] = useState<string[]>([]);
  /** The id currently "typing", which is the last asked one for ~half a second. */
  const [pending, setPending] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => new Map(chatTopics.map((t) => [t.id, t])), []);

  /**
   * The follow-ups the last answer suggested come first, then everything else
   * in authored order. Asked questions drop out, so the list only shrinks.
   */
  const suggestions = useMemo(() => {
    const done = new Set(asked);
    const last = asked.length ? byId.get(asked[asked.length - 1]) : undefined;
    const candidates = [...(last?.next ?? []).map((id) => byId.get(id)), ...chatTopics];
    const out: ChatTopic[] = [];
    for (const topic of candidates) {
      if (!topic || done.has(topic.id) || out.some((t) => t.id === topic.id)) continue;
      out.push(topic);
    }
    return out;
  }, [asked, byId]);

  const ask = useCallback((id: string) => {
    setAsked((prev) => [...prev, id]);
    setPending(id);
  }, []);

  // The pause before the answer is the only thing that makes this read as a
  // reply rather than an accordion opening. It is short on purpose.
  useEffect(() => {
    if (!pending) return;
    const t = window.setTimeout(() => setPending(null), 480);
    return () => window.clearTimeout(t);
  }, [pending]);

  // Keep the newest turn in view. Set directly rather than smooth-scrolled, so
  // there is nothing to suppress under reduced motion.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [asked, pending]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Escape closes and returns focus to the launcher, as the header menu does.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div className="js-only">
      {/* Two elements on purpose. `.plate` sets `background` and `border`,
          unlayered — so the outer div owns position and the shadow while the
          inner one is the plate. This is one of exactly two things on the page
          allowed a drop shadow, because it genuinely floats above the sheet. */}
      <div
        hidden={!open}
        className="fixed right-3 bottom-[4.5rem] z-50 w-[min(23.5rem,calc(100vw-1.5rem))] shadow-[var(--lift)] sm:right-6 sm:bottom-[5rem]"
      >
        <div
          ref={panelRef}
          id={panelId}
          tabIndex={-1}
          role="dialog"
          aria-label={`Ask ${site.name} — scripted answers`}
          className="query-panel plate flex max-h-[min(30rem,calc(100dvh-7.5rem))] flex-col overflow-hidden outline-none"
        >
          <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="spec-label truncate text-ink">Application notes</p>
              <p className="spec-datum mt-1 truncate text-ink-3">
                Fixed answers, in his own words
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-1 grid size-8 shrink-0 place-items-center text-ink-2 transition-colors hover:bg-stock-sunken hover:text-ink"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            ref={logRef}
            aria-live="polite"
            className="flex flex-1 flex-col overflow-y-auto px-4"
          >
            <p className="border-b border-reticule py-3.5 text-[0.8125rem] leading-[1.6] text-ink-3">
              {chatIntro}
            </p>

            {asked.map((id) => {
              const topic = byId.get(id);
              if (!topic) return null;
              return (
                <div key={id} className="border-b border-reticule py-4 last:border-b-0">
                  <Entry mark="Q">
                    <span className="font-semibold text-ink">{topic.question}</span>
                  </Entry>
                  {pending === id ? (
                    <Waiting />
                  ) : (
                    <>
                      {topic.answer.map((para, i) => (
                        <Entry key={i} mark={i === 0 ? "A" : ""}>
                          {para}
                        </Entry>
                      ))}
                      {topic.action && (
                        <div className="mt-3 pl-6">
                          <a
                            href={topic.action.href}
                            {...(topic.action.kind === "download" ? { download: true } : {})}
                            {...(topic.action.kind === "jump" ? { onClick: close } : {})}
                            className="key key-secondary !py-1.5 !text-[0.8125rem]"
                          >
                            {topic.action.label}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-h-[11.5rem] overflow-y-auto border-t border-reticule-2 bg-stock-sunken px-4 py-3">
            {suggestions.length > 0 ? (
              <>
                <p className="spec-label text-ink-3">
                  {asked.length ? "Ask something else" : "Pick a question"}
                </p>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {suggestions.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => ask(topic.id)}
                      className="border border-reticule-2 bg-stock-plate px-2.5 py-1.5 text-left text-[0.8125rem] text-ink-2 transition-colors hover:border-ink hover:text-ink active:translate-y-px"
                    >
                      {topic.question}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[0.8125rem] text-ink-2">
                  That is all of them — email me for the rest.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAsked([]);
                    setPending(null);
                  }}
                  className="px-2 py-1 text-[0.8125rem] text-ink-2 transition-colors hover:bg-stock-plate hover:text-ink"
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="key key-secondary fixed right-3 bottom-4 z-50 sm:right-6 sm:bottom-6"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {/* Not "Ask me anything": there is no text input and the answer set is
            fixed, and the disclosure inside the panel only arrives after the
            click. PRODUCT.md removed the previous assistant for exactly this
            over-promise. */}
        {open ? "Close" : "Common questions"}
      </button>
    </div>
  );
}

/**
 * One line of the transcript. The mark column is mono and fixed width, so
 * questions and answers align down an invisible rule the way a ruled Q and A
 * in a manual does. There are no chat bubbles here, because this is a
 * document, not a messaging app.
 */
function Entry({ mark, children }: { mark: string; children: React.ReactNode }) {
  return (
    <p className="mt-2 flex gap-2.5 text-[0.8125rem] leading-[1.6] text-ink-2 first:mt-0">
      <span aria-hidden className="spec-datum w-3.5 shrink-0 text-ink-3">
        {mark}
      </span>
      <span className="min-w-0">
        <span className="sr-only">
          {mark === "Q" ? "Question: " : mark === "A" ? "Answer: " : ""}
        </span>
        {children}
      </span>
    </p>
  );
}

function Waiting() {
  return (
    <p className="mt-2 flex gap-2.5">
      <span aria-hidden className="spec-datum w-3.5 shrink-0 text-ink-3">
        A
      </span>
      <span className="flex items-center gap-1 pt-1.5">
        <span className="sr-only">Retrieving the answer</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="query-dot size-1 bg-ink-3"
            style={{ animationDelay: String(i * 140) + "ms" }}
          />
        ))}
      </span>
    </p>
  );
}

/* Authored on the same 24-unit, 1.6-stroke grid as the rest of the site. */

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ChatIcon() {
  return (
    <svg {...stroke} className="size-4">
      <path d="M6 4.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6.8L6.5 19.2v-3.7H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...stroke} className="size-4">
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
    </svg>
  );
}
