/**
 * The document's inks, as the values a WebGL scene needs.
 *
 * Lives apart from any one scene because more than one drawing reads it, and a
 * second copy of this reader is how two objects on the same page end up in two
 * slightly different palettes. Every value comes from a custom property in
 * globals.css; nothing here has a colour of its own, and the fallbacks are only
 * for the frame before the stylesheet has resolved.
 */
export type Vars = {
  face: string;
  face2: string;
  face3: string;
  rampLow: string;
  rampMid: string;
  rampHigh: string;
  edge: string;
  mark: string;
  key: number;
};

export const readVars = (): Vars => {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, fallback: string) => s.getPropertyValue(n).trim() || fallback;
  return {
    face: v("--scene-face", "#eceeed"),
    face2: v("--scene-face-2", "#f7f8f7"),
    face3: v("--scene-face-3", "#d8dcdb"),
    rampLow: v("--scene-ramp-low", "#6ea6b9"),
    rampMid: v("--scene-ramp-mid", "#bcd4da"),
    rampHigh: v("--scene-ramp-high", "#f4f7f6"),
    edge: v("--scene-edge", "#14171b"),
    mark: v("--scene-mark", "#046a90"),
    key: parseFloat(v("--scene-key", "1.15")),
  };
};

/** Samples the three-stop height ramp at `t` in 0..1, into `out`. */
export const rampAt = <T extends { set(c: string): T; lerp(c: T, a: number): T; copy(c: T): T }>(
  out: T,
  low: T,
  mid: T,
  high: T,
  vars: Vars,
  t: number,
): T => {
  low.set(vars.rampLow);
  mid.set(vars.rampMid);
  high.set(vars.rampHigh);
  /* The midpoint sits at 0.45 rather than 0.5: it gives the low half of the
     ramp the smaller share of the range, so the saturated end keeps its colour
     instead of washing out across a field that is mostly upland. */
  return t < 0.45
    ? out.copy(low).lerp(mid, t / 0.45)
    : out.copy(mid).lerp(high, (t - 0.45) / 0.55);
};
