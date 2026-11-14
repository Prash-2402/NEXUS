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
    this.master.connect(this.ctx.destination);

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
      lp.frequency.setValueAtTime(1800, now);
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
      bp.frequency.exponentialRampToValueAtTime(2600, now + 4.6);
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
    lp.frequency.exponentialRampToValueAtTime(2400, now + 4.6);
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
    bp.frequency.setValueAtTime(260, now);
    bp.frequency.exponentialRampToValueAtTime(2200, now + 0.35);
    bp.frequency.exponentialRampToValueAtTime(500, now + 1.0);
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

  /** Bright hit when the logo locks into place. */
  reveal() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'triangle';
      o.frequency.value = hz;
      this.env(g, now + i * 0.02, 0.01, 0.22, 2.8);
      o.connect(g).connect(this.master!);
      o.start(now);
      o.stop(now + 3);
    });
    const shimmer = this.noise(now, 1.6);
    if (shimmer) {
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 5000;
      const g = this.ctx.createGain();
      this.env(g, now, 0.01, 0.18, 1.5);
      shimmer.connect(hp).connect(g).connect(this.master);
    }
    const boom = this.ctx.createOscillator();
    const bg = this.ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(80, now);
    boom.frequency.exponentialRampToValueAtTime(30, now + 0.9);
    this.env(bg, now, 0.01, 0.6, 1);
    boom.connect(bg).connect(this.master);
    boom.start(now);
    boom.stop(now + 1.1);
  }

  /** Tiny click for each typed letter. */
  type() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.value = 1400 + Math.random() * 400;
    this.env(g, now, 0.002, 0.05, 0.03);
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
