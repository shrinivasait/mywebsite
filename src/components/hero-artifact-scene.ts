/**
 * The loss surface.
 *
 * A solid three-dimensional loss landscape standing on a plate inside a drawn
 * cage: contour rings traced onto the surface itself, the same rings projected
 * flat onto the plate below it, a sparse graticule draped over the form, and
 * **four optimisers descending at once** from starts spread around the field.
 * Each runner lays down a faint history line with a full-strength head trail
 * and a faceted marker at its tip. Three reach the deep basin by three
 * different routes; the fourth settles in a shallow corner pocket at a loss of
 * -0.24 against the global -1.35, because descent does not always find the best
 * answer. Then the traces retract and the next cycle sets off from a different
 * ring of starts.
 *
 * Running four at once rather than one at a time is the enhancement that
 * matters: it turns a demonstration into a comparison, which is what this
 * actually looks like in practice — you run a sweep, not a job — and it makes
 * the trapped runner legible, because it fails *beside* three that succeed
 * instead of in a cycle of its own that nobody connects to the others.
 *
 * This is the third object to occupy this slot, and the reasoning for each
 * replacement is worth keeping because it is the same lesson twice.
 *
 *   1. A transmissive glass sphere with a lit core. Real optics, well built,
 *      and the single most recognisable ornament in generated interfaces.
 *   2. An exploded chip package. Correctly drawn, and it read as semiconductor
 *      hardware rather than as AI systems — the datasheet's own default object,
 *      reached for because the world offered it, not because the product did.
 *   3. A 16x16 attention surface as 256 extruded columns. Honest and on-world,
 *      but a field of thin bars has no mass: from an axonometric view it read
 *      as fuzz, and structurally it was a bar chart rather than a form.
 *
 * A loss landscape answers all three. It is the most recognisable image in
 * machine learning, so it needs no caption to say what it is. It is a genuinely
 * solid body rather than a scatter of small parts. And it is a *surface plot
 * with traced paths*, which is native to the document this page is: a
 * datasheet's typical performance characteristics are surfaces exactly like
 * this one.
 *
 * The surface is static; the descent is the animation. That is deliberate — a
 * landscape that also morphs gives the eye nothing to follow, and the whole
 * point is watching the paths find the bottom.
 *
 * Every value it is coloured and lit by comes from the CSS custom properties in
 * globals.css, read off the document and re-read when the theme class flips.
 * There is no second palette living in here.
 *
 * Loaded by a dynamic import from HeroArtifact, so three.js never lands in the
 * initial bundle and is only fetched once the plot is in view.
 */

import * as THREE from "three";
import {
  CONTOUR_LEVELS,
  HALF,
  HEAD_POINTS,
  LOSS_MAX,
  LOSS_MIN,
  PATH_POINTS,
  RUNNERS,
  TOTAL_STEPS,
  contourSegments,
  cycleStarts,
  descentPath,
  lossAt,
  lossNorm,
} from "./loss-surface";

type Vars = {
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

/** What the scene reports to its host for the live readout. */
export type Sample = { loss: number; step: number; steps: number; trapped: boolean };

export type SceneHandle = { destroy: () => void };

const readVars = (): Vars => {
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

/* ── Geometry constants ──────────────────────────────────────────────────────
   SEG is the surface's tessellation; GRID_EVERY is how many of those divisions
   a draped graticule line skips. The drape is deliberately sparser than it was
   before the contours arrived — a regular grid and a set of iso-lines on the
   same surface at the same weight is two overlapping patterns, so the grid
   steps back and lets the contours carry the topography.
   ─────────────────────────────────────────────────────────────────────────── */
const SEG = 56;
const GRID_EVERY = 8;
const CONTOUR_RES = 60;
const Y_SCALE = 1.5;
const CAGE_FLOOR = LOSS_MIN * Y_SCALE - 0.9;
const CAGE_CEIL = LOSS_MAX * Y_SCALE + 0.35;
/** Lifts a line clear of the surface it describes, so it is never buried. */
const SURFACE_LIFT = 0.045;
const TRACE_LIFT = 0.08;
const FLOOR_LIFT = 0.12;

const height = (x: number, z: number) => lossAt(x, z) * Y_SCALE;

/* The run cycle, in seconds. The holds are longer than the moves, so the object
   is at rest for most of the time anyone spends reading the text beside it. */
const DESCEND = 3.6;
const SETTLE = 2.2;
const RETRACT = 0.7;
const RUN = DESCEND + SETTLE + RETRACT;
/** Each runner sets off a little after the one before, so they never lockstep. */
const RUNNER_STAGGER = 0.19;
/** The stagger expressed in `shown` units, and the span left for a full run. */
const STAGGER_STEP = RUNNER_STAGGER / DESCEND;
const STAGGER_SPAN = 1 - (RUNNERS - 1) * STAGGER_STEP;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function createHeroArtifact(
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
  renderer.setClearAlpha(0); // the reticule shows through, so the sheet is the ground
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();

  /* ── Camera. Orthographic, because a surface plot is read, not looked at:
     parallel edges stay parallel, so two points at the same height are at the
     same height on screen wherever they sit in the field. Perspective would
     make the plot lie. */
  const FRUSTUM = 14.2;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(9.6, 7.2, 11.4);
  camera.lookAt(0, -0.55, 0);

  /* ── Light. One key, one low fill and a hemisphere, no environment map. A
     surface this large needs the fill or its shaded side goes flat black in the
     negative; no specular highlight anywhere, because a highlight would be the
     first thing that made this look rendered rather than plotted. */
  const key = new THREE.DirectionalLight(0xffffff, vars.key);
  key.position.set(-7, 10, 6);
  const fill = new THREE.DirectionalLight(0xffffff, 0.32);
  fill.position.set(8, 4, -6);
  const ambient = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
  scene.add(key, fill, ambient);

  const plot = new THREE.Group();
  scene.add(plot);

  /* ── The surface ──────────────────────────────────────────────────────────
     A plane displaced on the CPU, once. The surface never changes, so this is
     built and then left alone; only the traces move.

     `polygonOffset` pushes the filled surface a hair away from the camera so
     the contours and graticule lying on it do not z-fight. Without it they
     stipple and the whole object looks broken. */
  const surfaceMaterial = new THREE.MeshLambertMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  const surfaceGeo = new THREE.PlaneGeometry(HALF * 2, HALF * 2, SEG, SEG);
  surfaceGeo.rotateX(-Math.PI / 2); // into the XZ plane, Y up
  {
    const pos = surfaceGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      pos.setY(i, height(pos.getX(i), pos.getZ(i)));
    }
    surfaceGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(pos.count * 3).fill(1), 3),
    );
    surfaceGeo.computeVertexNormals();
  }
  plot.add(new THREE.Mesh(surfaceGeo, surfaceMaterial));

  /* ── Contour rings, on the surface and projected onto the plate.

     This is what turns a shaded blob into a plot. The rings are real iso-lines
     of the same function the surface is displaced by, so they tighten where the
     field is steep and open out where it is flat, and their nesting reads as
     depth without any colour doing the work. The projection on the plate below
     is the standard convention for exactly the same reason: it gives the
     surface a floor to be measured against. */
  const contourMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.42,
  });
  const floorContourMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.16,
  });
  {
    const onSurface: number[] = [];
    const onFloor: number[] = [];
    for (const level of CONTOUR_LEVELS) {
      const segs = contourSegments(level, CONTOUR_RES);
      for (let i = 0; i < segs.length; i += 2) {
        const x = segs[i];
        const z = segs[i + 1];
        onSurface.push(x, height(x, z) + SURFACE_LIFT, z);
        onFloor.push(x, CAGE_FLOOR + FLOOR_LIFT, z);
      }
    }
    const gs = new THREE.BufferGeometry();
    gs.setAttribute("position", new THREE.Float32BufferAttribute(onSurface, 3));
    plot.add(new THREE.LineSegments(gs, contourMaterial));

    const gf = new THREE.BufferGeometry();
    gf.setAttribute("position", new THREE.Float32BufferAttribute(onFloor, 3));
    plot.add(new THREE.LineSegments(gf, floorContourMaterial));
  }

  /* ── The draped graticule. Sparse, and quieter than the contours: it exists
     to say "ruled plot", not to describe the topography. */
  const gridMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.18,
  });
  {
    const pts: number[] = [];
    const at = (n: number) => -HALF + (n / SEG) * HALF * 2;
    for (let n = 0; n <= SEG; n += GRID_EVERY) {
      for (let m = 0; m < SEG; m += 1) {
        const x = at(n);
        const z0 = at(m);
        const z1 = at(m + 1);
        pts.push(x, height(x, z0) + SURFACE_LIFT, z0, x, height(x, z1) + SURFACE_LIFT, z1);
        const z = at(n);
        const x0 = at(m);
        const x1 = at(m + 1);
        pts.push(x0, height(x0, z) + SURFACE_LIFT, z, x1, height(x1, z) + SURFACE_LIFT, z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    plot.add(new THREE.LineSegments(geo, gridMaterial));
  }

  /* ── The plate and the cage. A 3D chart is bounded: the plate is the datum
     the surface stands over, the four verticals and the top rectangle are the
     plot volume, and the ticks up one post are its scale. Without them the
     surface is a shape floating in nothing rather than a measured field. */
  const baseMaterial = new THREE.MeshLambertMaterial({ color: vars.face3 });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: vars.edge });
  const cageMaterial = new THREE.LineBasicMaterial({
    color: vars.edge,
    transparent: true,
    opacity: 0.4,
  });
  {
    const geo = new THREE.BoxGeometry(HALF * 2 + 1.0, 0.22, HALF * 2 + 1.0);
    const plate = new THREE.Mesh(geo, baseMaterial);
    plate.position.y = CAGE_FLOOR;
    plot.add(plate);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), edgeMaterial);
    edges.position.y = CAGE_FLOOR;
    plot.add(edges);

    const c = HALF + 0.5;
    const pts: number[] = [];
    for (const [cx, cz] of [
      [-c, -c],
      [c, -c],
      [c, c],
      [-c, c],
    ]) {
      pts.push(cx, CAGE_FLOOR + 0.11, cz, cx, CAGE_CEIL, cz);
    }
    pts.push(-c, CAGE_CEIL, -c, c, CAGE_CEIL, -c, c, CAGE_CEIL, -c, c, CAGE_CEIL, c);
    pts.push(c, CAGE_CEIL, c, -c, CAGE_CEIL, c, -c, CAGE_CEIL, c, -c, CAGE_CEIL, -c);

    /* A tick on the back post at every contour level, so the rings on the
       surface and the scale on the axis are the same set of numbers. */
    for (const level of CONTOUR_LEVELS) {
      const y = level * Y_SCALE;
      pts.push(-c, y, -c, -c - 0.34, y, -c);
    }
    const cageGeo = new THREE.BufferGeometry();
    cageGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    plot.add(new THREE.LineSegments(cageGeo, cageMaterial));
  }

  /* ── The runners ──────────────────────────────────────────────────────────
     One history line, one full-strength head trail and one marker each. Two
     lines rather than a per-vertex colour ramp because `LineBasicMaterial`
     carries one opacity for the whole line: the split is what produces the
     comet without a custom shader.

     Every buffer is allocated once at full length and driven by `drawRange`,
     and every one opts out of frustum culling — their bounding spheres are
     computed once from buffers that are still all zeros and never recomputed,
     which is cheaper and safer than recomputing bounds per frame. */
  const traceMaterial = new THREE.LineBasicMaterial({
    color: vars.mark,
    transparent: true,
    opacity: 0.4,
  });
  const headMaterial = new THREE.LineBasicMaterial({ color: vars.mark });
  const markerMaterial = new THREE.MeshBasicMaterial({ color: vars.mark });
  const markerGeo = new THREE.OctahedronGeometry(0.17);

  type Runner = {
    hist: Float32Array;
    histGeo: THREE.BufferGeometry;
    head: Float32Array;
    headGeo: THREE.BufferGeometry;
    marker: THREE.Mesh;
    path: [number, number][];
  };

  const runners: Runner[] = [];
  for (let r = 0; r < RUNNERS; r += 1) {
    const hist = new Float32Array(PATH_POINTS * 3);
    const histGeo = new THREE.BufferGeometry();
    histGeo.setAttribute("position", new THREE.BufferAttribute(hist, 3));
    histGeo.setDrawRange(0, 0);
    const histLine = new THREE.Line(histGeo, traceMaterial);
    histLine.frustumCulled = false;
    plot.add(histLine);

    const head = new Float32Array(HEAD_POINTS * 3);
    const headGeo = new THREE.BufferGeometry();
    headGeo.setAttribute("position", new THREE.BufferAttribute(head, 3));
    headGeo.setDrawRange(0, 0);
    const headLine = new THREE.Line(headGeo, headMaterial);
    headLine.frustumCulled = false;
    plot.add(headLine);

    const marker = new THREE.Mesh(markerGeo, markerMaterial);
    marker.visible = false;
    plot.add(marker);

    runners.push({ hist, histGeo, head, headGeo, marker, path: [] });
  }

  /** Paths are precomputed per cycle, then reused for every frame of it. */
  let loadedCycle = -1;
  const loadCycle = (cycle: number) => {
    if (cycle === loadedCycle) return;
    loadedCycle = cycle;
    const starts = cycleStarts(cycle);
    for (let r = 0; r < RUNNERS; r += 1) runners[r].path = descentPath(starts[r]);
  };

  const colLow = new THREE.Color();
  const colMid = new THREE.Color();
  const colHigh = new THREE.Color();
  const scratch = new THREE.Color();

  /** Shades the surface by height along a three-stop ramp: saturated in the
      deep basin, letting go of the tint as the ground rises. A two-stop ramp
      between two near-neutrals — which is what this was — is not a gradient,
      it is a flat face with a slight dirty edge, and it read as grey.
      Interpolating in linear-sRGB (three.js's working space) keeps the middle
      of the ramp from going muddy the way a raw hex lerp does.

      A shading ramp on a data surface is the data, not decoration: `t` is the
      normalised loss, so colour and height carry the same number. */
  const applyPalette = () => {
    colLow.set(vars.rampLow);
    colMid.set(vars.rampMid);
    colHigh.set(vars.rampHigh);
    const pos = surfaceGeo.attributes.position as THREE.BufferAttribute;
    const col = surfaceGeo.attributes.color as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      const t = lossNorm(pos.getX(i), pos.getZ(i));
      /* The midpoint sits at 0.45 rather than 0.5: most of the field is
         upland, so the low half of the ramp gets the smaller share of the
         range and the basin keeps its colour instead of washing out. */
      if (t < 0.45) scratch.copy(colLow).lerp(colMid, t / 0.45);
      else scratch.copy(colMid).lerp(colHigh, (t - 0.45) / 0.55);
      col.setXYZ(i, scratch.r, scratch.g, scratch.b);
    }
    col.needsUpdate = true;
  };
  applyPalette();

  /* ── Sizing. The frustum is derived from the host's aspect so the plot keeps
     its proportions at every width instead of stretching. */
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    const aspect = w / h;
    /* A cell taller than it is wide has to fit the field across its width, or
       the plot runs out of frame sideways. */
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

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let still = motionQuery.matches;

  let lastReport = -1;

  /**
   * Writes every runner at the given cycle progress, then draws.
   *
   * `shown` is how much of each path is laid down, 0 to 1, before the runner's
   * own stagger is applied. At 1 the whole path is down and each marker sits at
   * whatever minimum its runner found.
   */
  const pose = (cycle: number, shown: number, turnY: number, turnX: number) => {
    loadCycle(cycle);

    let best = Infinity;
    let bestStep = 0;
    let bestTrapped = false;

    for (let r = 0; r < RUNNERS; r += 1) {
      const run = runners[r];
      const path = run.path;
      /* Staggered, then re-normalised over the remaining span, so the last
         runner to set off still reaches the end of its path by the time
         `shown` hits 1 rather than being cut off mid-descent. */
      const local = Math.min(1, Math.max(0, (shown - r * STAGGER_STEP) / STAGGER_SPAN));
      const count = Math.max(2, Math.round(local * (path.length - 1)) + 1);

      for (let n = 0; n < count; n += 1) {
        const [x, z] = path[n];
        hist3(run.hist, n, x, height(x, z) + TRACE_LIFT, z);
      }
      run.histGeo.attributes.position.needsUpdate = true;
      run.histGeo.setDrawRange(0, count);

      const headStart = Math.max(0, count - HEAD_POINTS);
      const headCount = count - headStart;
      for (let n = 0; n < headCount; n += 1) {
        const [x, z] = path[headStart + n];
        hist3(run.head, n, x, height(x, z) + TRACE_LIFT, z);
      }
      run.headGeo.attributes.position.needsUpdate = true;
      run.headGeo.setDrawRange(0, headCount);

      const [hx, hz] = path[count - 1];
      const hy = height(hx, hz) + TRACE_LIFT;
      run.marker.position.set(hx, hy + 0.13, hz);
      run.marker.visible = true;

      const l = lossAt(hx, hz);
      if (l < best) {
        best = l;
        bestStep = count - 1;
        bestTrapped = Math.hypot(hx + 3.0, hz + 2.9) < 1.1;
      }
    }

    plot.rotation.y = turnY;
    plot.rotation.x = turnX;
    renderer.render(scene, camera);

    /* The readout is a measurement, not a caption — the number a visitor
       watches fall as the traces descend. Reported about ten times a second,
       not per frame: it lands in the DOM, and sixty writes a second would be
       sixty layout reads for a value that changes in the third decimal. */
    if (onSample && Math.abs(best - lastReport) > 0.0005) {
      lastReport = best;
      onSample({ loss: best, step: bestStep, steps: TOTAL_STEPS, trapped: bestTrapped });
    }
  };

  const onMotionChange = () => {
    still = motionQuery.matches;
    // A completed cycle, held: the landscape with four finished descents on it.
    if (still) pose(0, 1, 0, 0);
  };
  motionQuery.addEventListener("change", onMotionChange);

  /* The plot leans a little toward an approaching pointer — a chart tilted on
     a desk, at most about three degrees. Written to a target and eased toward
     inside the frame, so it settles instead of tracking rigidly, and it is one
     listener rather than one per element. */
  let leanX = 0;
  let leanY = 0;
  let targetX = 0;
  let targetY = 0;
  const onPointerMove = (ev: PointerEvent) => {
    if (still || !finePointer.matches) return;
    const r = container.getBoundingClientRect();
    if (!r.width || !r.height) return;
    targetY = ((ev.clientX - (r.left + r.width / 2)) / r.width) * 0.11;
    targetX = ((ev.clientY - (r.top + r.height / 2)) / r.height) * 0.055;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  let onScreen = true;
  let visible = document.visibilityState === "visible";
  const clock = new THREE.Clock();
  let t = 0;

  /* Time is an accumulated, clamped delta rather than elapsed time: the loop
     is paused off-screen and on a hidden tab, and elapsed time otherwise keeps
     running and would resume the cycle from the wrong place. */
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 1 / 30);
    if (!onScreen || !visible || still) return;

    t += dt;
    const k = 1 - Math.exp(-dt * 5); // exponential approach, frame-rate independent
    leanY += (targetY - leanY) * k;
    leanX += (targetX - leanX) * k;

    const cycle = Math.floor(t / RUN);
    const local = t % RUN;
    const shown =
      local < DESCEND
        ? easeOutCubic(local / DESCEND)
        : local < DESCEND + SETTLE
          ? 1
          : /* The traces retract to their starts before the next cycle sets
               off, so a new run never cuts in over a finished one. */
            1 - easeOutCubic((local - DESCEND - SETTLE) / RETRACT);

    pose(
      cycle,
      shown,
      Math.sin(t * 0.19) * 0.12 + leanY, // ±6.9° turn, plus the lean
      Math.sin(t * 0.13) * 0.028 + leanX, // ±1.6° nod
    );
  });

  const io = new IntersectionObserver(
    ([e]) => {
      onScreen = e.isIntersecting;
    },
    { rootMargin: "120px" },
  );
  io.observe(container);

  const onVisibility = () => {
    visible = document.visibilityState === "visible";
  };
  document.addEventListener("visibilitychange", onVisibility);

  /* ── Theme. Re-read from the tokens whenever the class flips, so the plot
     cannot drift from the document around it. */
  const applyTheme = () => {
    vars = readVars();
    applyPalette();
    baseMaterial.color.set(vars.face3);
    edgeMaterial.color.set(vars.edge);
    gridMaterial.color.set(vars.edge);
    cageMaterial.color.set(vars.edge);
    contourMaterial.color.set(vars.edge);
    floorContourMaterial.color.set(vars.edge);
    traceMaterial.color.set(vars.mark);
    headMaterial.color.set(vars.mark);
    markerMaterial.color.set(vars.mark);
    key.intensity = vars.key;
    /* Re-draw immediately, including when the loop is parked (off-screen,
       hidden tab, reduced motion), or the switch leaves a stale frame in the
       old palette. */
    renderer.render(scene, camera);
  };
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  /* ── Context loss. A lost context cannot be recovered in place: three.js
     does not rebuild GPU resources for a restored one, so the component is
     asked to tear this down and build a fresh scene. */
  const onLost = (e: Event) => {
    e.preventDefault(); // without this the context is never restorable at all
    renderer.setAnimationLoop(null);
    onContextLost?.();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);

  /* The first frame. Under reduced motion it is a finished cycle, held still —
     a loss surface with four descents on it is still the whole drawing.
     Otherwise the first cycle starts from nothing and lays itself down. */
  pose(0, still ? 1 : 0, 0, 0);

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
      surfaceMaterial.dispose();
      baseMaterial.dispose();
      edgeMaterial.dispose();
      gridMaterial.dispose();
      cageMaterial.dispose();
      contourMaterial.dispose();
      floorContourMaterial.dispose();
      traceMaterial.dispose();
      headMaterial.dispose();
      markerMaterial.dispose();
      markerGeo.dispose();
      renderer.domElement.remove();
      renderer.dispose();
    },
  };
}

/** Writes one xyz triple into a flat buffer. Hoisted so `pose` allocates nothing. */
function hist3(buf: Float32Array, n: number, x: number, y: number, z: number) {
  buf[n * 3] = x;
  buf[n * 3 + 1] = y;
  buf[n * 3 + 2] = z;
}
