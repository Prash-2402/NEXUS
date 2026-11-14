/**
 * The launch film, in seconds after ignition. Both the 3D camera path
 * (SpaceEngine.launchFrame) and the title cards (Cinematic) read from here,
 * so changing a number moves picture and text together.
 */

export const COUNTDOWN = 10;

export const CH = {
  ignition: 0,
  warp: 1,
  // Slow drift through the nebula while the institution cards play
  institution: 7.5,
  // Fly past the three worlds, one chapter each
  worlds: 23,
  worldDur: 8.5,
  // Planets pull into orbit around the core
  converge: 48.5,
  // Hold on the system for the dates
  dates: 56.5,
  // Logo assembles from particles
  logo: 64.5,
  hit: 67.8,
  tagline: 68.6,
  line: 70.2,
  handoff: 73.5,
  finished: 76,
} as const;

export const WARP_LINES: Array<{ at: number; end: number; text: string }> = [
  { at: 1.4, end: 3.3, text: 'Everything begins with a spark.' },
  { at: 3.5, end: 5.3, text: 'It gathers others.' },
  { at: 5.5, end: 7.3, text: 'Until worlds collide.' },
];

export const INSTITUTION_CARDS = {
  christ: { at: 8.0, end: 13.0 },
  department: { at: 13.3, end: 18.0 },
  caads: { at: 18.3, end: 22.8 },
} as const;

export const CONVERGE_LINES = [
  { at: 49.5, end: 52.8, text: 'Different worlds.' },
  { at: 53.0, end: 56.2, text: 'One universe.' },
];

export const DATES_CARD = { at: 57.2, end: 64.0 };

export const worldWindow = (index: number) => ({
  at: CH.worlds + index * CH.worldDur + 0.6,
  end: CH.worlds + (index + 1) * CH.worldDur - 0.3,
});
