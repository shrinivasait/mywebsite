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

  // The outer ring: the heaviest part, and the one that reads as machined.
  const outer = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.11, 32, 220), anodised(0x2a2e36, 0.16, 1));
  outer.rotation.x = Math.PI / 2.1;
  group.add(outer);

  // Two inner rings, counter-rotating on different axes.
  const midA = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.055, 24, 180), anodised(0x3a4150, 0.12, 1));
  midA.rotation.set(Math.PI / 2.6, 0.4, 0);
  group.add(midA);

  const midB = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.035, 20, 160), anodised(0x545c6c, 0.1, 1));
  midB.rotation.set(0.7, Math.PI / 3, 0.2);
  group.add(midB);

  // The core: a polished body with thin-film colour, not a lit blue solid.
  // Emissive is kept low on purpose — the light in it comes from what it
  // reflects, which is the difference between a jewel and a bulb.
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x05070d,
    metalness: 1,
    roughness: 0.07,
    envMapIntensity: 2.1,
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
    const wide = w >= 1100;
    // Wide, the object takes the right of the frame and leaves the left to the
    // headline. Narrow, it pulls back and centres, sitting behind the type as
    // a lit ground rather than competing with it.
    camera.position.z = wide ? 9.6 : 12.4;
    stageX = wide ? 2.5 : 0;
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

    outer.rotation.z = drift * 0.05 + ease * 0.8;
    midA.rotation.z = -drift * 0.11 - ease * 1.6;
    midB.rotation.x = 0.7 + drift * 0.16 + ease * 2.2;
    midB.rotation.y = Math.PI / 3 - drift * 0.09;

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
    [outer, midA, midB, core].forEach((m) => {
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
