/**
 * The loss surface, descent on it, and its contours.
 *
 * Pure functions, no three.js and no DOM: the WebGL scene and the flat SVG
 * fallback both import from here, so the surface a visitor sees in 3D and the
 * contour map a visitor sees without WebGL are the same field, with the same
 * iso-lines and the same paths traced across it. Two drawings of one function
 * cannot drift.
 *
 * The field is closed-form and deterministic. No noise, no seed, and nothing to
 * settle, so it evaluates identically on the server, in the browser, and inside
 * a render loop — and every path can be precomputed once instead of integrated
 * per frame.
 *
 * Every constant below was tuned against the actual integration rather than by
 * eye, because the first version looked plausible and was wrong: it had no
 * global trend, so gradients vanished on the outer plateau, three of four runs
 * never reached the basin and one slid into the domain wall. The `bowl` term is
 * the fix and it is also the honest one — a real loss surface has an overall
 * convex trend with local structure on top of it, not local structure alone.
 */

/** The field is defined and drawn over [-HALF, HALF] in both axes. */
export const HALF = 4.6;

/**
 * Loss at a point. Lower is better, so the deep basin near the origin is the
 * global optimum and the pocket in the near corner is a worse local one.
 */
export function lossAt(x: number, z: number): number {
  // The overall convex trend. This is what gives descent something to follow
  // anywhere in the domain, and what makes the corner pocket a real trap
  // rather than just a dent.
  const bowl = 0.032 * (x * x + z * z);
  const basin = -1.35 * Math.exp(-(x * x + z * z) / 3.2);
  const ridgeA = 0.7 * Math.exp(-((x - 2.2) ** 2 + (z + 2.0) ** 2) / 1.6);
  const ridgeB = 0.55 * Math.exp(-((x + 2.6) ** 2 + (z - 2.2) ** 2) / 1.8);
  const trap = -0.75 * Math.exp(-((x + 3.0) ** 2 + (z + 2.9) ** 2) / 0.85);
  const texture = 0.1 * Math.sin(x * 1.15) * Math.cos(z * 1.05);
  return bowl + basin + ridgeA + ridgeB + trap + texture;
}

/**
 * The field's range over the drawn domain, measured on a 240x240 sample rather
 * than guessed, so the shading ramp and the plot cage are both correct.
 * Measured: -1.354 to 1.366.
 */
export const LOSS_MIN = -1.36;
export const LOSS_MAX = 1.37;

/** Normalised 0..1 height, for surface shading. */
export function lossNorm(x: number, z: number): number {
  const t = (lossAt(x, z) - LOSS_MIN) / (LOSS_MAX - LOSS_MIN);
  return Math.min(1, Math.max(0, t));
}

/* ── Contours ────────────────────────────────────────────────────────────────
   Eight levels across the field, which is enough to show both basins without
   the rings closing into a solid patch at the bottom of the deep one.
   ─────────────────────────────────────────────────────────────────────────── */

export const CONTOUR_LEVELS = [-1.15, -0.85, -0.55, -0.25, 0.1, 0.45, 0.8, 1.15];

/**
 * Marching squares over a `res` by `res` sample, returned as a flat list of
 * 2D segments: `[x0, z0, x1, z1, ...]` in field coordinates.
 *
 * For each cell the level crosses either two edges (one segment) or all four (a
 * saddle, two segments); anything else means the level misses the cell. The
 * segments are not stitched into polylines because at this density the joins
 * are sub-pixel and stitching would cost more than it shows.
 */
export function contourSegments(level: number, res: number): number[] {
  const step = (HALF * 2) / res;
  const at = (i: number) => -HALF + i * step;
  const out: number[] = [];

  for (let i = 0; i < res; i += 1) {
    for (let j = 0; j < res; j += 1) {
      const x0 = at(j);
      const x1 = at(j + 1);
      const z0 = at(i);
      const z1 = at(i + 1);
      const cx = [x0, x1, x1, x0];
      const cz = [z0, z0, z1, z1];
      const cv = [lossAt(x0, z0), lossAt(x1, z0), lossAt(x1, z1), lossAt(x0, z1)];

      const hx: number[] = [];
      const hz: number[] = [];
      for (let e = 0; e < 4; e += 1) {
        const f = (e + 1) % 4;
        if ((cv[e] - level) * (cv[f] - level) >= 0) continue;
        const t = (level - cv[e]) / (cv[f] - cv[e]);
        hx.push(cx[e] + (cx[f] - cx[e]) * t);
        hz.push(cz[e] + (cz[f] - cz[e]) * t);
      }

      if (hx.length === 2) out.push(hx[0], hz[0], hx[1], hz[1]);
      else if (hx.length === 4) {
        out.push(hx[0], hz[0], hx[1], hz[1]);
        out.push(hx[2], hz[2], hx[3], hz[3]);
      }
    }
  }

  return out;
}

/* ── Descent ─────────────────────────────────────────────────────────────────
   Several optimisers run at once, from starts spread around the field, so the
   drawing is a comparison rather than a single demonstration — which is also
   what this looks like in practice, where you run a sweep and not one job.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Six starts spread around the ring, each of which reaches the global basin by
 * a different route of 7.3 to 8.8 units. Verified against the integration: all
 * six converge, none touches the domain boundary.
 */
export const GLOBAL_STARTS: [number, number][] = [
  [-3.48, -0.93],
  [1.8, -3.12],
  [3.96, -1.06],
  [3.12, 1.8],
  [1.06, 3.96],
  [-1.8, 3.12],
];

/**
 * Two starts that run five to six units and then settle in the shallow corner
 * pocket at a loss of -0.24 instead of the global -1.35.
 *
 * Every cycle includes exactly one of these. Descent does not always find the
 * best answer, and a demonstration that only ever shows success is a worse
 * demonstration — the point is legible precisely because three runners reach
 * the bottom while a fourth, from a start that looks no worse, does not.
 */
export const TRAP_STARTS: [number, number][] = [
  [-2.0, -4.4],
  [-4.3, -1.5],
];

export const RUNNERS = 4;

/**
 * The four starts for a given cycle: three global, spread wide by stepping two
 * at a time through the ring so no two runners set off from neighbouring
 * angles, plus one trap approach.
 */
export function cycleStarts(cycle: number): [number, number][] {
  const g = GLOBAL_STARTS.length;
  return [
    GLOBAL_STARTS[cycle % g],
    GLOBAL_STARTS[(cycle + 2) % g],
    GLOBAL_STARTS[(cycle + 4) % g],
    TRAP_STARTS[cycle % TRAP_STARTS.length],
  ];
}

const STEPS = 130;
const RATE = 0.07;
const MOMENTUM = 0.9;
const EPS = 0.012;

/**
 * Momentum descent from a start point, as a polyline of `STEPS + 1` points.
 *
 * The gradient is a central difference rather than an analytic derivative, so
 * the path is a genuine numerical descent on the same function the surface is
 * drawn from. The high momentum is what makes the paths swing wide and curve
 * into the basin instead of running straight at it — the routes are 1.6 to 1.8
 * times their straight-line distance, which is the part that looks like
 * training rather than like a line to a dot.
 */
export function descentPath(start: [number, number]): [number, number][] {
  let [x, z] = start;
  let vx = 0;
  let vz = 0;
  const path: [number, number][] = [[x, z]];

  for (let n = 0; n < STEPS; n += 1) {
    const gx = (lossAt(x + EPS, z) - lossAt(x - EPS, z)) / (2 * EPS);
    const gz = (lossAt(x, z + EPS) - lossAt(x, z - EPS)) / (2 * EPS);

    vx = MOMENTUM * vx - RATE * gx;
    vz = MOMENTUM * vz - RATE * gz;
    x = Math.min(HALF, Math.max(-HALF, x + vx));
    z = Math.min(HALF, Math.max(-HALF, z + vz));

    path.push([x, z]);
  }

  return path;
}

export const PATH_POINTS = STEPS + 1;
export const TOTAL_STEPS = STEPS;

/** How many points at the head of a trace are drawn at full strength. */
export const HEAD_POINTS = 24;
