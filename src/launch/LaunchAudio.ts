import type { BeatEvent } from './beat';

/**
 * The launch film's percussion orchestra, synthesised with the Web Audio API.
 * No audio files: South Indian drums (parai, thavil, chenda, dhol, ilathalam),
 * brass stabs and trailer hits are all built from oscillators and noise, through
 * one shared room reverb, so it works offline.
 */
export class LaunchAudio {
  private ctx: BaseAudioContext | null = null;
  /** Everything ends here, then goes through the limiter to the speakers. */
  private master: GainNode | null = null;
  /** Send into the room reverb. */
  private verb: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private saturator: WaveShaperNode | null = null;
  muted = false;

  /** Must be called from a user gesture (the launch click) so the browser allows sound. */
  init() {
    this.prepare();
    const ctx = this.ctx as AudioContext | null;
    void ctx?.resume?.();
  }

  /**
   * Build the audio graph ahead of time. Creating an AudioContext can block for
   * half a second on Windows, so this runs while the locked screen is up instead
   * of on the launch press. Before a user gesture the context just waits suspended.
   */
  prepare() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.attach(new Ctx());
  }

  /** Wire up the mix on a context (a live one, or an offline one for checking the score). */
  attach(ctx: BaseAudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    // Brick-wall limiter on the output so the big hits never clip or crackle.
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    this.master.connect(limiter).connect(ctx.destination);

    // A big stage room: short enough to keep the drums tight, big enough to feel huge.
    const room = ctx.createConvolver();
    room.buffer = this.impulse(1.8);
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    this.verb = ctx.createGain();
    this.verb.connect(room).connect(wet).connect(this.master);

    const len = ctx.sampleRate * 2;
    this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  /** Stereo decaying noise, low-passed so the tail is warm rather than hissy. */
  private impulse(seconds: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const pre = Math.floor(ctx.sampleRate * 0.015);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let y = 0;
      for (let i = pre; i < len; i++) {
        y += 0.3 * (Math.random() * 2 - 1 - y);
        d[i] = y * Math.pow(1 - i / len, 3) * 2;
      }
    }
    return buf;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    }
  }

  /** Current audio-clock time, for scheduling score events ahead of the picture. */
  get now() {
    return this.ctx?.currentTime ?? 0;
  }

  /** Play one score event at an exact audio-clock time. */
  schedule(ev: BeatEvent, when: number) {
    if (!this.ctx || !this.master) return;
    const at = Math.max(when, this.ctx.currentTime);
    const level = ev.level ?? 1;
    switch (ev.kind) {
      case 'drone':
        return this.drone(at, ev.dur ?? 4, ev.notes ?? [110], level, ev.attack ?? 1, ev.release ?? 2);
      case 'parai':
        return this.parai(at, level, ev.open ?? false);
      case 'thavil':
        return ev.open ? this.thavilBass(at, level) : this.thavilCrack(at, level);
      case 'chenda':
        return this.chenda(at, level);
      case 'dhol':
        return this.dhol(at, level);
      case 'thalam':
        return this.thalam(at, level, ev.open ?? false);
      case 'stab':
        return this.stab(at, ev.hz ?? 110, level, ev.dur ?? 0.45);
      case 'taiko':
        return this.taiko(at, level);
      case 'braam':
        return this.braam(at, ev.hz ?? 55, level, ev.dur ?? 3);
      case 'boom':
        return this.boom(at, level);
      case 'riser':
        return this.riser(at, ev.dur ?? 2, level);
      case 'swell':
        return this.swell(at, ev.dur ?? 1.5, level);
    }
  }

  /* ---------------- Routing helpers ---------------- */

  /** Send a voice to the mix, with some of it into the room. */
  private out(node: AudioNode, send: number) {
    node.connect(this.master!);
    if (send > 0) {
      const s = this.ctx!.createGain();
      s.gain.value = send;
      node.connect(s).connect(this.verb!);
    }
  }

  private noise(start: number, duration: number) {
    if (!this.ctx || !this.noiseBuffer) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    // start somewhere random in the buffer so repeated hits never sound identical
    src.start(start, Math.random() * 1.5);
    src.stop(start + duration);
    return src;
  }

  private filter(type: BiquadFilterType, freq: number, q = 0.7) {
    const f = this.ctx!.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  /** A gain that snaps up and dies away exponentially: the shape of every drum stroke. */
  private hitEnv(at: number, peak: number, decay: number) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    return g;
  }

  /** A pitched drum body: a sine that drops from `from` to `to` Hz. */
  private body(at: number, from: number, to: number, glide: number, peak: number, decay: number, send: number, drive = false) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, at);
    o.frequency.exponentialRampToValueAtTime(to, at + glide);
    const g = this.hitEnv(at, peak, decay);
    o.connect(g);
    if (drive) g.connect(this.drive());
    else this.out(g, send);
    o.start(at);
    o.stop(at + decay + 0.05);
  }

  /** A burst of filtered noise: the slap, crack or ring of a stroke. */
  private burst(at: number, type: BiquadFilterType, freq: number, q: number, peak: number, decay: number, send: number, lowpass = 6000) {
    const n = this.noise(at, decay + 0.05);
    if (!n) return;
    const f = this.filter(type, freq, q);
    const lp = this.filter('lowpass', lowpass, 0.5);
    const g = this.hitEnv(at, peak, decay);
    n.connect(f).connect(lp).connect(g);
    this.out(g, send);
  }

  /** Soft clipper that adds harmonics, so the deep hits are still heard on small speakers. */
  private drive() {
    if (!this.saturator && this.ctx) {
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++) {
        const x = (i / (curve.length - 1)) * 2 - 1;
        curve[i] = Math.tanh(x * 3);
      }
      this.saturator = this.ctx.createWaveShaper();
      this.saturator.curve = curve;
      this.out(this.saturator, 0.2);
    }
    return this.saturator!;
  }

  /* ---------------- Drums ---------------- */

  /** Parai: the frame drum of the kuthu beat. A sharp slap, or an open ringing stroke. */
  private parai(at: number, level: number, open: boolean) {
    this.burst(at, 'bandpass', 1700, 1.1, 0.42 * level, open ? 0.12 : 0.055, 0.25, 5000);
    this.body(at, open ? 260 : 330, open ? 200 : 250, 0.05, 0.3 * level, open ? 0.28 : 0.09, 0.2);
  }

  /** Thavil, stick side: a dry, high crack on the backbeat. */
  private thavilCrack(at: number, level: number) {
    this.burst(at, 'bandpass', 2600, 1.4, 0.5 * level, 0.07, 0.3, 6500);
    this.body(at, 520, 400, 0.03, 0.25 * level, 0.1, 0.25);
  }

  /** Thavil, hand side: a deep, round bass stroke. */
  private thavilBass(at: number, level: number) {
    this.body(at, 150, 80, 0.12, 0.55 * level, 0.4, 0.2);
    this.burst(at, 'lowpass', 500, 0.7, 0.18 * level, 0.06, 0.1);
  }

  /** Chenda: the cutting stick drum of the melam, for rolls that build. */
  private chenda(at: number, level: number) {
    this.burst(at, 'bandpass', 2200 + Math.random() * 400, 2.2, 0.45 * level, 0.06, 0.35, 6000);
    this.body(at, 640, 560, 0.02, 0.16 * level, 0.07, 0.3);
  }

  /** Dhol / big bass drum: the boom under the kuthu pattern. */
  private dhol(at: number, level: number) {
    this.body(at, 120, 52, 0.18, 0.75 * level, 0.5, 0.15);
    this.burst(at, 'lowpass', 900, 0.7, 0.2 * level, 0.04, 0.1);
  }

  /** Ilathalam: the small hand cymbals, a closed "chak" or an open "ching". */
  private thalam(at: number, level: number, open: boolean) {
    const ctx = this.ctx!;
    const decay = open ? 0.45 : 0.09;
    [3170, 4310, 5650].forEach((hz, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = hz;
      const g = this.hitEnv(at, (0.035 - i * 0.008) * level, decay * (1 - i * 0.2));
      o.connect(g);
      this.out(g, 0.35);
      o.start(at);
      o.stop(at + decay + 0.05);
    });
    this.burst(at, 'highpass', 5000, 0.7, 0.06 * level, open ? 0.12 : 0.04, 0.2, 9000);
  }

  /** Big taiko-style hit drum for the important moments. */
  private taiko(at: number, level: number) {
    this.body(at, 115, 50, 0.3, 0.7 * level, 0.9, 0.35);
    this.burst(at, 'lowpass', 900, 0.8, 0.5 * level, 0.22, 0.4);
  }

  /* ---------------- Tone ---------------- */

  /** Low drone under the drums (like a sruti box), so the music never goes empty. */
  private drone(at: number, dur: number, notes: number[], level: number, attack: number, release: number) {
    const ctx = this.ctx!;
    const hold = at + Math.max(attack, dur);
    const end = hold + release + 0.05;
    const peak = (0.045 * level) / Math.sqrt(notes.length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(peak, at + attack);
    g.gain.setValueAtTime(peak, hold);
    g.gain.linearRampToValueAtTime(0, hold + release);
    const lp = this.filter('lowpass', 900, 0.5);
    lp.connect(g);
    this.out(g, 0.4);
    notes.forEach((hz) => {
      [-7, 6].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = hz;
        o.detune.value = detune;
        o.connect(lp);
        o.start(at);
        o.stop(end);
      });
    });
  }

  /** Short brass stab on the accents, like a mass film score. */
  private stab(at: number, root: number, level: number, dur: number) {
    const ctx = this.ctx!;
    const lp = this.filter('lowpass', 300, 1.2);
    lp.frequency.setValueAtTime(300, at);
    lp.frequency.exponentialRampToValueAtTime(2400, at + 0.04);
    lp.frequency.exponentialRampToValueAtTime(500, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.08 * level, at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    lp.connect(g);
    this.out(g, 0.35);
    [1, 1.5, 2, 3].forEach((mult) => {
      [-10, 9].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = root * mult;
        o.detune.value = detune;
        o.connect(lp);
        o.start(at);
        o.stop(at + dur + 0.05);
      });
    });
  }

  /** The trailer "braam": a wall of low brass that tears open and slowly closes. */
  private braam(at: number, root: number, level: number, dur: number) {
    const ctx = this.ctx!;
    const lp = this.filter('lowpass', 160, 1.5);
    lp.frequency.setValueAtTime(160, at);
    lp.frequency.exponentialRampToValueAtTime(1500, at + 0.25);
    lp.frequency.exponentialRampToValueAtTime(380, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.09 * level, at + 0.04);
    g.gain.setValueAtTime(0.09 * level, at + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    lp.connect(g);
    g.connect(this.drive());
    const s = ctx.createGain();
    s.gain.value = 0.4;
    g.connect(s).connect(this.verb!);
    [1, 1.5, 2, 3, 4].forEach((mult) => {
      [-12, 10].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = root * mult;
        o.detune.value = detune;
        o.connect(lp);
        o.start(at);
        o.stop(at + dur + 0.05);
      });
    });
  }

  /** Sub drop under the big hits: felt as much as heard. */
  private boom(at: number, level: number) {
    const ctx = this.ctx!;
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, at);
    sub.frequency.exponentialRampToValueAtTime(36, at + 0.6);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, at);
    sg.gain.exponentialRampToValueAtTime(0.5 * level, at + 0.006);
    sg.gain.setValueAtTime(0.5 * level, at + 0.25);
    sg.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);
    sub.connect(sg).connect(this.drive());
    sub.start(at);
    sub.stop(at + 1.9);
  }

  /** Rising tone into a hit. */
  private riser(at: number, length: number, level: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(110, at);
    o.frequency.exponentialRampToValueAtTime(880, at + length);
    const lp = this.filter('lowpass', 700, 2);
    lp.frequency.setValueAtTime(400, at);
    lp.frequency.exponentialRampToValueAtTime(2600, at + length);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, at);
    og.gain.exponentialRampToValueAtTime(0.045 * level, at + length * 0.95);
    og.gain.linearRampToValueAtTime(0, at + length + 0.02);
    o.connect(lp).connect(og);
    this.out(og, 0.3);
    o.start(at);
    o.stop(at + length + 0.05);
  }

  /** Reverse-cymbal swell: air that rises and cuts off exactly on the hit. */
  private swell(at: number, length: number, level: number) {
    const ctx = this.ctx!;
    const n = this.noise(at, length + 0.02);
    if (!n) return;
    const bp = this.filter('bandpass', 400, 0.6);
    bp.frequency.setValueAtTime(400, at);
    bp.frequency.exponentialRampToValueAtTime(3200, at + length);
    const lp = this.filter('lowpass', 4500, 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.2 * level, at + length);
    g.gain.linearRampToValueAtTime(0, at + length + 0.02);
    n.connect(bp).connect(lp).connect(g);
    this.out(g, 0.3);
  }

  /** Countdown: a thavil crack every second, with the big drum under the last three. */
  tick(secondsLeft: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.thavilCrack(now, secondsLeft <= 3 ? 1 : 0.7);
    this.thalam(now, 0.6, false);
    if (secondsLeft <= 3) this.taiko(now, 0.7);
  }

  /** Fade everything out at the handoff. */
  finish() {
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(0, t + 2, 0.8);
    }
  }

  dispose() {
    const ctx = this.ctx as AudioContext | null;
    void ctx?.close?.();
    this.ctx = null;
    this.master = null;
  }
}
