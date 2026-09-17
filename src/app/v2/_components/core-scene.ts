/**
 * The core.
 *
 * A machined object on a black stage: a heavy outer ring, two counter-rotating
 * inner rings, and a faceted core that pulses once per spoken turn. Everything
 * is anodised metal — `MeshPhysicalMaterial` with thin-film iridescence over a
 * polished surface — lit by a studio environment generated in code rather than
 * shipped as an HDR, so the object costs three small meshes and no assets.
 *
 * It is the page's one visual, and it is deliberately not a diagram: the four
 * worlds this route tried before were drawings, and drawings read as cheap. A
 * solid, correctly lit, reflective object reads as expensive for the same
 * reason a product photograph does — the light is doing work.
 *
 * It is driven by scroll. `update(progress, beat)` takes read position 0–1
 * across the whole document plus the latency beat, so the object's rotation,
 * separation and pulse are a function of where the reader is rather than of
 * wall-clock time. The one exception is the idle drift at the top of the page,
 * which keeps the first viewport alive before anyone has scrolled.
 *
 * Loaded by a dynamic import from `Stage.tsx`, so three.js never lands in the
 * initial bundle.
 */

import * as THREE from "three";

export type SceneHandle = {
  /** Called every frame with scroll progress 0–1 and the turn phase 0–1. */
  update: (progress: number, beat: number, dt: number) => void;
  resize: () => void;
  dispose: () => void;
};

/**
 * The studio, as a texture.
 *
 * Three soft strips and one warm pool on a near-black ground: the reflections
 * a real product shot gets from a softbox array. Written to a canvas, wrapped
 * as an equirectangular map and pre-filtered, which is what gives the metal
 * something to reflect other than flat colour.
 */
function studioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d context unavailable");

  g.fillStyle = "#050507";
  g.fillRect(0, 0, c.width, c.height);

  const strip = (x: number, y: number, w: number, h: number, a: number, hue: string) => {
    const grad = g.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, `rgba(0,0,0,0)`);
    grad.addColorStop(0.5, hue.replace("ALPHA", `${a}`));
    grad.addColorStop(1, `rgba(0,0,0,0)`);
    g.fillStyle = grad;
    g.fillRect(x, y, w, h);
  };

  // Key light, high and left. Fill, low and right. A cold rim behind.
  strip(40, 20, 150, 120, 0.95, "rgba(255,255,255,ALPHA)");
  strip(300, 120, 180, 110, 0.5, "rgba(190,215,255,ALPHA)");
  strip(210, 10, 70, 240, 0.32, "rgba(120,160,255,ALPHA)");

  const warm = g.createRadialGradient(430, 60, 0, 430, 60, 120);
  warm.addColorStop(0, "rgba(255,196,150,0.55)");
  warm.addColorStop(1, "rgba(255,196,150,0)");
  g.fillStyle = warm;
  g.fillRect(310, 0, 202, 180);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

export function createScene(canvas: HTMLCanvasElement, still: boolean): SceneHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  const env = studioEnvironment(renderer);
  scene.environment = env;

  /* ── The object ────────────────────────────────────────────────────────── */

  const group = new THREE.Group();
  scene.add(group);

  const anodised = (color: number, roughness: number, iridescence: number) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 1,
      roughness,
      envMapIntensity: 1.4,
      iridescence,
      iridescenceIOR: 1.55,
      iridescenceThicknessRange: [120, 560],
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

  /* Three rings on one axis at even intervals — an armillary, not a planet
     with hoops around it. Each ring is built lying in the XZ plane and then
     turned about Y by a third of a half-turn, so the set is symmetric from any
     angle; the earlier arrangement used arbitrary tilts on three axes and read
     as an accident rather than as a made object. Each ring rides its own
     pivot, which is what lets them counter-rotate without shearing the set. */
  const ring = (radius: number, tube: number, color: number, roughness: number) => {
    const pivot = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 28, 240),
      anodised(color, roughness, 1),
    );
    mesh.rotation.x = Math.PI / 2;
    pivot.add(mesh);
    group.add(pivot);
    return { pivot, mesh };
  };

  const outer = ring(2.5, 0.085, 0x2c313a, 0.14);
  const midA = ring(2.08, 0.055, 0x3c4353, 0.12);
  const midB = ring(1.72, 0.04, 0x565e6e, 0.1);

  /* Each ring gets a real tilt, about X or Z. A torus is rotationally
     symmetric about its own axis, so turning one about that axis is invisible
     — tilting the plane is the only motion that reads, and three planes that
     cross is what makes this an armillary rather than a planet with hoops. */
  outer.pivot.rotation.z = 0.2;
  midA.pivot.rotation.x = Math.PI / 2.6;
  midB.pivot.rotation.z = Math.PI / 2.9;
  midB.pivot.rotation.x = 0.42;

  // The core: a polished body with thin-film colour, not a lit blue solid.
  // Emissive is kept low on purpose — the light in it comes from what it
  // reflects, which is the difference between a jewel and a bulb.
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b1426,
    metalness: 1,
    roughness: 0.055,
    envMapIntensity: 2.6,
    iridescence: 1,
    iridescenceIOR: 2.2,
    iridescenceThicknessRange: [260, 940],
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    emissive: 0x1b3a9a,
    emissiveIntensity: 0.04,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 4), coreMat);
  group.add(core);

  // The halo the core throws. A radial falloff on an additive billboard, which
  // is a cheaper and steadier bloom than a post-processing pass, and the only
  // glow anywhere in the scene.
  const haloCanvas = document.createElement("canvas");
  haloCanvas.width = 128;
  haloCanvas.height = 128;
  const hg = haloCanvas.getContext("2d");
  if (hg) {
    const grad = hg.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(150,185,255,0.85)");
    grad.addColorStop(0.35, "rgba(90,130,255,0.28)");
    grad.addColorStop(1, "rgba(60,90,220,0)");
    hg.fillStyle = grad;
    hg.fillRect(0, 0, 128, 128);
  }
  const haloTex = new THREE.CanvasTexture(haloCanvas);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: haloTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.75,
    }),
  );
  halo.scale.setScalar(5.2);
  group.add(halo);

  // A fine shell of points: dust in the light, and the thing that keeps the
  // black from going flat where the object is not.
  const COUNT = 1400;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i += 1) {
    const r = 3.2 + Math.random() * 5.5;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.55;
    pos[i * 3 + 2] = r * Math.cos(p);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.016,
    color: 0x9fb4d8,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ── Lighting. The environment does most of it; these two shape it. ────── */

  const key = new THREE.DirectionalLight(0xdfe8ff, 2.4);
  key.position.set(-4, 5, 6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4f7dff, 1.6);
  rim.position.set(5, -2, -6);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0x0b0d12, 1.2));

  /* ── Frame ─────────────────────────────────────────────────────────────── */

  let drift = 0;
  let stageX = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    // The object always sits on the camera's axis. Pushing it sideways in
    // world space is what made the core read as a squashed oval: a sphere off
    // the axis of a perspective frame projects as an ellipse. It is the canvas
    // that is offset instead (see `.cn-stage` in runtime.css), so the framing
    // is composed without ever distorting the object.
    camera.fov = w >= 1100 ? 30 : 34;
    camera.position.z = w >= 1100 ? 10.4 : 12.4;
    stageX = 0;
    camera.updateProjectionMatrix();
  };
  resize();

  const update = (progress: number, beat: number, dt: number) => {
    if (!still) drift += dt;

    // Read position moves the object: it tips away, turns a half revolution and
    // recedes as the page is read, so every section frames it differently.
    const p = Math.min(1, Math.max(0, progress));
    const ease = p * p * (3 - 2 * p);

    group.rotation.y = drift * 0.12 + ease * Math.PI * 1.15;
    group.rotation.x = -0.18 + ease * 0.42;
    group.position.y = ease * 0.55;
    group.position.x = stageX - ease * 1.6;
    group.scale.setScalar(1 - ease * 0.22);

    // The rings precess: each tilted plane swings about the vertical at its
    // own rate, so the set is never a rigid body and never a flat disc.
    outer.pivot.rotation.y = drift * 0.07 + ease * 0.5;
    outer.pivot.rotation.z = 0.2 + Math.sin(drift * 0.18) * 0.05;
    midA.pivot.rotation.y = -drift * 0.13 - ease * 0.9;
    midB.pivot.rotation.y = drift * 0.19 + ease * 1.3;

    // The core carries the turn: one breath per spoken turn, brightest at the
    // reasoning hop, which is where the budget actually goes.
    const pulse = 0.5 - Math.cos(beat * Math.PI * 2) * 0.5;
    coreMat.emissiveIntensity = 0.03 + pulse * 0.2;
    core.scale.setScalar(1 + pulse * 0.035);
    halo.scale.setScalar(4.6 + pulse * 1.2);
    (halo.material as THREE.SpriteMaterial).opacity = (0.34 + pulse * 0.4) * (1 - ease * 0.5);
    core.rotation.y = -drift * 0.22;
    core.rotation.x = drift * 0.13;

    dust.rotation.y = drift * 0.02 - ease * 0.4;
    dust.position.y = -ease * 0.6;
    dust.position.x = stageX * 0.5;

    renderer.render(scene, camera);
  };

  const dispose = () => {
    haloTex.dispose();
    (halo.material as THREE.SpriteMaterial).dispose();
    [outer.mesh, midA.mesh, midB.mesh, core].forEach((m) => {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    dustGeo.dispose();
    dustMat.dispose();
    env.dispose();
    renderer.dispose();
  };

  return { update, resize, dispose };
}
