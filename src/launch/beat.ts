/**
 * The score for the launch film: South Indian mass percussion, written as timed events.
 *
 * A kuthu groove on parai, thavil, dhol and ilathalam runs the whole way through and gets
 * heavier chapter by chapter. Chenda rolls build into every big moment, and the hits
 * (brass, sub drop, taiko) land exactly on the blackout, NEXUS IS BACK, each logo, each planet,
 * the lines, the dates and the final logo. A low drone underneath keeps it from ever going empty.
 *
 * Everything sits on the film's 120 BPM grid: a 16th is 0.125 s, a bar (16 steps) is 2 s.
 * All times come from timeline.ts, so the music stays locked to the picture.
 */

import { BEAT, CH, CONVERGE_LINES, DROP_WORDS } from './timeline';

export type BeatKind =
  | 'drone'
  | 'parai'
  | 'thavil'
  | 'chenda'
  | 'dhol'
  | 'thalam'
  | 'stab'
  | 'taiko'
  | 'braam'
  | 'boom'
  | 'riser'
  | 'swell';

export interface BeatEvent {
  at: number;
  kind: BeatKind;
  /** loudness, about 0..1.5 */
  level?: number;
  /** open stroke: ringing parai, thavil bass side, open "ching" on the ilathalam */
  open?: boolean;
  /** pitch in Hz (stab, braam root) */
  hz?: number;
  /** chord notes in Hz (drone) */
  notes?: number[];
  /** length in seconds */
  dur?: number;
  attack?: number;
  release?: number;
}

const events: BeatEvent[] = [];
const add = (e: BeatEvent) => events.push(e);

const STEP = BEAT / 4; // a 16th
const A2 = 110;

/** Small, repeatable variation in loudness so the drums feel played, not programmed. */
let seed = 7;
const feel = () => {
  seed = (seed * 16807) % 2147483647;
  return 0.88 + ((seed % 1000) / 1000) * 0.24;
};

/* ---------- The groove ---------- */

/**
 * Kuthu groove, one 16th at a time. Energy 1 is a heartbeat, 4 is full mass.
 *   1: dhol on 1 and 3, ilathalam on the beat
 *   2: + thavil bass on the 3-3-2 kuthu accents, thavil crack on the backbeat, "ching-chak"
 *   3: + parai slaps between the accents
 *   4: + parai ghost notes everywhere, chenda pickups, brass stabs on the accents
 */
function groove(from: number, to: number, energy: number, level = 1) {
  const steps = Math.round((to - from) / STEP);
  for (let i = 0; i < steps; i++) {
    const at = from + i * STEP;
    const s = i % 16;
    const bar = Math.floor(i / 16);
    const v = (x: number) => x * level * feel();

    // dhol on beats 1 and 3
    if (s === 0 || s === 8) add({ at, kind: 'dhol', level: v(1) });
    // ilathalam: open ching on the beat, closed chak on the off-beat
    if (s % 4 === 0) add({ at, kind: 'thalam', open: energy >= 2, level: v(0.8) });
    else if (s % 4 === 2 && energy >= 2) add({ at, kind: 'thalam', level: v(0.55) });

    if (energy >= 2) {
      // thavil bass on the kuthu accents (3+3+2, twice a bar)
      if ([3, 6, 11, 14].includes(s)) add({ at, kind: 'thavil', open: true, level: v(0.8) });
      // thavil crack on the backbeat
      if (s === 4 || s === 12) add({ at, kind: 'thavil', level: v(1) });
    }
    if (energy >= 3) {
      if ([2, 7, 10, 15].includes(s)) add({ at, kind: 'parai', level: v(0.8) });
      if ([5, 13].includes(s)) add({ at, kind: 'parai', open: true, level: v(0.75) });
      if ([1, 9].includes(s)) add({ at, kind: 'parai', level: v(0.35) });
    }
    if (energy >= 4) {
      if ([0, 3, 6, 8, 11, 14].includes(s)) add({ at, kind: 'parai', level: v(0.3) });
      // chenda pickup into the next bar
      if (s === 15) add({ at, kind: 'chenda', level: v(0.6) });
      if (s === 15 || s === 14) add({ at: at + STEP / 2, kind: 'chenda', level: v(0.5) });
      // brass stabs: dum-dum-dum on the kuthu accents every other bar
      if (bar % 2 === 0 && [0, 3, 6].includes(s)) add({ at, kind: 'stab', hz: A2, level: v(0.75), dur: 0.3 });
      if (bar % 2 === 1 && s === 0) add({ at, kind: 'stab', hz: A2, level: v(0.75), dur: 0.5 });
    }
  }
}

/** Chenda roll that speeds up and gets louder into a hit, with the big drum underneath. */
function roll(from: number, to: number, levelFrom = 0.4, levelTo = 1.2) {
  let t = from;
  let i = 0;
  while (t < to - 0.02) {
    const p = (t - from) / (to - from);
    add({ at: t, kind: 'chenda', level: levelFrom + (levelTo - levelFrom) * p });
    if (i % 4 === 0) add({ at: t, kind: 'dhol', level: 0.5 + p * 0.6 });
    t += p < 0.35 ? STEP : p < 0.75 ? STEP / 2 : STEP / 4;
    i++;
  }
}

/* ---------- Hits ---------- */

/** The biggest moments: brass wall, sub drop, the big drum, a crash of ilathalam. */
function bigHit(at: number, root = 55) {
  add({ at, kind: 'braam', hz: root, dur: 2.6, level: 1 });
  add({ at, kind: 'boom', level: 1 });
  add({ at, kind: 'taiko', level: 1.3 });
  add({ at, kind: 'dhol', level: 1.2 });
  add({ at, kind: 'stab', hz: root * 2, level: 1, dur: 0.8 });
  add({ at, kind: 'thalam', open: true, level: 1.2 });
}

/** Logos and lines: big drum, sub, a stab and a ching. */
function hit(at: number) {
  add({ at, kind: 'taiko', level: 1.1 });
  add({ at, kind: 'boom', level: 0.6 });
  add({ at, kind: 'stab', hz: A2, level: 0.9, dur: 0.6 });
  add({ at, kind: 'thalam', open: true, level: 1 });
}

/** Rising air and tone into a hit. */
function lift(at: number, length: number, level = 1) {
  add({ at: at - length, kind: 'swell', dur: length, level });
  add({ at: at - length, kind: 'riser', dur: length, level: level * 0.8 });
}

/* ---------- The drone ---------- */

/** Low A drone (with its fifth) in overlapping eight-second pieces, so it never stops. */
for (let t = CH.memory; t < CH.hit; t += 8) {
  add({ at: t, kind: 'drone', notes: [A2, 164.81, 220], dur: Math.min(8, CH.hit - t), level: 0.7, attack: t === 0 ? 0.8 : 1.5, release: 2 });
}

/* ---------- The score ---------- */

// Memory (0-12): the groove starts straight away and builds as the photos drift past
groove(CH.memory, 4, 2, 0.7);
groove(4, 8, 2, 0.85);
groove(8, CH.montage, 3, 0.9);

// Montage (12-22): full kuthu on the photo cuts, then a chenda roll into the blackout
groove(CH.montage, 20, 4);
groove(20, CH.blackout, 2, 0.8);
roll(20, CH.blackout, 0.4, 1.3);
lift(CH.blackout, 1.5);

// Blackout (22-28): one huge hit on the cut, a low groove in the dark, then the build
bigHit(CH.blackout);
groove(CH.blackout + 0.5, 26, 2, 0.6);
add({ at: 24, kind: 'taiko', level: 0.7 });
groove(26, CH.drop, 2, 0.8);
roll(26, CH.drop, 0.3, 1.4);
lift(CH.drop, 2, 1.2);

// NEXUS IS BACK (28-32): the drop, a hit on each word, then full mass
bigHit(CH.drop);
DROP_WORDS.slice(1).forEach((w) => {
  add({ at: w.at, kind: 'taiko', level: 1.1 });
  add({ at: w.at, kind: 'stab', hz: A2, level: 1, dur: 0.4 });
});
// keep the pulse going under the words, then the full groove
for (let t = CH.drop + 0.5; t < CH.drop + 2 - 1e-6; t += BEAT / 2) {
  add({ at: t, kind: 'dhol', level: 0.7 });
  add({ at: t, kind: 'thalam', open: true, level: 0.6 });
}
roll(CH.drop + 1.5, CH.drop + 2, 0.6, 1);
groove(CH.drop + 2, CH.worlds, 4);

// CHRIST, Department, CAADS (32-44): a short chenda roll into each logo, a hit as it lands
for (let i = 0; i < 3; i++) {
  const at = CH.institution + i * CH.logoDur;
  roll(at - 0.75, at, 0.5, 1.1);
  lift(at, 1, 0.7);
  hit(at);
}

// The worlds (44-62): heaviest groove, a big hit on each planet
groove(CH.worlds, CH.converge, 4, 1.1);
for (let i = 0; i < 3; i++) {
  const at = CH.worlds + i * CH.worldDur;
  if (i > 0) {
    roll(at - 1, at, 0.5, 1.3);
    lift(at, 1.5);
  }
  bigHit(at, [55, 43.65, 65.41][i]);
}

// Convergence (62-68): the groove opens up so the lines land, a hit on each line
groove(CH.converge, 64, 2, 0.9);
groove(64, CH.dates, 3, 1);
CONVERGE_LINES.forEach((l) => hit(l.at));

// Dates (68-76): full mass again
hit(CH.dates);
groove(CH.dates, CH.logo, 4, 1.1);

// The logo assembles (76-79): one long chenda roll, the big drum on every beat, into the final hit
roll(CH.logo, CH.hit, 0.4, 1.5);
for (let t = CH.logo; t < CH.hit - 1e-6; t += BEAT) add({ at: t, kind: 'dhol', level: 0.6 + ((t - CH.logo) / (CH.hit - CH.logo)) * 0.7 });
lift(CH.hit, CH.hit - CH.logo, 1.3);

// The final hit (79): A major, the groove under the tagline, then three closing hits
bigHit(CH.hit);
add({ at: CH.hit, kind: 'drone', notes: [A2, 220, 277.18, 329.63], dur: 5, level: 1, attack: 0.1, release: 2.5 });
groove(CH.hit + 0.5, CH.handoff - 1.5, 4, 0.95);
[CH.handoff - 1.5, CH.handoff - 1, CH.handoff - 0.5].forEach((at, i) => {
  add({ at, kind: 'taiko', level: 1 + i * 0.15 });
  add({ at, kind: 'stab', hz: A2, level: 1, dur: i === 2 ? 1.2 : 0.35 });
  add({ at, kind: 'thalam', open: true, level: 1 });
});
add({ at: CH.handoff - 0.5, kind: 'boom', level: 1 });

export const BEAT_EVENTS: BeatEvent[] = events.sort((a, b) => a.at - b.at);
