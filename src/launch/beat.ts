/**
 * The beat for the launch film, as a list of timed drum and bass hits.
 * Built from the chapter timeline so the music always lines up with the picture.
 */

import { BEAT, CH, IMPACTS } from './timeline';

export type BeatKind = 'kick' | 'kickSoft' | 'snare' | 'hat' | 'bass' | 'impact' | 'riser' | 'drop';

export interface BeatEvent {
  at: number;
  kind: BeatKind;
  /** snare: level 0..1 · bass: frequency in Hz · riser: length in seconds */
  value?: number;
}

const events: BeatEvent[] = [];
const BASS_ROOTS = [55, 55, 65.41, 49]; // A, A, C, G: one root per bar

/** Four-on-the-floor groove between two times. */
function groove(from: number, to: number, opts: { hats?: boolean; bass?: boolean } = {}) {
  for (let t = from, beat = 0; t < to - 1e-6; t += BEAT, beat++) {
    events.push({ at: t, kind: 'kick' });
    if (beat % 2 === 1) events.push({ at: t, kind: 'snare', value: 1 });
    if (opts.hats) events.push({ at: t + BEAT / 2, kind: 'hat' });
    if (opts.bass) {
      const root = BASS_ROOTS[Math.floor(beat / 4) % BASS_ROOTS.length];
      events.push({ at: t, kind: 'bass', value: root });
      events.push({ at: t + BEAT / 2, kind: 'bass', value: beat % 4 === 3 ? root * 1.5 : root });
    }
  }
}

/** Snare roll that speeds up and gets louder into a drop. */
function roll(from: number, to: number) {
  let t = from;
  while (t < to - 1e-6) {
    const p = (t - from) / (to - from);
    events.push({ at: t, kind: 'snare', value: 0.3 + p * 0.7 });
    t += p < 0.5 ? BEAT / 2 : BEAT / 4;
  }
}

// Memory: a slow heartbeat
for (let t = CH.memory + 2; t < CH.montage; t += 2) events.push({ at: t, kind: 'kickSoft' });

// Montage: the beat arrives, then builds into the blackout
groove(CH.montage, CH.montage + 4);
groove(CH.montage + 4, CH.blackout - 2, { bass: true, hats: true });
for (let t = CH.blackout - 2; t < CH.blackout; t += BEAT) events.push({ at: t, kind: 'kick' });
roll(CH.blackout - 2, CH.blackout);
events.push({ at: CH.blackout - 4, kind: 'riser', value: 4 });

// Blackout: silence, one hit under the line, then a riser into the drop
events.push({ at: CH.blackout + 2, kind: 'impact' });
events.push({ at: CH.drop - 2, kind: 'riser', value: 2 });

/**
 * One drop section, trailer style: it lands with a DROP, the beat rides for a few
 * beats, then a build (kicks doubling up, snare roll, rising tone), then a half-beat
 * of total silence so the next drop hits hard.
 */
function dropSection(from: number, to: number) {
  events.push({ at: from, kind: 'drop' });
  const buildStart = to - 2;
  groove(from, buildStart, { bass: true, hats: true });
  // build: kicks on every beat, then every half beat
  for (let t = buildStart; t < to - 1 - 1e-6; t += BEAT) events.push({ at: t, kind: 'kick' });
  for (let t = to - 1; t < to - BEAT - 1e-6; t += BEAT / 2) events.push({ at: t, kind: 'kick' });
  roll(buildStart, to - BEAT);
  events.push({ at: buildStart, kind: 'riser', value: 2 - BEAT });
  // to - BEAT .. to: silence
}

// NEXUS IS BACK → CHRIST → Department → CAADS → worlds: a drop on every one
dropSection(CH.drop, CH.institution);
for (let i = 0; i < 3; i++) {
  const at = CH.institution + i * CH.logoDur;
  dropSection(at, at + CH.logoDur);
}

// Worlds: lands on a drop, then full beat
events.push({ at: CH.worlds, kind: 'drop' });
groove(CH.worlds, CH.converge, { bass: true, hats: true });

// Convergence: stripped back to one kick a bar
for (let t = CH.converge; t < CH.dates; t += 2) {
  events.push({ at: t, kind: 'kick' });
  events.push({ at: t, kind: 'bass', value: BASS_ROOTS[0] });
}

// Dates: beat back in, then a build while the logo assembles
groove(CH.dates, CH.logo, { bass: true, hats: true });
for (let t = CH.logo; t < CH.hit; t += BEAT) events.push({ at: t, kind: 'kick' });
roll(CH.hit - 1.5, CH.hit);
events.push({ at: CH.logo, kind: 'riser', value: CH.hit - CH.logo });

// Final drop under the logo
groove(CH.hit, CH.hit + 4.5, { bass: true, hats: true });

IMPACTS.forEach((at) => events.push({ at, kind: 'impact' }));

export const BEAT_EVENTS: BeatEvent[] = events.sort((a, b) => a.at - b.at);
