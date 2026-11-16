/**
 * The music for the launch film: a 120 BPM track in A minor, written as timed events.
 * Built from the chapter timeline so every hit lines up with the picture.
 *
 * Nothing sustains: melody is plucked, bass is short 808 notes, so there is no hum.
 * Chords change every bar (2s): Am – F – C – G.
 */

import { BEAT, CH, IMPACTS } from './timeline';

export type BeatKind =
  | 'kick'
  | 'kickSoft'
  | 'snare'
  | 'clap'
  | 'hat'
  | 'bass'
  | 'sub'
  | 'pluck'
  | 'impact'
  | 'riser'
  | 'drop';

export interface BeatEvent {
  at: number;
  kind: BeatKind;
  /** pitch in Hz (bass, sub, pluck) · level 0..1 (snare) · length in s (riser) */
  value?: number;
  /** loudness 0..1 for plucks and hats */
  level?: number;
}

const events: BeatEvent[] = [];
const add = (at: number, kind: BeatKind, value?: number, level?: number) => events.push({ at, kind, value, level });

const BAR = BEAT * 4;
const SIXTEENTH = BEAT / 4;

/* ---------- Harmony ---------- */

// Am, F, C, G: chord tones for the plucks and an 808 root for each bar
const CHORDS = [
  { root: 55, tones: [220, 261.63, 329.63, 440] },
  { root: 43.65, tones: [174.61, 220, 261.63, 349.23] },
  { root: 65.41, tones: [261.63, 329.63, 392, 523.25] },
  { root: 49, tones: [196, 246.94, 293.66, 392] },
];
const chordAt = (t: number) => CHORDS[Math.floor(t / BAR + 1e-6) % CHORDS.length];

// Arpeggio shape: up through the chord and back
const ARP = [0, 1, 2, 3, 2, 1, 2, 1];

function arp(from: number, to: number, step: number, level: number) {
  let i = 0;
  for (let t = from; t < to - 1e-6; t += step, i++) {
    const c = chordAt(t);
    add(t, 'pluck', c.tones[ARP[i % ARP.length]], level);
  }
}

/* ---------- Drum patterns ---------- */

/** Four-on-the-floor: kick every beat, clap on 2 and 4, an 808 on each kick. */
function fourFloor(from: number, to: number, opts: { clap?: boolean; sub?: boolean; hats?: boolean } = {}) {
  for (let t = from, b = 0; t < to - 1e-6; t += BEAT, b++) {
    add(t, 'kick');
    if (opts.clap && b % 2 === 1) add(t, 'clap');
    if (opts.sub) add(t, 'sub', chordAt(t).root);
    if (opts.hats) add(t + BEAT / 2, 'hat', undefined, 0.8);
  }
}

/**
 * Half-time trap bar: kick on 1 and the "and" of 2, clap on 3, 808 on the kicks,
 * eighth-note hats with a quick roll at the end of every second bar.
 */
function trap(from: number, to: number) {
  for (let bar = from, n = 0; bar < to - 1e-6; bar += BAR, n++) {
    const root = chordAt(bar).root;
    const end = Math.min(bar + BAR, to);
    const hit = (offset: number, kind: BeatKind, value?: number, level?: number) => {
      if (bar + offset < end - 1e-6) add(bar + offset, kind, value, level);
    };
    hit(0, 'kick');
    hit(0, 'sub', root);
    hit(BEAT * 1.5, 'kick');
    hit(BEAT * 1.5, 'sub', root);
    hit(BEAT * 2, 'clap');
    hit(BEAT * 3.25, 'kick');
    hit(BEAT * 3.25, 'sub', root * 1.5);
    for (let h = 0; h < 8; h++) hit(h * (BEAT / 2), 'hat', undefined, h % 2 ? 0.6 : 1);
    if (n % 2 === 1) for (let r = 0; r < 4; r++) hit(BEAT * 3 + r * SIXTEENTH, 'hat', undefined, 0.5 + r * 0.15);
  }
}

/** Snare roll that speeds up and gets louder into a drop. */
function roll(from: number, to: number) {
  let t = from;
  while (t < to - 1e-6) {
    const p = (t - from) / (to - from);
    add(t, 'snare', 0.3 + p * 0.7);
    t += p < 0.5 ? BEAT / 2 : SIXTEENTH;
  }
}

/** Build into a drop, then leave `gap` seconds of silence before `to`. */
function build(from: number, to: number, gap = BEAT) {
  for (let t = from; t < to - gap - 1e-6; t += t < to - 1 ? BEAT : BEAT / 2) add(t, 'kick');
  roll(from, to - gap);
  add(from, 'riser', to - gap - from);
}

/* ---------- The track ---------- */

// Memory: a soft plucked melody over a heartbeat
arp(CH.memory + 0.5, CH.montage, BEAT, 0.35);
for (let t = CH.memory + 2; t < CH.montage; t += BAR) add(t, 'kickSoft');

// Montage: melody doubles, the beat arrives, then builds into the blackout
arp(CH.montage, CH.blackout - 2, BEAT / 2, 0.45);
fourFloor(CH.montage, CH.montage + 4);
fourFloor(CH.montage + 4, CH.blackout - 2, { clap: true, sub: true, hats: true });
build(CH.blackout - 2, CH.blackout, 0);

// Blackout: silence, one hit under the line, then a riser into the drop
add(CH.blackout + 2, 'impact');
add(CH.drop - 2, 'riser', 2);

/** Drop, a bar of trap with the melody on top, then a build and a silent gap. */
function dropSection(from: number, to: number) {
  add(from, 'drop');
  const buildStart = to - BAR + BEAT;
  trap(from, buildStart);
  arp(from, buildStart, BEAT / 2, 0.3);
  build(buildStart, to);
}

// NEXUS IS BACK → CHRIST → Department → CAADS: a drop on every one
dropSection(CH.drop, CH.institution);
for (let i = 0; i < 3; i++) {
  const at = CH.institution + i * CH.logoDur;
  dropSection(at, at + CH.logoDur);
}

// Worlds: a drop at every planet, trap groove, a one-beat break before the next
for (let i = 0; i < 3; i++) {
  const from = CH.worlds + i * CH.worldDur;
  const to = from + CH.worldDur;
  add(from, 'drop');
  trap(from, to - BEAT * 2);
  arp(from, to - BEAT * 2, BEAT / 2, 0.3);
  roll(to - BEAT * 2, to - BEAT);
}

// Convergence: the melody alone, with a kick and an 808 once a bar
arp(CH.converge, CH.dates, BEAT / 2, 0.45);
for (let t = CH.converge; t < CH.dates; t += BAR) {
  add(t, 'kick');
  add(t, 'sub', chordAt(t).root);
}

// Dates: the groove returns
trap(CH.dates, CH.logo);
arp(CH.dates, CH.logo, BEAT / 2, 0.35);

// The logo assembles over a build, then the final drop
build(CH.logo, CH.hit);
add(CH.hit, 'drop');
trap(CH.hit, CH.hit + BAR * 2);
arp(CH.hit, CH.hit + BAR * 2 + BEAT * 2, BEAT / 2, 0.35);

IMPACTS.forEach((at) => add(at, 'impact'));

export const BEAT_EVENTS: BeatEvent[] = events.sort((a, b) => a.at - b.at);
