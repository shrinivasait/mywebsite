"use client";

import { useSyncExternalStore } from "react";

/**
 * Signal running through the block diagram.
 *
 * The drawing claims four stages are one circuit. A circuit with nothing
 * moving in it is a claim you have to take on trust, so packets run the three
 * forward connectors and then close the feedback loop back onto the
 * architecture — one cycle, repeating.
 *
 * Implemented with SMIL (`animateMotion` along the real path geometry) rather
 * than CSS: the feedback path is an L with two corners, and expressing that as
 * translate keyframes means restating the geometry a second time in the
 * stylesheet, where it silently goes stale the moment the drawing is edited.
 * SMIL takes the path itself.
 *
 * SMIL is not reachable from a media query, so the reduced-motion check is
 * made here and the packets simply are not rendered. Nothing else about the
 * diagram depends on them.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToMotion = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const motionAllowed = () => !window.matchMedia(QUERY).matches;

export function CircuitPackets({
  forward,
  feedback,
  cycle = 6,
}: {
  /** The three straight connectors between stages, as path data. */
  forward: string[];
  /** The feedback route: down, back along the sheet, and up. */
  feedback: string;
  /** Seconds for one full trip around the circuit. */
  cycle?: number;
}) {
  // Subscribed rather than copied into state: the query is the source of
  // truth, and a visitor who turns motion off in system settings mid-visit
  // gets the packets removed on the spot.
  const run = useSyncExternalStore(subscribeToMotion, motionAllowed, () => false);

  if (!run) return null;

  // Each leg gets a slice of the cycle, in order, so one packet appears to
  // travel the whole circuit rather than four packets blinking at once.
  const legs = [...forward, feedback];
  const share = cycle / legs.length;

  return (
    <g className="circuit-glow" aria-hidden>
      {legs.map((d, i) => (
        <g key={i}>
          <path id={`leg-${i}`} d={d} fill="none" stroke="none" />
          <rect className="circuit-packet" x={-3} y={-3} width={6} height={6}>
            <animateMotion
              dur={`${share}s`}
              begin={`${i * share}s`}
              repeatCount="indefinite"
              // The packet is parked off the drawing for the rest of the
              // cycle: `fill="remove"` would leave it sitting at the leg's
              // start point, which reads as four idle dots.
              fill="remove"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href={`#leg-${i}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.08;0.85;1"
              dur={`${share}s`}
              begin={`${i * share}s`}
              repeatCount="indefinite"
              fill="remove"
            />
          </rect>
        </g>
      ))}
      {/* Parked out of sight between trips. Without this the packets sit at
          their leg origins for five sixths of every cycle. */}
      <style>{`.circuit-packet { opacity: 0 }`}</style>
    </g>
  );
}
