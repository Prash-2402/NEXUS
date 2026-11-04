import {
  AdditiveBlending,
  NormalBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RepeatWrapping,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  glowFragment,
  glowVertex,
  nebulaFragment,
  nebulaVertex,
  planetFragment,
  planetVertex,
  ringFragment,
  ringVertex,
  cloudFragment,
  skyFragment,
  skyVertex,
  starFragment,
  starVertex,
  streakFragment,
  streakVertex,
} from './shaders';

/**
 * Scroll-driven space journey.
 *
 * The page marks its sections with `data-stage="<number>"`. The engine maps the
 * scroll position onto those numbers (a continuous "stage"), eases towards it,
 * and moves the camera along keyframes:
 *
 *   0 hero      – deep space, the core glows far ahead
 *   1 about     – travel forward through the starfield (warp streaks)
 *   2 worlds    – pass the three planets one by one
 *   3 events    – head towards the core; planets start to converge
 *   4 schedule  – planets fall into orbit around the core
 *   5 register  – the full system, slowly turning
 */

type WorldKey = 'technical' | 'non-technical' | 'cultural';

interface Keyframe {
  s: number;
  pos: [number, number, number];
  look: [number, number, number];
}

interface PlanetRig {
  key: WorldKey;
  group: Group;
  /** Holds the axial tilt; body, rings and clouds live inside it. */
  tilt: Group;
  body: Mesh;
  clouds?: Mesh;
  ringInner: number;
  ringOuter: number;
  spin: number;
  spinStart: number;
  material: ShaderMaterial;
  ring?: Mesh;
  moon?: Mesh;
  base: Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  radius: number;
  highlight: number;
  texture: string;
}

export interface EngineOptions {
  reducedMotion: boolean;
}

const CORE = new Vector3(0, 0, -270);
const ORBIT_TILT = 0.32;
/** Sunlight direction during the fly-by: from the upper left, so planets show a day and a night side. */
const KEY_LIGHT = new Vector3(-0.85, 0.4, 0.45).normalize();

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const range = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));

export class SpaceEngine {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private reducedMotion: boolean;
  private isMobile: boolean;

  private nebula!: ShaderMaterial;
  private stars!: ShaderMaterial;
  private streaks!: ShaderMaterial;
  private planets: PlanetRig[] = [];
  private coreGlow!: Mesh;
  private coreGlowMat!: ShaderMaterial;
  private coreBody!: ShaderMaterial;
  private orbits: LineLoop[] = [];
  private orbitGroup = new Group();
  private sky?: Mesh;
  private skyMat?: ShaderMaterial;
  private skyFade = 0;
  /** Uniforms that fade from the procedural look to the photo texture once loaded. */
  private fading: Array<{ value: number }> = [];
  private textures: Texture[] = [];

  private anchors: { s: number; top: number }[] = [];
  private keyframes: Keyframe[] = [];
  private stage = -0.6;
  private lastStage = -0.6;
  private velocity = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private focusWorld: WorldKey | null = null;

  private raf = 0;
  private lastTime = 0;
  private elapsed = 0;
  private running = false;
  private pixelRatio = 1;
  private maxPixelRatio = 2;
  private slowFrames = 0;
  private resizeObserver?: ResizeObserver;

  private tmpPos = new Vector3();
  private tmpLook = new Vector3();

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    this.reducedMotion = options.reducedMotion;
    this.isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: !this.isMobile,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(new Color('#04050b'), 1);

    this.maxPixelRatio = this.isMobile ? 1.5 : 1.75;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.maxPixelRatio);
    this.renderer.setPixelRatio(this.pixelRatio);

    this.camera = new PerspectiveCamera(50, 1, 0.1, 1200);
    this.scene.add(this.camera);

    this.buildNebula();
    this.buildStars();
    this.buildStreaks();
    this.buildPlanets();
    this.buildCore();
    this.buildSky();
    // Photo textures arrive after the first frames; the procedural look covers until then.
    window.setTimeout(() => this.loadTextures(), 400);

    this.onResize = this.onResize.bind(this);
    this.onPointer = this.onPointer.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.onFocusWorld = this.onFocusWorld.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('nexus:focus-world', this.onFocusWorld as EventListener);

    // Section heights change as fonts and pinned sections settle.
    this.resizeObserver = new ResizeObserver(() => this.measureAnchors());
    this.resizeObserver.observe(document.body);

    this.onResize();
    if (this.reducedMotion) this.stage = this.targetStage();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('nexus:focus-world', this.onFocusWorld as EventListener);
    this.resizeObserver?.disconnect();
    this.scene.traverse((obj) => {
      const mesh = obj as Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as ShaderMaterial | ShaderMaterial[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    this.textures.forEach((tex) => tex.dispose());
    this.renderer.dispose();
  }

  /* ---------------- Build ---------------- */

  private octaves(desktop: number, mobile: number) {
    return { OCTAVES: this.isMobile ? mobile : desktop };
  }

  private buildNebula() {
    this.nebula = new ShaderMaterial({
      vertexShader: nebulaVertex,
      fragmentShader: nebulaFragment,
      defines: this.octaves(5, 3),
      uniforms: {
        uTime: { value: 0 },
        uStage: { value: 0 },
        uAspect: { value: 1 },
        uLook: { value: [0, 0] },
      },
      depthWrite: false,
      depthTest: false,
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), this.nebula);
    quad.frustumCulled = false;
    quad.renderOrder = -10;
    this.scene.add(quad);
  }

  private buildStars() {
    const count = this.isMobile ? 3200 : 7000;
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const palette = [
      new Color('#ffffff'),
      new Color('#cfe0ff'),
      new Color('#9fc2ff'),
      new Color('#ffe3b0'),
      new Color('#d9ccff'),
    ];

    for (let i = 0; i < count; i++) {
      const r = 6 + Math.pow(Math.random(), 0.7) * 170;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.75;
      pos[i * 3 + 2] = 90 - Math.random() * 520;
      const big = Math.random() < 0.03;
      size[i] = big ? 2.2 + Math.random() * 2.2 : 0.5 + Math.random() * 1.1;
      seed[i] = Math.random();
      const c = palette[Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 4)];
      color[i * 3] = c.r;
      color[i * 3 + 1] = c.g;
      color[i * 3 + 2] = c.b;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new BufferAttribute(size, 1));
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
    geo.setAttribute('aColor', new BufferAttribute(color, 3));

    this.stars = new ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: this.pixelRatio },
        uTwinkle: { value: this.reducedMotion ? 0 : 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(geo, this.stars);
    points.frustumCulled = false;
    this.scene.add(points);
  }

  private buildStreaks() {
    const count = this.isMobile ? 450 : 1100;
    const pos = new Float32Array(count * 6);
    const end = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 60;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.8;
      const z = 60 - Math.random() * 400;
      pos.set([x, y, z, x, y, z], i * 6);
      end[i * 2] = 0;
      end[i * 2 + 1] = 1;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('aEnd', new BufferAttribute(end, 1));
    this.streaks = new ShaderMaterial({
      vertexShader: streakVertex,
      fragmentShader: streakFragment,
      uniforms: { uStretch: { value: 0 }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const lines = new LineSegments(geo, this.streaks);
    lines.frustumCulled = false;
    this.scene.add(lines);
  }

  private planetMaterial(color: string, deep: string, bandScale: number, mode: number, octaves: number) {
    return new ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      defines: { OCTAVES: octaves },
      uniforms: {
        uColor: { value: new Color(color) },
        uDeep: { value: new Color(deep) },
        uLightPos: { value: new Vector3(-0.6, 0.5, 0.7) },
        uTime: { value: 0 },
        uHighlight: { value: 0 },
        uFade: { value: 0 },
        uBandScale: { value: bandScale },
        uMap: { value: null },
        uMapMix: { value: 0 },
        uMapMode: { value: mode },
        uDayMap: { value: null },
        uDayMix: { value: 0 },
        uRing: { value: 0 },
        uRingCenter: { value: new Vector3() },
        uRingNormal: { value: new Vector3(0, 1, 0) },
        uRingInner: { value: 0 },
        uRingOuter: { value: 0 },
        uRingMap: { value: null },
        uRingMapMix: { value: 0 },
      },
      transparent: true,
    });
  }

  private buildPlanets() {
    const seg = this.isMobile ? 64 : 128;
    const oct = this.isMobile ? 3 : 4;
    // Natural colours (shown until the photos load) and real axial tilts.
    const defs = [
      { key: 'technical' as const, color: '#2f5d9e', deep: '#0c1f3d', radius: 3.6, bandScale: 3, tilt: 0.41, spin: 0.012, spinStart: -2.93, texture: 'technical', earth: true, ring: false, moon: true, orbitRadius: 15, orbitSpeed: 0.16, orbitPhase: 0.4 },
      { key: 'non-technical' as const, color: '#e6cfae', deep: '#8c6242', radius: 5.2, bandScale: 9, tilt: 0.05, spin: 0.09, spinStart: 0, texture: 'strategy', earth: false, ring: false, moon: false, orbitRadius: 23, orbitSpeed: 0.11, orbitPhase: 2.6 },
      { key: 'cultural' as const, color: '#eadcb2', deep: '#a88c58', radius: 3.4, bandScale: 7, tilt: 0.47, spin: 0.08, spinStart: 0, texture: 'cultural', earth: false, ring: true, moon: false, orbitRadius: 31, orbitSpeed: 0.08, orbitPhase: 4.6 },
    ];

    defs.forEach((d) => {
      const group = new Group();
      const tilt = new Group();
      tilt.rotation.set(0.18, 0, d.tilt);
      group.add(tilt);

      const material = this.planetMaterial(d.color, d.deep, d.bandScale, d.earth ? 1 : 0, oct);
      const body = new Mesh(new SphereGeometry(d.radius, seg, seg / 2), material);
      body.renderOrder = 1;
      tilt.add(body);

      const rig: PlanetRig = {
        key: d.key,
        group,
        tilt,
        body,
        material,
        base: new Vector3(),
        orbitRadius: d.orbitRadius,
        orbitSpeed: d.orbitSpeed,
        orbitPhase: d.orbitPhase,
        radius: d.radius,
        highlight: 0,
        texture: d.texture,
        ringInner: 0,
        ringOuter: 0,
        spin: d.spin,
        spinStart: d.spinStart,
      };

      if (d.ring) {
        // Saturn's main rings span roughly 1.24 to 2.27 planet radii.
        const inner = d.radius * 1.24;
        const outer = d.radius * 2.27;
        const ring = new Mesh(
          new RingGeometry(inner, outer, this.isMobile ? 128 : 256, 1),
          new ShaderMaterial({
            vertexShader: ringVertex,
            fragmentShader: ringFragment,
            uniforms: {
              uColor: { value: new Color('#d9c9a3') },
              uInner: { value: inner },
              uOuter: { value: outer },
              uOpacity: { value: 1 },
              uMap: { value: null },
              uMapMix: { value: 0 },
              uLightPos: { value: new Vector3(-0.6, 0.5, 0.7) },
              uPlanetCenter: { value: new Vector3() },
              uPlanetRadius: { value: d.radius },
            },
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
            blending: NormalBlending,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.renderOrder = 2;
        tilt.add(ring);
        rig.ring = ring;
        rig.ringInner = inner;
        rig.ringOuter = outer;
        material.uniforms.uRing.value = 1;
      }

      if (d.moon) {
        const moon = new Mesh(new SphereGeometry(0.98, 48, 24), this.planetMaterial('#b8b5b0', '#55524e', 2, 0, 2));
        group.add(moon);
        rig.moon = moon;
      }

      this.scene.add(group);
      this.planets.push(rig);
    });
  }

  private buildCore() {
    this.coreBody = new ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform float uIntensity;
        uniform float uTime;
        uniform sampler2D uMap;
        uniform float uMapMix;
        varying vec2 vUv;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec3 vPos;
        void main() {
          float f = pow(1.0 - max(dot(normalize(vNormalW), vViewDir), 0.0), 1.6);
          vec3 col = mix(vec3(1.0, 0.97, 0.9), vec3(0.55, 0.7, 1.0), f);
          if (uMapMix > 0.001) {
            vec3 sun = texture2D(uMap, vUv + vec2(uTime * 0.004, 0.0)).rgb;
            col = mix(col, sun * vec3(1.5, 1.35, 1.2) + 0.4, uMapMix * 0.45);
          }
          gl_FragColor = vec4(col * (0.8 + uIntensity * 0.6), 1.0);
        }
      `,
      uniforms: { uIntensity: { value: 0 }, uTime: { value: 0 }, uMap: { value: null }, uMapMix: { value: 0 } },
    });
    const body = new Mesh(new SphereGeometry(2.4, 32, 16), this.coreBody);
    body.position.copy(CORE);
    this.scene.add(body);

    this.coreGlowMat = new ShaderMaterial({
      vertexShader: glowVertex,
      fragmentShader: glowFragment,
      uniforms: {
        uColor: { value: new Color('#7fa8ff') },
        uHot: { value: new Color('#fff4dc') },
        uIntensity: { value: 1 },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.coreGlow = new Mesh(new PlaneGeometry(56, 56), this.coreGlowMat);
    this.coreGlow.position.copy(CORE);
    this.scene.add(this.coreGlow);

    // Orbit guides, faded in as the planets converge
    this.orbitGroup.position.copy(CORE);
    this.orbitGroup.rotation.x = ORBIT_TILT;
    this.planets.forEach((p) => {
      const pts = new Float32Array(256 * 3);
      for (let i = 0; i < 256; i++) {
        const a = (i / 256) * Math.PI * 2;
        pts[i * 3] = Math.cos(a) * p.orbitRadius;
        pts[i * 3 + 1] = 0;
        pts[i * 3 + 2] = Math.sin(a) * p.orbitRadius;
      }
      const geo = new BufferGeometry();
      geo.setAttribute('position', new BufferAttribute(pts, 3));
      const loop = new LineLoop(
        geo,
        new LineBasicMaterial({
          color: new Color('#9fb6ff'),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      this.orbits.push(loop);
      this.orbitGroup.add(loop);
    });
    this.scene.add(this.orbitGroup);
  }


  private buildSky() {
    this.skyMat = new ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      uniforms: { uMap: { value: null }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: BackSide,
      blending: AdditiveBlending,
    });
    this.sky = new Mesh(new SphereGeometry(900, 48, 24), this.skyMat);
    this.sky.renderOrder = -9;
    this.sky.frustumCulled = false;
    this.sky.visible = false;
    this.sky.rotation.set(0.5, 0, 0.9);
    this.scene.add(this.sky);
  }

  /** Load planet photos (CC BY 4.0, Solar System Scope): 4K on laptops, 2K on phones. */
  private loadTextures() {
    const loader = new TextureLoader();
    const size = this.isMobile ? '2k' : '4k';
    const base = '/assets/planets/';
    const aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const load = (file: string, onReady: (tex: Texture) => void, repeat = false) =>
      loader.load(
        base + file,
        (tex) => {
          tex.anisotropy = aniso;
          if (repeat) tex.wrapS = RepeatWrapping;
          this.textures.push(tex);
          onReady(tex);
        },
        undefined,
        () => undefined, // keep the procedural look if a file fails
      );

    this.planets.forEach((p) => {
      load(`${p.texture}-${size}.webp`, (tex) => {
        p.material.uniforms.uMap.value = tex;
        this.fading.push(p.material.uniforms.uMapMix);
      });
      if (p.key === 'technical') {
        load(`earth-day-${size}.webp`, (tex) => {
          p.material.uniforms.uDayMap.value = tex;
          this.fading.push(p.material.uniforms.uDayMix);
        });
        load(`earth-clouds-${size}.webp`, (tex) => {
          const mat = new ShaderMaterial({
            vertexShader: planetVertex,
            fragmentShader: cloudFragment,
            uniforms: { uMap: { value: tex }, uLightPos: { value: new Vector3(-0.6, 0.5, 0.7) }, uOpacity: { value: 0 } },
            transparent: true,
            depthWrite: false,
          });
          const seg = this.isMobile ? 64 : 128;
          p.clouds = new Mesh(new SphereGeometry(p.radius * 1.012, seg, seg / 2), mat);
          p.clouds.renderOrder = 2;
          p.tilt.add(p.clouds);
          this.fading.push(mat.uniforms.uOpacity);
        });
      }
      if (p.ring) {
        load('ring.webp', (tex) => {
          const u = (p.ring!.material as ShaderMaterial).uniforms;
          u.uMap.value = tex;
          this.fading.push(u.uMapMix);
          p.material.uniforms.uRingMap.value = tex;
          this.fading.push(p.material.uniforms.uRingMapMix);
        });
      }
      if (p.moon) {
        load('moon-1k.webp', (tex) => {
          const u = (p.moon!.material as ShaderMaterial).uniforms;
          u.uMap.value = tex;
          this.fading.push(u.uMapMix);
        });
      }
    });
    load(
      'core-1k.webp',
      (tex) => {
        this.coreBody.uniforms.uMap.value = tex;
        this.fading.push(this.coreBody.uniforms.uMapMix);
      },
      true,
    );
    load(`sky-${size}.webp`, (tex) => {
      if (!this.skyMat || !this.sky) return;
      this.skyMat.uniforms.uMap.value = tex;
      this.sky.visible = true;
    });
  }

  /* ---------------- Layout ---------------- */

  private onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 0.8 ? 68 : aspect < 1.2 ? 58 : 50;
    this.camera.updateProjectionMatrix();
    this.nebula.uniforms.uAspect.value = aspect;
    this.layoutForAspect(aspect);
    this.measureAnchors();
    if (!this.running) this.render();
  }

  /** Planet placement and camera path depend on screen shape. */
  private layoutForAspect(aspect: number) {
    const portrait = aspect < 0.9;
    // Planets sit to the right of the text on wide screens, above it on phones.
    const x = portrait ? 0 : 9;
    const y = portrait ? 10 : 0.6;
    this.planets[0].base.set(x, y, -112);
    this.planets[1].base.set(x + (portrait ? 0 : 1.5), y - (portrait ? 0 : 1.2), -156);
    this.planets[2].base.set(x, y + (portrait ? 0 : 0.6), -200);

    const pull = portrait ? 1.9 : aspect < 1.3 ? 1.35 : 1;
    const end = (d: number): [number, number, number] => [0, 4 + d * 0.18 * pull, CORE.z + d * pull];

    const lookX = portrait ? 0 : 2.5;
    const camX = portrait ? 0 : -1.5;
    const lookY = portrait ? -1 : y * 0.6;
    const camZ = (planetZ: number) => planetZ + (portrait ? 28 : 25);

    this.keyframes = [
      { s: -0.6, pos: [0, 0.6, 70], look: [0, 0, -60] },
      { s: 0, pos: [0, 0, 32], look: [0, 0, -60] },
      { s: 1, pos: [0, 1.2, -48], look: [0, 0, -140] },
      // Worlds section is pinned for three screens; one planet per screen.
      { s: 2.25, pos: [camX, 0.4, camZ(-112)], look: [lookX, lookY, -112] },
      { s: 2.5, pos: [camX, 0.2, camZ(-156)], look: [lookX, lookY, -156] },
      { s: 2.75, pos: [camX, 0.4, camZ(-200)], look: [lookX, lookY, -200] },
      { s: 3.4, pos: [0, 3, -205], look: [0, 0, CORE.z] },
      { s: 4.4, pos: end(62), look: [0, 7, CORE.z] },
      { s: 5.2, pos: end(58), look: [0, 14, CORE.z] },
      { s: 6.2, pos: end(70), look: [0, 10, CORE.z] },
    ];
  }

  private measureAnchors() {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]'));
    const scrollY = window.scrollY;
    const list = els
      .map((el) => ({ s: Number(el.dataset.stage), top: el.getBoundingClientRect().top + scrollY }))
      .filter((a) => !Number.isNaN(a.s))
      .sort((a, b) => a.s - b.s);
    const docEnd = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    if (list.length) list.push({ s: list[list.length - 1].s + 1, top: docEnd + window.innerHeight * 0.5 });
    this.anchors = list;
  }

  private targetStage(): number {
    const a = this.anchors;
    if (a.length < 2) return 0;
    const y = window.scrollY + window.innerHeight * 0.5;
    if (y <= a[0].top) return a[0].s;
    for (let i = 0; i < a.length - 1; i++) {
      if (y < a[i + 1].top) {
        const span = Math.max(a[i + 1].top - a[i].top, 1);
        return a[i].s + ((y - a[i].top) / span) * (a[i + 1].s - a[i].s);
      }
    }
    return a[a.length - 1].s;
  }

  /* ---------------- Events ---------------- */

  private onPointer(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }

  private onVisibility() {
    if (document.hidden) this.stop();
    else this.start();
  }

  private onFocusWorld(e: CustomEvent<WorldKey | null>) {
    this.focusWorld = e.detail;
  }

  /* ---------------- Frame ---------------- */

  private sampleCamera(s: number) {
    const k = this.keyframes;
    let i = 0;
    while (i < k.length - 2 && s > k[i + 1].s) i++;
    const a = k[i];
    const b = k[i + 1];
    const t = smooth(clamp01((s - a.s) / (b.s - a.s)));
    this.tmpPos.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * t,
      a.pos[1] + (b.pos[1] - a.pos[1]) * t,
      a.pos[2] + (b.pos[2] - a.pos[2]) * t,
    );
    this.tmpLook.set(
      a.look[0] + (b.look[0] - a.look[0]) * t,
      a.look[1] + (b.look[1] - a.look[1]) * t,
      a.look[2] + (b.look[2] - a.look[2]) * t,
    );
  }

  private tick(now: number) {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);

    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.adaptQuality(dt);
    this.update(dt);
    this.render();
  }

  /** Lower the resolution on devices that cannot keep up. */
  private adaptQuality(dt: number) {
    if (dt > 0.028) this.slowFrames++;
    else this.slowFrames = Math.max(0, this.slowFrames - 1);
    if (this.slowFrames > 40 && this.pixelRatio > 0.75) {
      this.pixelRatio = Math.max(0.75, this.pixelRatio - 0.25);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight, false);
      this.stars.uniforms.uPixelRatio.value = this.pixelRatio;
      this.slowFrames = 0;
    }
  }

  private update(dt: number) {
    if (!this.reducedMotion) this.elapsed += dt;
    const time = this.elapsed;

    // Ease the stage towards the scroll position for a weighty, cinematic feel.
    const target = this.targetStage();
    const ease = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 3.2);
    this.stage += (target - this.stage) * ease;
    const s = this.stage;

    const rawVel = dt > 0 ? (s - this.lastStage) / dt : 0;
    this.lastStage = s;
    this.velocity += (rawVel - this.velocity) * Math.min(1, dt * 6);

    // Camera
    this.sampleCamera(s);
    this.pointer.x += (this.pointer.tx - this.pointer.x) * Math.min(1, dt * 2);
    this.pointer.y += (this.pointer.ty - this.pointer.y) * Math.min(1, dt * 2);
    const sway = this.reducedMotion ? 0 : 1;
    this.camera.position.set(
      this.tmpPos.x + this.pointer.x * 1.2 * sway + Math.sin(time * 0.15) * 0.3 * sway,
      this.tmpPos.y - this.pointer.y * 0.8 * sway + Math.cos(time * 0.12) * 0.2 * sway,
      this.tmpPos.z,
    );
    this.camera.lookAt(this.tmpLook);

    // Background + stars
    this.nebula.uniforms.uTime.value = time;
    this.nebula.uniforms.uStage.value = s;
    this.nebula.uniforms.uLook.value = [this.pointer.x * 0.05 + s * 0.04, -this.pointer.y * 0.04];
    this.stars.uniforms.uTime.value = time;

    // Warp streaks scale with forward speed through the starfield
    const travel = 1 - range(3.2, 4, s);
    const speed = Math.abs(this.velocity);
    const warp = this.reducedMotion ? 0 : clamp01(speed * 0.9) * travel;
    this.streaks.uniforms.uOpacity.value = warp * 0.75;
    this.streaks.uniforms.uStretch.value = Math.sign(this.velocity) * Math.min(speed * 26, 34);

    // Planets drift from their fly-by spots into orbit around the core
    const converge = smooth(range(3.0, 4.5, s));
    const appear = smooth(range(1.25, 1.9, s));
    this.planets.forEach((p, i) => {
      const angle = p.orbitPhase + time * p.orbitSpeed * (0.25 + converge * 0.75);
      const ox = Math.cos(angle) * p.orbitRadius;
      const oz = Math.sin(angle) * p.orbitRadius;
      const orbit = new Vector3(ox, 0, oz).applyAxisAngle(new Vector3(1, 0, 0), ORBIT_TILT).add(CORE);
      const lift = Math.sin(converge * Math.PI) * (6 + i * 3);
      p.group.position.lerpVectors(p.base, orbit, converge);
      p.group.position.y += lift;
      p.group.scale.setScalar(1 - converge * 0.25);

      p.body.rotation.y = p.spinStart + time * p.spin;
      if (p.clouds) p.clouds.rotation.y = p.spinStart + time * p.spin * 1.2;
      if (p.moon) {
        // The Moon orbits Earth: about a quarter of Earth's size, on a slightly inclined orbit.
        const ma = time * 0.06 + 0.9;
        const orbitR = p.radius * 2.0;
        p.moon.position.set(Math.cos(ma) * orbitR, Math.sin(ma) * orbitR * 0.09, Math.sin(ma) * orbitR);
      }

      const wantHighlight = this.focusWorld === p.key ? 1 : 0;
      p.highlight += (wantHighlight - p.highlight) * Math.min(1, dt * 4);
      const u = p.material.uniforms;
      u.uTime.value = time;
      u.uHighlight.value = p.highlight;
      u.uFade.value = appear;
      p.group.visible = appear > 0.001;

      // Sunlight: a key light during the fly-by, then the core once the planets orbit it.
      const lightDir = new Vector3().subVectors(CORE, p.group.position).normalize();
      const sun = KEY_LIGHT.clone().lerp(lightDir, converge).normalize();
      u.uLightPos.value.copy(sun);
      const scale = p.group.scale.x;

      if (p.ring) {
        const ru = (p.ring.material as ShaderMaterial).uniforms;
        ru.uLightPos.value.copy(sun);
        ru.uPlanetCenter.value.copy(p.group.position);
        ru.uPlanetRadius.value = p.radius * scale;
        ru.uOpacity.value = appear;
        u.uRingCenter.value.copy(p.group.position);
        u.uRingNormal.value.set(0, 1, 0).applyQuaternion(p.tilt.quaternion);
        u.uRingInner.value = p.ringInner * scale;
        u.uRingOuter.value = p.ringOuter * scale;
      }
      if (p.clouds) (p.clouds.material as ShaderMaterial).uniforms.uLightPos.value.copy(sun);
      if (p.moon) {
        const mu = (p.moon.material as ShaderMaterial).uniforms;
        mu.uLightPos.value.copy(sun);
        mu.uFade.value = appear;
      }
    });

    // Core and orbit guides
    const coreIntensity = 0.5 + converge * 0.25 + Math.sin(time * 1.3) * 0.03;
    this.coreGlowMat.uniforms.uIntensity.value = coreIntensity;
    this.coreGlowMat.uniforms.uTime.value = time;
    this.coreBody.uniforms.uIntensity.value = converge;
    this.coreGlow.quaternion.copy(this.camera.quaternion);
    this.orbitGroup.rotation.y = time * 0.01;
    this.orbits.forEach((o) => ((o.material as LineBasicMaterial).opacity = converge * 0.22));
    this.coreBody.uniforms.uTime.value = time;

    const fadeStep = this.reducedMotion ? 1 : Math.min(1, dt * 1.2);
    this.fading.forEach((u) => {
      u.value += (1 - u.value) * fadeStep;
    });
    if (this.sky && this.skyMat) {
      this.sky.position.copy(this.camera.position);
      if (this.skyMat.uniforms.uMap.value) this.skyFade += (1 - this.skyFade) * fadeStep;
      // The Milky Way brightens slightly as the journey reaches the core.
      this.skyMat.uniforms.uOpacity.value = this.skyFade * (0.32 + converge * 0.18);
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Dev only: jump to a stage and simulate a couple of seconds, for screenshots. */
  debugFrame(stage: number) {
    this.stage = this.lastStage = stage;
    for (let i = 0; i < 180; i++) this.update(1 / 60);
    this.stage = this.lastStage = stage;
    this.update(1 / 60);
    this.render();
  }

  /** Draw one frame immediately (used for the first paint). */
  renderOnce() {
    this.measureAnchors();
    this.update(0);
    this.render();
  }
}
