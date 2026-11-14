/**
 * The launch film, in seconds after ignition. The 3D camera path
 * (SpaceEngine.launchFrame), the title cards (Cinematic) and the voiceover all
 * read from here, so changing a number moves picture, text and voice together.
 */

import { siteConfig } from '../config/site';
import { worldOrder, worlds } from '../data/events';

export const COUNTDOWN = 10;

/** Seconds each logo card stays up. */
const LOGO_CARD = 2.8;
const LOGO_GAP = 0.2;
const INSTITUTION_START = 7.5;
const WORLDS_START = INSTITUTION_START + 0.5 + 3 * (LOGO_CARD + LOGO_GAP) + 0.5;
const WORLD_DUR = 8.5;
const CONVERGE = WORLDS_START + 3 * WORLD_DUR;
const DATES = CONVERGE + 8;
const LOGO = DATES + 8;

export const CH = {
  ignition: 0,
  warp: 1,
  // Slow drift through the nebula while the institution cards play
  institution: INSTITUTION_START,
  // Fly past the three worlds, one chapter each
  worlds: WORLDS_START,
  worldDur: WORLD_DUR,
  // Planets pull into orbit around the core
  converge: CONVERGE,
  // Hold on the system for the dates
  dates: DATES,
  // Logo assembles from particles
  logo: LOGO,
  hit: LOGO + 3.3,
  tagline: LOGO + 4.1,
  line: LOGO + 5.7,
  handoff: LOGO + 9,
  finished: LOGO + 11.5,
} as const;

export const WARP_LINES: Array<{ at: number; end: number; text: string }> = [
  { at: 1.4, end: 3.3, text: 'Everything begins with a spark.' },
  { at: 3.5, end: 5.3, text: 'It gathers others.' },
  { at: 5.5, end: 7.3, text: 'Until worlds collide.' },
];

const card = (index: number) => {
  const at = INSTITUTION_START + 0.5 + index * (LOGO_CARD + LOGO_GAP);
  return { at, end: at + LOGO_CARD };
};

export const INSTITUTION_CARDS = {
  christ: card(0),
  department: card(1),
  caads: card(2),
} as const;

export const CONVERGE_LINES = [
  { at: CONVERGE + 1, end: CONVERGE + 4.3, text: 'Different worlds.' },
  { at: CONVERGE + 4.5, end: CONVERGE + 7.7, text: 'One universe.' },
];

export const DATES_CARD = { at: DATES + 0.7, end: DATES + 7.5 };

export const worldWindow = (index: number) => ({
  at: CH.worlds + index * CH.worldDur + 0.6,
  end: CH.worlds + (index + 1) * CH.worldDur - 0.3,
});

/**
 * Voiceover: what is spoken and when. Written the way it should be said,
 * so edit the spelling here if a name is pronounced wrongly.
 */
const ordinal = ['one', 'two', 'three'];

export const VOICE_LINES: Array<{ at: number; text: string }> = [
  ...WARP_LINES.map((l) => ({ at: l.at, text: l.text })),
  { at: INSTITUTION_CARDS.christ.at + 0.2, text: 'Hosted at Christ University.' },
  { at: INSTITUTION_CARDS.department.at + 0.2, text: 'The Department of A.I. and Data Science.' },
  { at: INSTITUTION_CARDS.caads.at + 0.2, text: 'Cads presents.' },
  ...worldOrder.map((id, i) => ({
    at: worldWindow(i).at + 0.3,
    text: `World ${ordinal[i]}. ${worlds[id].title}. ${worlds[id].line}`,
  })),
  ...CONVERGE_LINES.map((l) => ({ at: l.at, text: l.text })),
  { at: DATES_CARD.at + 0.3, text: `${siteConfig.dates.display.replace('–', 'to')}.` },
  { at: CH.hit + 0.4, text: `Nexus. ${siteConfig.tagline}.` },
];
