/**
 * The launch film ("NEXUS is back"), in seconds after the countdown ends.
 * The 3D camera path (SpaceEngine.launchFrame), the title cards (Cinematic),
 * and the beat (beat.ts) all read from here.
 *
 * Everything sits on a 120 BPM grid: one beat is 0.5s, one bar is 2s.
 */

import { worldOrder } from '../data/events';

export const COUNTDOWN = 10;
export const BEAT = 0.5;

export const CH = {
  // Last year's photos drift past, slow and quiet
  memory: 0,
  // Photos cut on every beat while the beat builds
  montage: 12,
  // Hard cut to black, one line
  blackout: 22,
  // "NEXUS IS BACK": flash, warp, the beat drops
  drop: 28,
  // CHRIST, Department, CAADS: two bars each, every logo lands on a drop
  institution: 32,
  logoDur: 4,
  // Fly past the three worlds, three bars each
  worlds: 44,
  worldDur: 6,
  // Planets pull into orbit around the core
  converge: 62,
  dates: 68,
  // Logo assembles from particles, locks in on the final drop
  logo: 76,
  hit: 79,
  tagline: 79.8,
  line: 81.4,
  handoff: 84.5,
  finished: 87,
} as const;

export interface TimedText {
  at: number;
  end: number;
  text: string;
}

export const MEMORY_CAPTION: TimedText = { at: 0.8, end: CH.montage - 0.4, text: 'Last year' };

export const MONTAGE_WORDS: TimedText[] = [
  { at: 13, end: 15.5, text: 'The nights.' },
  { at: 16, end: 18.5, text: 'The noise.' },
  { at: 19, end: 21.6, text: 'The wins.' },
];

export const BLACKOUT_LINE: TimedText = { at: 24, end: 27.5, text: 'It never really ended.' };

export const DROP_WORDS = [
  { at: CH.drop, text: 'NEXUS' },
  { at: CH.drop + 0.75, text: 'IS' },
  { at: CH.drop + 1.5, text: 'BACK.' },
];
export const DROP_END = CH.institution - 0.3;

const card = (index: number) => {
  const at = CH.institution + index * CH.logoDur;
  return { at, end: at + CH.logoDur - 0.2 };
};

export const INSTITUTION_CARDS = {
  christ: card(0),
  department: card(1),
  caads: card(2),
} as const;

export const worldWindow = (index: number) => ({
  at: CH.worlds + index * CH.worldDur + 0.1,
  end: CH.worlds + (index + 1) * CH.worldDur - 0.2,
});

export const CONVERGE_LINES: TimedText[] = [
  { at: CH.converge + 1, end: CH.converge + 3.3, text: 'Different worlds.' },
  { at: CH.converge + 3.5, end: CH.converge + 5.8, text: 'One universe.' },
];

export const DATES_CARD = { at: CH.dates, end: CH.logo - 0.4 };

/** Moments that get a bass impact, a camera shake and a small flash. */
export const IMPACTS: number[] = [
  CH.drop,
  INSTITUTION_CARDS.christ.at,
  INSTITUTION_CARDS.department.at,
  INSTITUTION_CARDS.caads.at,
  ...worldOrder.map((_, i) => CH.worlds + i * CH.worldDur),
  ...CONVERGE_LINES.map((l) => l.at),
  CH.dates,
  CH.hit,
];
