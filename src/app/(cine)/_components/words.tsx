import { Fragment } from "react";

/**
 * A headline, split into words on the server.
 *
 * Each word is wrapped in its own mask so it can rise from under its line.
 * Because this renders during the request rather than in a client effect, the
 * masked state is in the very first frame — the heading never appears, then
 * disappears, then returns, which is what the client-side version did.
 *
 * With scripting off the mask is inert (the pre-state sits behind
 * `@media (scripting: enabled)`, never a `.js` class) and
 * the heading is an ordinary heading. The spaces are real text nodes rendered
 * *between* the masks rather than inside them, so word spacing survives the
 * clipping and the line still breaks where it should.
 *
 * `start` offsets the stagger so a heading split across an accent — "Four
 * systems," then "in production" inside an `<em>` — keeps counting rather than
 * restarting halfway through.
 */
export function Words({ children, start = 0 }: { children: string; start?: number }) {
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="cn-word">
            <span className="cn-word-in" style={{ "--i": String(start + i) } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** How many words a string contributes, for the next `start`. */
export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;
