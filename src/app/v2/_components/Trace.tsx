"use client";

import { useState } from "react";
import { BUDGET_MS, CEILING_MS, offsets, sideEffects, stages } from "./turn";

/**
 * The same turn, broken out hop by hop — the arrangement behind the take.
 *
 * The band above shows that the budget holds. This shows why: pick a hop and
 * the note beside it states what that hop is doing and the decision that keeps
 * it inside its slice. Written so a non-engineer can read it and an engineer
 * cannot fault it.
 */

const SCALE = 100 / CEILING_MS; // ms → % of the track

export function Trace() {
  const [active, setActive] = useState(3); // the reasoning hop: the expensive one
  const hop = stages[active];

  return (
    <div className="bn-trace">
      <div className="bn-spans" role="tablist" aria-label="Hops in one spoken turn">
        {stages.map((s, i) => {
          const left = offsets[i] * SCALE;
          const width = s.ms * SCALE;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`bn-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="bn-hop-detail"
              className="bn-span"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="bn-span-name">{s.name}</span>
              <span className="bn-span-track">
                <span
                  className="bn-span-bar"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
                <span className="bn-span-ms" style={{ left: `calc(${left + width}% + 8px)` }}>
                  {s.ms}
                </span>
              </span>
            </button>
          );
        })}

        <div className="bn-axis" aria-hidden>
          {[0, 200, 400, 600].map((ms) => (
            <i key={ms} style={{ left: `${ms * SCALE}%` }}>
              {ms}
            </i>
          ))}
          <i data-ceil="1" style={{ left: "100%" }}>
            {CEILING_MS} trim
          </i>
        </div>
      </div>

      <aside
        className="bn-detail"
        id="bn-hop-detail"
        role="tabpanel"
        aria-labelledby={`bn-tab-${hop.id}`}
      >
        <h3>{hop.name}</h3>
        <p>{hop.what}</p>
        <p>{hop.lever}</p>
        <dl>
          <dt>budget</dt>
          <dd>{hop.ms} ms</dd>
          <dt>share</dt>
          <dd>{Math.round((hop.ms / BUDGET_MS) * 100)}% of the turn</dd>
          <dt>method</dt>
          <dd>{hop.technique}</dd>
          <dt>tools</dt>
          <dd>{sideEffects.join("  ")}</dd>
        </dl>
      </aside>
    </div>
  );
}
