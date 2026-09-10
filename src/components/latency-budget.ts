/**
 * The voice pipeline's latency budget, as data.
 *
 * Separate from the drawing for the same reason `loss-surface.ts` is: the
 * numbers are the claim, the geometry is only how the claim is shown, and a
 * flat fallback and a WebGL scene reading the same module cannot disagree
 * about what the figure says.
 *
 * The four stages are the real decomposition of an end-to-end spoken turn, and
 * the totals land in the 650-800 ms band the page claims. Every run is
 * generated from its cycle index rather than from `Math.random`, so a given
 * cycle is the same run on the server, on the client, and on a reload.
 */

/** One stage of a spoken turn, with its typical cost and how much it moves. */
export type Stage = { key: string; label: string; typ: number; jitter: number };

export const STAGES: Stage[] = [
  { key: "vad", label: "endpoint", typ: 90, jitter: 22 },
  { key: "asr", label: "transcribe", typ: 180, jitter: 45 },
  { key: "llm", label: "first token", typ: 240, jitter: 70 },
  { key: "tts", label: "first audio", typ: 190, jitter: 40 },
];

/** The contractual ceiling. Crossing it is the failure the drawing is about. */
export const BUDGET = 800;

/** The axis runs past the ceiling, or the ceiling would sit on the frame edge
    and read as the end of the chart rather than as a limit inside it. */
export const FIELD = 1000;

export const TOTAL_TYP = STAGES.reduce((n, s) => n + s.typ, 0);

/** Deterministic unit noise. A hash rather than a seeded generator so any
    (cycle, stage) pair can be evaluated on its own, in any order. */
const noise = (cycle: number, i: number) => {
  let h = Math.imul(cycle * 73856093 + i * 19349663 + 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
};

/**
 * The durations for one run, in stage order.
 *
 * Every fourth cycle is a *hot* run: every stage lands at the slow end at
 * once, so the total climbs into the high 700s and the drawing nearly touches
 * its ceiling. That run is the point of the object. A budget you always clear
 * by 150 ms is not a budget anyone had to engineer, and an object that never
 * approaches its limit is decoration — it is the same argument the loss
 * surface makes with its trapped fourth runner.
 */
export const runDurations = (cycle: number): number[] => {
  const hot = cycle % 4 === 3;
  return STAGES.map((s, i) => {
    const u = noise(cycle, i);
    /* A normal run stays inside +/-0.3 of each stage's jitter, which puts the
       total in the 647-753 band; a hot run biases every stage to +0.30..0.50,
       which puts it in 753-788. The two bands do not overlap, so the hot run
       is legible as a different kind of run rather than as a slow one, and
       neither band can cross 800 -- the claim is that the ceiling holds. */
    const spread = hot ? 0.3 + u * 0.2 : (u - 0.5) * 0.6;
    return Math.round(s.typ + s.jitter * spread);
  });
};

/** Where each stage starts, given its durations. */
export const offsets = (durs: number[]): number[] => {
  const out: number[] = [];
  let t = 0;
  for (const d of durs) {
    out.push(t);
    t += d;
  }
  return out;
};

export const total = (durs: number[]) => durs.reduce((n, d) => n + d, 0);

/** Which stage is running at `ms`, or the last one once the turn is done. */
export const stageAt = (durs: number[], ms: number) => {
  let t = 0;
  for (let i = 0; i < durs.length; i += 1) {
    t += durs[i];
    if (ms < t) return i;
  }
  return durs.length - 1;
};
