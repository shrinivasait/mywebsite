import { blockFeedback, blockStages } from "@/lib/content";

/**
 * Drawn flows.
 *
 * The page was carrying its argument almost entirely in prose. These two put
 * the same claims on the screen as diagrams — the primary route does this and
 * it is the thing that keeps it from reading as an essay.
 *
 * Both are SVG, server-rendered, and correct with no JavaScript. The signal
 * travelling each connector is a dashed stroke offset by a keyframe, which is
 * one composited property and no work on the main thread; under
 * `prefers-reduced-motion` the dash simply stops and the diagram stands.
 */

/** One connector: a hairline with a signal running it, and an arrowhead. */
function Link({ vertical = false }: { vertical?: boolean }) {
  return (
    <span className={vertical ? "cn-link-v" : "cn-link-h"} aria-hidden>
      <svg viewBox={vertical ? "0 0 12 44" : "0 0 64 12"} preserveAspectRatio="none">
        <line
          className="cn-wire"
          x1={vertical ? 6 : 0}
          y1={vertical ? 0 : 6}
          x2={vertical ? 6 : 52}
          y2={vertical ? 32 : 6}
          vectorEffect="non-scaling-stroke"
        />
        <line
          className="cn-wire cn-wire--live"
          x1={vertical ? 6 : 0}
          y1={vertical ? 0 : 6}
          x2={vertical ? 6 : 52}
          y2={vertical ? 32 : 6}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="cn-arrow" viewBox="0 0 12 12" aria-hidden>
        <path
          d={vertical ? "M1.5 5.5 6 10l4.5-4.5" : "M5.5 1.5 10 6l-4.5 4.5"}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/**
 * The pairing, as one circuit.
 *
 * Strategy funds the team, the team builds the architecture, the architecture
 * produces the systems — and evaluation closes the loop back onto the
 * architecture. Every stage and every figure is already stated elsewhere on
 * the page; drawing them is what makes the pairing a mechanism rather than a
 * claim that two things are related.
 */
export function Circuit() {
  return (
    <figure className="cn-circuit" aria-label="Block diagram: strategy funds the team, the team builds the reference architecture, the architecture produces the production systems, and evaluation and benchmarking feeds back onto the architecture.">
      <div className="cn-circuit-row">
        {blockStages.map((stage, i) => (
          <div key={stage.label} className="cn-node-wrap">
            <div className="cn-node" data-kind={i === 3 ? "out" : i === 0 ? "in" : "mid"}>
              <span className="cn-node-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="cn-node-label">{stage.label}</span>
              <span className="cn-node-datum">{stage.datum}</span>
            </div>
            {i < blockStages.length - 1 ? (
              <>
                <Link />
                <Link vertical />
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* The loop. It leaves the systems, passes through evaluation, and
          returns to the architecture — which is the claim: the framework is
          what keeps the architecture honest once the systems are live. */}
      <div className="cn-fb-wrap">
        <div className="cn-fb">
          <span className="cn-fb-stub cn-fb-stub--in" aria-hidden>
            <svg viewBox="0 0 12 12">
              <path d="M1.5 5.5 6 10l4.5-4.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
          <span className="cn-fb-stub cn-fb-stub--out" aria-hidden>
            <svg viewBox="0 0 12 12">
              <path d="M1.5 6.5 6 2l4.5 4.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
          <span className="cn-node-no">Feedback</span>
          <span className="cn-node-label">{blockFeedback.label}</span>
          <span className="cn-node-datum">{blockFeedback.datum}</span>
        </div>
      </div>
    </figure>
  );
}

/**
 * A system's own chain.
 *
 * The components a system runs on, drawn as the pipeline they form rather than
 * listed as tags. Same words as before — the arrows are the addition, and they
 * say something the list did not: that these are stages, in this order.
 */
export function Pipeline({ stack }: { stack: readonly string[] }) {
  return (
    <ol className="cn-pipe" aria-label={`Pipeline: ${stack.join(", then ")}`}>
      {stack.map((item, i) => (
        <li key={item}>
          <span className="cn-pipe-node">{item}</span>
          {i < stack.length - 1 ? (
            <svg className="cn-pipe-arrow" viewBox="0 0 12 12" aria-hidden>
              <path d="M4.5 2 8.5 6l-4 4" vectorEffect="non-scaling-stroke" />
            </svg>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
