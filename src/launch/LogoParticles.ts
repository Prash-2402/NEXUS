/**
 * The NEXUS logo assembling out of thousands of particles, then bursting.
 * Draws on a 2D canvas; the logo image is sampled for particle positions and colours.
 */

interface Particle {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: number;
  swirl: number;
  color: string;
  size: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}

const ASSEMBLE_SECONDS = 2.6;
const SPARK_COLORS = ['#ffffff', '#f5c451', '#8fb8ff', '#cfe0ff', '#ffd98a'];

export class LogoParticles {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private sparks: Spark[] = [];
  private dpr = Math.min(window.devicePixelRatio || 1, 2);
  private width = 0;
  private height = 0;
  private ready = false;
  private assembleStart: number | null = null;
  private burstAt: number | null = null;
  private centre = { x: 0, y: 0 };
  /** The on-screen box the logo assembles into (CSS pixels). */
  logoBox = { x: 0, y: 0, w: 0, h: 0 };

  constructor(private canvas: HTMLCanvasElement, private isMobile: boolean) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Sample the logo image into particle targets. Resolves once particles are ready. */
  async load(src: string) {
    const img = new Image();
    img.src = src;
    await img.decode();

    // Same size as the hero logo, so the handoff lines up.
    const w = Math.min(this.width * 0.9, 780);
    const h = w * (img.naturalHeight / img.naturalWidth);
    const x0 = (this.width - w) / 2;
    const y0 = this.height * 0.4 - h * 0.5;
    this.logoBox = { x: x0, y: y0, w, h };
    this.centre = { x: x0 + w / 2, y: y0 + h / 2 };

    const off = document.createElement('canvas');
    off.width = Math.round(w);
    off.height = Math.round(h);
    const octx = off.getContext('2d')!;
    octx.drawImage(img, 0, 0, off.width, off.height);
    const data = octx.getImageData(0, 0, off.width, off.height).data;

    const step = this.isMobile ? 5 : 3;
    const spread = Math.max(this.width, this.height) * 0.9;
    const particles: Particle[] = [];
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        const i = (y * off.width + x) * 4;
        const a = data[i + 3];
        if (a < 110) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const angle = Math.random() * Math.PI * 2;
        const dist = spread * (0.3 + Math.random() * 0.5);
        const tx = x0 + x;
        const ty = y0 + y;
        // Assemble from the centre outwards, with a little randomness.
        const fromCentre = Math.hypot(tx - this.centre.x, ty - this.centre.y) / (w / 2);
        particles.push({
          x: 0,
          y: 0,
          sx: this.centre.x + Math.cos(angle) * dist,
          sy: this.centre.y + Math.sin(angle) * dist,
          tx,
          ty,
          delay: fromCentre * 0.55 + Math.random() * 0.35,
          swirl: (Math.random() - 0.5) * 160,
          color: `rgb(${r},${g},${b})`,
          size: step * 0.6,
        });
      }
    }
    this.particles = particles;
    this.ready = true;
  }

  /** Begin assembling at the given time (seconds, same clock as `draw`). */
  assemble(at: number) {
    this.assembleStart = at;
  }

  /** Throw sparks out from the logo. */
  burst(at: number) {
    this.burstAt = at;
    const count = this.isMobile ? 220 : 520;
    const sparks: Spark[] = [];
    for (let i = 0; i < count; i++) {
      const p = this.particles[Math.floor(Math.random() * this.particles.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 160 + Math.random() * 520;
      sparks.push({
        x: p ? p.tx : this.centre.x,
        y: p ? p.ty : this.centre.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        life: 0,
        max: 1.4 + Math.random() * 1.6,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        size: 1.5 + Math.random() * 2.5,
      });
    }
    this.sparks = sparks;
  }

  /** 0..1 how far the assembly has progressed. */
  progress(now: number) {
    if (this.assembleStart === null) return 0;
    return Math.min(1, (now - this.assembleStart) / (ASSEMBLE_SECONDS + 0.9));
  }

  /**
   * Draw one frame. `logoAlpha` fades the particle logo out once the crisp image takes over.
   */
  draw(now: number, dt: number, logoAlpha: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    if (!this.ready) return;

    if (this.assembleStart !== null && logoAlpha > 0.01) {
      const elapsed = now - this.assembleStart;
      ctx.globalCompositeOperation = 'lighter';
      for (const p of this.particles) {
        const t = Math.min(1, Math.max(0, (elapsed - p.delay) / ASSEMBLE_SECONDS));
        if (t <= 0) continue;
        const e = 1 - Math.pow(1 - t, 3);
        const arc = Math.sin(t * Math.PI) * p.swirl;
        const dx = p.tx - p.sx;
        const dy = p.ty - p.sy;
        const len = Math.hypot(dx, dy) || 1;
        p.x = p.sx + dx * e + (-dy / len) * arc;
        p.y = p.sy + dy * e + (dx / len) * arc;
        ctx.globalAlpha = logoAlpha * (0.35 + 0.65 * t);
        ctx.fillStyle = p.color;
        const s = p.size * (1.3 - 0.3 * t);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    if (this.burstAt !== null && this.sparks.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (const sp of this.sparks) {
        sp.life += dt;
        if (sp.life > sp.max) continue;
        sp.vx *= 1 - dt * 1.2;
        sp.vy *= 1 - dt * 1.2;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        const k = 1 - sp.life / sp.max;
        ctx.globalAlpha = k * k;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (0.5 + k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (this.sparks.every((s) => s.life > s.max)) this.sparks = [];
    }
    ctx.globalAlpha = 1;
  }
}
