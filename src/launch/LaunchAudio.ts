import type { BeatEvent } from './beat';

/**
 * Sound for the launch sequence, synthesised with the Web Audio API.
 * No audio files: everything is built from oscillators and noise, so it works offline.
 */
export class LaunchAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private pad: { gain: GainNode; stop: () => void } | null = null;
  private ambientPad: { gain: GainNode; stop: () => void } | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  /** Drums and bass go through a compressor so the hits sit together. */
  private drums: GainNode | null = null;
  muted = false;

  /** Must be called from a user gesture (the launch click) so the browser allows sound. */
  init() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    // Brick-wall limiter on the output so big drops never clip or crackle.
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.12;
    this.master.connect(limiter).connect(this.ctx.destination);

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    this.drums = this.ctx.createGain();
    this.drums.gain.value = 0.85;
    this.drums.connect(comp).connect(this.master);

    // 4 seconds of white noise, reused by every noise voice
    const len = this.ctx.sampleRate * 4;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    }
  }

  private noise(start: number, duration: number) {
    if (!this.ctx || !this.noiseBuffer) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    src.start(start);
    src.stop(start + duration);
    return src;
  }

  private env(gain: GainNode, start: number, attack: number, peak: number, decay: number) {
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  }


  /** Current audio-clock time, for scheduling beat events ahead of the picture. */
  get now() {
    return this.ctx?.currentTime ?? 0;
  }

  /** Play one beat event at an exact audio-clock time. */
  schedule(ev: BeatEvent, when: number) {
    if (!this.ctx || !this.drums) return;
    const at = Math.max(when, this.ctx.currentTime);
    switch (ev.kind) {
      case 'kick':
        return this.kick(at, 1);
      case 'kickSoft':
        return this.kick(at, 0.45);
      case 'snare':
        return this.snare(at, ev.value ?? 1);
      case 'hat':
        return this.hat(at);
      case 'bass':
        return this.bassNote(at, ev.value ?? 55);
      case 'impact':
        return this.impact(at);
      case 'riser':
        return this.riser(at, ev.value ?? 2);
      case 'drop':
        this.kick(at, 1);
        return this.boom(at);
    }
  }

  private saturator: WaveShaperNode | null = null;

  /** Soft clipper that adds harmonics, so deep bass is still heard on small speakers. */
  private drive() {
    if (!this.saturator && this.ctx) {
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++) {
        const x = (i / (curve.length - 1)) * 2 - 1;
        curve[i] = Math.tanh(x * 3.5);
      }
      this.saturator = this.ctx.createWaveShaper();
      this.saturator.curve = curve;
      this.saturator.connect(this.master!);
    }
    return this.saturator!;
  }

  /**
   * The drop: a long distorted 808 sub with a punchy mid "thud" on top. The distortion
   * and the 100-160 Hz layer make it hit on laptop and projector speakers, not only subwoofers.
   */
  private boom(at: number) {
    const ctx = this.ctx!;
    const sub = ctx.createOscillator();
    const sg = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, at);
    sub.frequency.exponentialRampToValueAtTime(48, at + 0.18);
    sg.gain.setValueAtTime(0.0001, at);
    sg.gain.exponentialRampToValueAtTime(0.55, at + 0.005);
    sg.gain.setValueAtTime(0.55, at + 0.25);
    sg.gain.exponentialRampToValueAtTime(0.0001, at + 1.7);
    sub.connect(sg).connect(this.drive());
    sub.start(at);
    sub.stop(at + 1.8);

    const thud = ctx.createOscillator();
    const tg = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(160, at);
    thud.frequency.exponentialRampToValueAtTime(90, at + 0.25);
    this.env(tg, at, 0.003, 0.4, 0.35);
    thud.connect(tg).connect(this.master!);
    thud.start(at);
    thud.stop(at + 0.45);

    // short clap-like snap at the start for attack (kept under 3 kHz)
    const n = this.noise(at, 0.2);
    if (n) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      bp.Q.value = 0.9;
      const g = ctx.createGain();
      this.env(g, at, 0.002, 0.4, 0.14);
      n.connect(bp).connect(g).connect(this.master!);
    }
  }

  private kick(at: number, level: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, at);
    o.frequency.exponentialRampToValueAtTime(45, at + 0.12);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.95 * level, at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
    o.connect(g).connect(this.drums!);
    o.start(at);
    o.stop(at + 0.45);
  }

  /** Snare kept warm: a low body plus noise cut above 3.5 kHz so it never hisses. */
  private snare(at: number, level: number) {
    const ctx = this.ctx!;
    const body = ctx.createOscillator();
    const bg = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(190, at);
    body.frequency.exponentialRampToValueAtTime(120, at + 0.1);
    this.env(bg, at, 0.002, 0.35 * level, 0.14);
    body.connect(bg).connect(this.drums!);
    body.start(at);
    body.stop(at + 0.2);

    const n = this.noise(at, 0.25);
    if (!n) return;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1500;
    bp.Q.value = 0.8;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3500;
    const g = ctx.createGain();
    this.env(g, at, 0.002, 0.28 * level, 0.16);
    n.connect(bp).connect(lp).connect(g).connect(this.drums!);
  }

  /** A soft, muted shaker on the off-beat (no bright cymbal). */
  private hat(at: number) {
    const ctx = this.ctx!;
    const n = this.noise(at, 0.08);
    if (!n) return;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2400;
    bp.Q.value = 1.2;
    const g = ctx.createGain();
    this.env(g, at, 0.002, 0.035, 0.05);
    n.connect(bp).connect(g).connect(this.drums!);
  }

  private bassNote(at: number, hz: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = hz;
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(420, at);
    lp.frequency.exponentialRampToValueAtTime(140, at + 0.22);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.32, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
    o.connect(lp).connect(g).connect(this.drums!);
    o.start(at);
    o.stop(at + 0.26);
  }

  /** Big low hit for logos and drops. */
  private impact(at: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, at);
    o.frequency.exponentialRampToValueAtTime(40, at + 0.9);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.45, at + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 1.2);
    o.connect(g).connect(this.drive());
    o.start(at);
    o.stop(at + 1.4);

    const n = this.noise(at, 0.6);
    if (!n) return;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, at);
    lp.frequency.exponentialRampToValueAtTime(120, at + 0.5);
    const ng = ctx.createGain();
    this.env(ng, at, 0.003, 0.45, 0.5);
    n.connect(lp).connect(ng).connect(this.master!);
  }

  /** Rising pitch sweep into a drop (tonal only, no noise). */
  private riser(at: number, length: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, at);
    o.frequency.exponentialRampToValueAtTime(440, at + length);
    og.gain.setValueAtTime(0.0001, at);
    og.gain.exponentialRampToValueAtTime(0.12, at + length * 0.95);
    og.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.05);
    o.connect(og).connect(this.master!);
    o.start(at);
    o.stop(at + length + 0.1);
  }

  /** Countdown tick; pitch rises as the number falls. */
  tick(secondsLeft: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 440 + (10 - secondsLeft) * 36;
    this.env(g, now, 0.004, secondsLeft <= 3 ? 0.4 : 0.25, 0.22);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.3);

    // low thump underneath
    const sub = this.ctx.createOscillator();
    const sg = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    this.env(sg, now, 0.005, 0.35, 0.3);
    sub.connect(sg).connect(this.master);
    sub.start(now);
    sub.stop(now + 0.4);
  }

  /** Ignition boom at T-0. */
  ignition() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const sub = this.ctx.createOscillator();
    const sg = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(70, now);
    sub.frequency.exponentialRampToValueAtTime(22, now + 1.8);
    this.env(sg, now, 0.01, 1.0, 1.9);
    sub.connect(sg).connect(this.master);
    sub.start(now);
    sub.stop(now + 2);

    const burst = this.noise(now, 1.2);
    if (burst) {
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(600, now);
      lp.frequency.exponentialRampToValueAtTime(120, now + 1.1);
      const g = this.ctx.createGain();
      this.env(g, now, 0.01, 0.7, 1.1);
      burst.connect(lp).connect(g).connect(this.master);
    }
  }

  /** Rising warp rush for the flight; lasts about five seconds. */
  warp() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const rush = this.noise(now, 6);
    if (rush) {
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 0.7;
      bp.frequency.setValueAtTime(140, now);
      bp.frequency.exponentialRampToValueAtTime(700, now + 4.6);
      bp.frequency.exponentialRampToValueAtTime(300, now + 5.9);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.55, now + 1.2);
      g.gain.setValueAtTime(0.55, now + 4.4);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 5.9);
      rush.connect(bp).connect(g).connect(this.master);
    }

    const drone = this.ctx.createOscillator();
    const dg = this.ctx.createGain();
    const lp = this.ctx.createBiquadFilter();
    drone.type = 'sawtooth';
    drone.frequency.setValueAtTime(48, now);
    drone.frequency.exponentialRampToValueAtTime(210, now + 4.6);
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(400, now);
    lp.frequency.exponentialRampToValueAtTime(600, now + 4.6);
    dg.gain.setValueAtTime(0.0001, now);
    dg.gain.exponentialRampToValueAtTime(0.14, now + 0.8);
    dg.gain.setValueAtTime(0.14, now + 4.3);
    dg.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
    drone.connect(lp).connect(dg).connect(this.master);
    drone.start(now);
    drone.stop(now + 6);
  }

  private startPad(notes: number[], level: number, attack: number) {
    if (!this.ctx || !this.master) return null;
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + attack);
    gain.connect(this.master);
    const oscs = notes.map((hz, i) => {
      const o = this.ctx!.createOscillator();
      o.type = i === notes.length - 1 ? 'triangle' : 'sine';
      o.frequency.value = hz;
      o.detune.value = (i - notes.length / 2) * 4;
      o.connect(gain);
      o.start(now);
      return o;
    });
    return {
      gain,
      stop: () => {
        const at = this.ctx!.currentTime;
        gain.gain.cancelScheduledValues(at);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), at);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 3);
        oscs.forEach((o) => o.stop(at + 3.1));
      },
    };
  }

  /** Low, slow pad under the institution and worlds chapters. */
  ambient() {
    this.ambientPad = this.startPad([110, 164.81, 220, 329.63], 0.07, 4);
  }

  ambientStop() {
    this.ambientPad?.stop();
    this.ambientPad = null;
  }

  /** Brighter chord pad for the convergence and the reveal; holds until the end. */
  arrival() {
    this.ambientStop();
    this.pad = this.startPad([220, 277.18, 329.63, 440], 0.11, 3);
  }

  /** Short air swoosh for a card change. */
  swoosh() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const src = this.noise(now, 1.1);
    if (!src) return;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(160, now);
    bp.frequency.exponentialRampToValueAtTime(420, now + 0.35);
    bp.frequency.exponentialRampToValueAtTime(180, now + 1.0);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.16, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
    src.connect(bp).connect(g).connect(this.master);
  }

  /** Deep impact for a big line. */
  bass() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(64, now);
    o.frequency.exponentialRampToValueAtTime(26, now + 1.4);
    this.env(g, now, 0.01, 0.75, 1.5);
    o.connect(g).connect(this.master);
    o.start(now);
    o.stop(now + 1.6);
  }

  /** Soft swell when the logo locks into place: a warm low note and a breath of air. */
  reveal() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    [110, 220, 329.63].forEach((hz, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'sine';
      o.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(i === 0 ? 0.16 : 0.07, now + 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      o.connect(g).connect(this.master!);
      o.start(now);
      o.stop(now + 3.3);
    });
    const air = this.noise(now, 1.6);
    if (air) {
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(500, now);
      lp.frequency.exponentialRampToValueAtTime(700, now + 0.5);
      lp.frequency.exponentialRampToValueAtTime(300, now + 1.5);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.06, now + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      air.connect(lp).connect(g).connect(this.master);
    }
  }

  /** Tiny click for each typed letter. */
  type() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.value = 1400 + Math.random() * 400;
    this.env(g, now, 0.002, 0.02, 0.03);
    o.connect(g).connect(this.master);
    o.start(now);
    o.stop(now + 0.05);
  }

  /** Fade everything out at the handoff. */
  finish() {
    this.ambientStop();
    this.pad?.stop();
    this.pad = null;
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(0, t + 2, 0.8);
    }
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
