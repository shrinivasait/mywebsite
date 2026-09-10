/**
 * The latency budget.
 *
 * A spoken turn drawn as a solid: four stage blocks — endpoint, transcribe,
 * first token, first audio — laid end to end along a millisecond axis, each on
 * its own lane, standing on a plate inside the same drawn cage the loss surface
 * uses. A wall crosses the field at 800 ms. The run fills left to right in real
 * proportion, a sweep line tracks the elapsed time, and the turn stops short of
 * the wall. Every fourth run is a hot one that gets close to it.
 *
 * Why this and not another loss landscape:
 *
 *   - It is *this* engineer's evidence rather than a stock machine-learning
 *     image. A loss surface says "someone here does ML"; a 700 ms turn against
 *     an 800 ms ceiling says what was built and how well it holds.
 *   - A non-engineer can read it. The page's primary reader is a recruiter
 *     screening on behalf of an engineering org, and "the bars stop before the
 *     wall" is a claim they can hold without knowing what a gradient is.
 *   - It is natively a datasheet figure. Timing diagrams are what the document
 *     this page imitates is actually made of.
 *
 * Its weakness, stated plainly: it is four boxes, and boxes are easier to make
 * boring than a landscape is. It earns its place through proportion, the wall
 * and the hot run — not through form.
 *
 * Like the loss surface, every colour comes from the custom properties in
 * globals.css by way of scene-vars.ts, re-read whenever the theme class flips.
 */

import * as THREE from "three";
import { BUDGET, FIELD, STAGES, offsets, runDurations, stageAt, total } from "./latency-budget";
import { rampAt, readVars } from "./scene-vars";

/** What the scene reports to its host for the live readout. */
export type Sample = { ms: number; stage: number; total: number; hot: boolean };
export type SceneHandle = { destroy: () => void };

/* ── Geometry constants ─────────────────────────────────────────────────────
   SPAN is how many world units the full 0..FIELD ms axis occupies, so every
   millisecond has one fixed width and two runs are directly comparable by eye.
   That is also why the camera is orthographic: under perspective a stage
   further from the lens would look faster than the same stage near it.
   ────────────────────────────────────────────────────────────────────────── */
const SPAN = 12;
const LANE_GAP = 1.28;
const BAR_H = 0.66;
const BAR_D = 0.92;
const CEIL = 2.15;
const PLATE_Y = -0.16;
const HALF_Z = (STAGES.length * LANE_GAP) / 2 + 0.35;

/** Milliseconds to world X, and to a world length. */
const msToX = (ms: number) => (ms / FIELD - 0.5) * SPAN;
const msToLen = (ms: number) => (ms / FIELD) * SPAN;
const laneZ = (i: number) => (i - (STAGES.length - 1) / 2) * LANE_GAP;

/* The run cycle, in seconds. As with the loss surface the hold is longer than
   the move, so the object is at rest for most of the time anyone spends
   reading the text beside it. */
const FILL = 2.6;
const HOLD = 2.4;
const CLEAR = 0.55;
const RUN = FILL + HOLD + CLEAR;

const TICKS = [0, 200, 400, 600, 800, 1000];

export function createLatencyBudget(
  container: HTMLElement,
  onContextLost?: () => void,
  onSample?: (s: Sample) => void,
): SceneHandle | null {
  let vars = readVars();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearAlpha(0);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();

  const FRUSTUM = 13.6;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(7.4, 6.8, 10.6);
  camera.lookAt(0, 0.1, 0);

  /* The same light rig as the loss surface, so the two objects sit in one
     world: a key, a low fill so the shaded faces do not go flat in the
     negative, and a hemisphere. No specular anywhere. */
  const key = new THREE.DirectionalLight(0xffffff, vars.key);
  key.position.set(-7, 10, 6);
  const fill = new THREE.DirectionalLight(0xffffff, 0.32);
  fill.position.set(8, 4, -6);
  scene.add(key, fill, new THREE.HemisphereLight(0xffffff, 0x000000, 0.5));

  const plot = new THREE.Group();
  scene.add(plot);

  /* ── Materials. One per role, every one disposed on teardown. */
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.85,
  });
  const gridMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.2,
  });
  const cageMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.32,
  });
  const plateMaterial = new THREE.MeshLambertMaterial({ color: vars.face3 });
  const markMaterial = new THREE.LineBasicMaterial({ color: vars.mark });
  const wallFaceMaterial = new THREE.MeshBasicMaterial({
    color: vars.mark,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const wallEdgeMaterial = new THREE.LineBasicMaterial({
    color: vars.mark,
    transparent: true,
    opacity: 0.55,
  });

  /* ── The plate. The ground the run stands on and the surface the axis is
     ticked onto — the flat drawing of the same figure kept under the solid
     one, exactly as the loss surface keeps its contours on the floor. */
  const plateGeo = new THREE.BoxGeometry(SPAN + 0.5, 0.09, HALF_Z * 2);
  const plate = new THREE.Mesh(plateGeo, plateMaterial);
  plate.position.set(0, PLATE_Y, 0);
  plot.add(plate);
  const plateEdges = new THREE.LineSegments(new THREE.EdgesGeometry(plateGeo), edgeMaterial);
  plateEdges.position.copy(plate.position);
  plot.add(plateEdges);

  /* ── The axis. Ticks every 200 ms drawn across the plate, and continued as
     faint verticals up the back wall, so a bar's end can be read against the
     scale without following it back down to the floor. */
  {
    const across: number[] = [];
    const rise: number[] = [];
    for (const ms of TICKS) {
      const x = msToX(ms);
      across.push(x, PLATE_Y + 0.05, -HALF_Z, x, PLATE_Y + 0.05, HALF_Z);
      rise.push(x, PLATE_Y, -HALF_Z, x, CEIL, -HALF_Z);
    }
    const ga = new THREE.BufferGeometry();
    ga.setAttribute("position", new THREE.Float32BufferAttribute(across, 3));
    plot.add(new THREE.LineSegments(ga, gridMaterial));
    const gr = new THREE.BufferGeometry();
    gr.setAttribute("position", new THREE.Float32BufferAttribute(rise, 3));
    plot.add(new THREE.LineSegments(gr, gridMaterial));
  }

  /* ── The cage. The same device as the loss surface: a drawn box that gives
     the axonometric view its depth cues without adding a second solid. */
  {
    const box = new THREE.BoxGeometry(SPAN + 0.5, CEIL - PLATE_Y, HALF_Z * 2);
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(box), cageMaterial);
    cage.position.set(0, (CEIL + PLATE_Y) / 2, 0);
    plot.add(cage);
    box.dispose();
  }

  /* ── The ceiling. A wall standing across the field at the budget rather than
     a line on the floor: the constraint is something the run can hit, so it is
     drawn as a thing with a face. It and the sweep are the only elements in
     the accent, because the budget and the elapsed time are the two numbers
     the whole object is about. */
  {
    const quad = new THREE.PlaneGeometry(HALF_Z * 2, CEIL - PLATE_Y);
    const wall = new THREE.Mesh(quad, wallFaceMaterial);
    wall.rotation.y = Math.PI / 2;
    wall.position.set(msToX(BUDGET), (CEIL + PLATE_Y) / 2, 0);
    plot.add(wall);
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(quad), wallEdgeMaterial);
    outline.rotation.copy(wall.rotation);
    outline.position.copy(wall.position);
    plot.add(outline);
  }

  /* ── The stage blocks ──────────────────────────────────────────────────────
     One unit box per stage, translated so its origin is the left-bottom-centre
     and then scaled along X. Scaling rather than rebuilding geometry is what
     lets the run fill every frame without touching a buffer, and holding the
     mesh and its outline in one group means the drawn edges scale with the
     solid instead of drifting off it. */
  const unit = new THREE.BoxGeometry(1, 1, 1);
  unit.translate(0.5, 0.5, 0);
  const unitEdges = new THREE.EdgesGeometry(unit);

  const scratch = new THREE.Color();
  const cLow = new THREE.Color();
  const cMid = new THREE.Color();
  const cHigh = new THREE.Color();

  /** The ramp runs saturated-to-pale across the pipeline, so the stages read
      as one sequence rather than four unrelated blocks. */
  const rampFor = (i: number) =>
    rampAt(scratch, cLow, cMid, cHigh, vars, 1 - i / (STAGES.length - 1));

  const barMaterials = STAGES.map((_, i) => new THREE.MeshLambertMaterial({ color: rampFor(i).getHex() }));

  const bars = STAGES.map((_, i) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(unit, barMaterials[i]));
    g.add(new THREE.LineSegments(unitEdges, edgeMaterial));
    g.position.set(msToX(0), 0, laneZ(i));
    g.scale.set(0.0001, BAR_H, BAR_D);
    plot.add(g);
    return g;
  });

  /* ── The sweep. A vertical line at the elapsed time crossing every lane —
     the read head, and the thing that turns four static boxes into a run.
     Built at x = 0 so posing it is a single position write. */
  const sweepGeo = new THREE.BufferGeometry();
  sweepGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [0, PLATE_Y, -HALF_Z, 0, CEIL, -HALF_Z, 0, PLATE_Y, -HALF_Z, 0, PLATE_Y, HALF_Z],
      3,
    ),
  );
  const sweep = new THREE.LineSegments(sweepGeo, markMaterial);
  plot.add(sweep);

  /* ── State. One run is loaded at a time and kept until the cycle turns. */
  let cycle = -1;
  let durs: number[] = [];
  let offs: number[] = [];
  let sum = 0;

  const loadCycle = (c: number) => {
    if (c === cycle) return;
    cycle = c;
    durs = runDurations(c);
    offs = offsets(durs);
    sum = total(durs);
  };

  let lastReport = -1;

  /** Writes the run at `ms` elapsed, then draws. */
  const pose = (c: number, ms: number, turn: number) => {
    loadCycle(c);
    const at = Math.min(ms, sum);
    for (let i = 0; i < bars.length; i += 1) {
      const shown = Math.min(durs[i], Math.max(0, ms - offs[i]));
      bars[i].position.x = msToX(offs[i]);
      /* Never exactly zero: a zero scale collapses the outline into a visible
         speck sitting on the axis rather than hiding it. */
      bars[i].scale.x = Math.max(0.0001, msToLen(shown));
      bars[i].visible = shown > 0.5;
    }
    sweep.position.x = msToX(at);
    sweep.visible = at > 0.5;
    plot.rotation.y = turn * 0.05;

    const whole = Math.round(at);
    if (whole !== lastReport) {
      lastReport = whole;
      onSample?.({
        ms: whole,
        stage: stageAt(durs, Math.max(0, at - 1)),
        total: sum,
        hot: c % 4 === 3,
      });
    }
    renderer.render(scene, camera);
  };

  /* ── Sizing. The same derivation as the loss surface: the frustum follows
     the host's aspect so the figure keeps its proportions at every width. */
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    const aspect = w / h;
    const frustum = aspect < 1 ? FRUSTUM / aspect : FRUSTUM;
    camera.left = (-frustum * aspect) / 2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* ── The loop. Parked whenever the object is off-screen or the tab is
     hidden, and never started under reduced motion — where the object is posed
     once as a finished run, which is still the whole drawing. */
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let still = motionQuery.matches;
  let visible = document.visibilityState === "visible";
  let inView = false;
  let t0 = 0;
  let turn = 0;

  const frame = (t: number) => {
    if (!t0) t0 = t;
    const elapsed = (t - t0) / 1000;
    const c = Math.floor(elapsed / RUN);
    const p = elapsed - c * RUN;
    loadCycle(c);
    let ms: number;
    if (p < FILL) ms = (p / FILL) * sum;
    else if (p < FILL + HOLD) ms = sum;
    else ms = sum * (1 - (p - FILL - HOLD) / CLEAR);
    pose(c, Math.max(0, ms), turn);
  };

  const run = () => {
    const on = inView && visible && !still;
    renderer.setAnimationLoop(on ? frame : null);
    if (!on) renderer.render(scene, camera);
  };

  const onMotionChange = () => {
    still = motionQuery.matches;
    if (still) pose(0, total(runDurations(0)), 0);
    run();
  };
  motionQuery.addEventListener("change", onMotionChange);

  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    run();
  });
  io.observe(container);

  const onVisibility = () => {
    visible = document.visibilityState === "visible";
    run();
  };
  document.addEventListener("visibilitychange", onVisibility);

  /* A very small parallax, on a fine pointer only — enough to confirm the
     thing is solid, not enough to become an effect. */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const onPointerMove = (e: PointerEvent) => {
    turn = (e.clientX / window.innerWidth - 0.5) * 2;
  };
  if (finePointer.matches && !still) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  /* ── Theme. Re-read from the tokens whenever the class flips, so the figure
     cannot drift from the document around it. */
  const applyTheme = () => {
    vars = readVars();
    edgeMaterial.color.set(vars.edge);
    gridMaterial.color.set(vars.edge);
    cageMaterial.color.set(vars.edge);
    plateMaterial.color.set(vars.face3);
    markMaterial.color.set(vars.mark);
    wallFaceMaterial.color.set(vars.mark);
    wallEdgeMaterial.color.set(vars.mark);
    barMaterials.forEach((m, i) => m.color.copy(rampFor(i)));
    key.intensity = vars.key;
    /* Re-draw immediately, including when the loop is parked, or the switch
       leaves a stale frame in the old palette. */
    renderer.render(scene, camera);
  };
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const onLost = (e: Event) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    onContextLost?.();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);

  pose(0, still ? total(runDurations(0)) : 0, 0);

  return {
    destroy() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      motionQuery.removeEventListener("change", onMotionChange);

      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
      unit.dispose();
      unitEdges.dispose();
      sweepGeo.dispose();
      edgeMaterial.dispose();
      gridMaterial.dispose();
      cageMaterial.dispose();
      plateMaterial.dispose();
      markMaterial.dispose();
      wallFaceMaterial.dispose();
      wallEdgeMaterial.dispose();
      barMaterials.forEach((m) => m.dispose());
      renderer.domElement.remove();
      renderer.dispose();
    },
  };
}
