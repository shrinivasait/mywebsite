"use client";

import { useState } from "react";
import { BUDGET_MS, CEILING_MS, offsets, sideEffects, stages } from "./turn";

/**
 * The same turn, opened up.
 *
 * The hero shows that the budget holds. This shows why, one hop at a time:
 * pick a span and the panel states what that hop is doing and the engineering
 * decision that keeps it inside its slice. It is the trace view an engineer
 * already knows how to read, written so a non-engineer can read it too.
 */

const SCALE = 100 / CEILING_MS; // ms → % of the track

export function Trace() {
  const [active, setActive] = useState(3); // the reasoning hop: the expensive one
  const stage = stages[active];

  return (
    <div className="rt-trace">
      <div className="rt-inst">
        <div className="rt-inst-bar">
          <span className="rt-mono">trace · one turn, six spans</span>
          <span className="rt-mono rt-spacer">
            {BUDGET_MS} / {CEILING_MS} ms
          </span>
        </div>

        <div className="rt-spans" role="tablist" aria-label="Spans in one spoken turn">
          {stages.map((s, i) => {
            const left = offsets[i] * SCALE;
            const width = s.ms * SCALE;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`rt-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls="rt-span-detail"
                className="rt-span"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="rt-span-name">{s.name}</span>
                <span className="rt-span-track">
                  <span
                    className="rt-span-bar"
                    data-kind={s.kind}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span className="rt-span-ms" style={{ left: `calc(${left + width}% + 8px)` }}>
                    {s.ms}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="rt-axis" aria-hidden>
          {[0, 200, 400, 600].map((ms) => (
            <i key={ms} style={{ left: `${ms * SCALE}%` }}>
              {ms}
            </i>
          ))}
          <i data-ceil="1" style={{ left: "100%" }}>
            {CEILING_MS}
          </i>
        </div>

        <div className="rt-readout">
          <div>
            <span className="k">tool calls</span>
            <span className="v">{sideEffects.join("  ·  ")}</span>
          </div>
        </div>
      </div>

      <aside
        className="rt-panel rt-detail"
        id="rt-span-detail"
        role="tabpanel"
        aria-labelledby={`rt-tab-${stage.id}`}
      >
        <span className="rt-mono">
          span {active + 1} / {stages.length}
        </span>
        <h3>{stage.name}</h3>
        <p>{stage.what}</p>
        <p style={{ color: "var(--rt-fg-3)" }}>{stage.lever}</p>
        <dl>
          <dt>budget</dt>
          <dd>{stage.ms} ms</dd>
          <dt>share</dt>
          <dd>{Math.round((stage.ms / BUDGET_MS) * 100)}% of the turn</dd>
          <dt>method</dt>
          <dd>{stage.technique}</dd>
        </dl>
      </aside>
    </div>
  );
}
