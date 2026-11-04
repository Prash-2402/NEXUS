/**
 * NEXUS — events.
 * The schedule is built from the `sessions` of each event, so dates only live here.
 * Unannounced details are marked "To be announced" rather than invented.
 */


import { siteConfig } from '../config/site';

export type WorldId = 'technical' | 'non-technical' | 'cultural';
export type EventFilter = 'all' | WorldId;

export interface EventSession {
  date: string; // YYYY-MM-DD
  time: string; // e.g. "9:00 AM – 1:00 PM"
  venue?: string; // overrides the event venue for this day
  label?: string; // e.g. "Kickoff", "Day 1"
}

export interface NexusEvent {
  id: string;
  name: string;
  world: WorldId;
  summary: string;
  description: string;
  format: string;
  eligibility: string;
  sessions: EventSession[];
  venue: string;
  poc?: string;
  note?: string;
  registrationEnabled: boolean;
  registrationUrl: string;
}

export interface WorldInfo {
  id: WorldId;
  index: string;
  title: string;
  worldName: string;
  line: string;
  description: string;
  color: string;
}

export const worlds: Record<WorldId, WorldInfo> = {
  technical: {
    id: 'technical',
    index: '01',
    title: 'Technical',
    worldName: 'World of Synthesis',
    line: 'Build, break and decode.',
    description:
      'Murder mysteries, cipher hunts, reverse engineering and hands-on workshops for people who like to look under the hood.',
    color: '#6EA8FF',
  },
  'non-technical': {
    id: 'non-technical',
    index: '02',
    title: 'Non-Technical',
    worldName: 'World of Strategy',
    line: 'Think fast, play smart.',
    description:
      'The NEXUS Olympics, Family Feud, esports and Shark Tank. Quick wit, teamwork and nerve under pressure.',
    color: '#A78BFA',
  },
  cultural: {
    id: 'cultural',
    index: '03',
    title: 'Cultural',
    worldName: 'World of Resonance',
    line: 'Take the stage.',
    description:
      'Song, dance and an open talent show. A stage for everything that does not fit in a spreadsheet.',
    color: '#F5C451',
  },
};

export const worldOrder: WorldId[] = ['technical', 'non-technical', 'cultural'];

const form = (id: string) => siteConfig.registration.eventForms[id] ?? '';

export const eventsData: NexusEvent[] = [
  // Technical
  {
    id: 'tableau-workshop',
    name: 'Tableau Workshop',
    world: 'technical',
    summary: 'A hands-on session on turning raw data into clear, interactive dashboards with Tableau.',
    description:
      'Learn the Tableau workflow from the ground up: connecting data, building calculated fields, designing dashboards and telling a story with your visuals. Bring a laptop and leave with a working dashboard.',
    format: 'Hands-on workshop',
    eligibility: 'Open to all students. Prior registration required.',
    sessions: [{ date: '2026-11-21', time: '9:00 AM – 1:00 PM' }],
    venue: 'Amoga Hall',
    poc: 'Swetha & Prajwal S',
    note: 'Setup instructions and software requirements will be emailed to registered attendees.',
    registrationEnabled: true,
    registrationUrl: form('tableau-workshop'),
  },
  {
    id: 'murder-mystery',
    name: 'Murder Mystery',
    world: 'technical',
    summary: 'A staged crime scene. Follow the evidence, question the suspects and name the culprit.',
    description:
      'Work through forensic clues, conflicting testimonies and hidden motives. Teams that read the evidence best and reason fastest crack the case.',
    format: 'Team investigation',
    eligibility: 'Open to all registered participants.',
    sessions: [{ date: '2026-11-23', time: '9:00 AM – 4:00 PM' }],
    venue: 'Multipurpose Hall, Devdan',
    poc: 'Swetha & Prajwal S',
    note: 'Case briefings are handed out at the scene.',
    registrationEnabled: true,
    registrationUrl: form('murder-mystery'),
  },
  {
    id: 'cryptic-hunt',
    name: 'Cryptic Hunt',
    world: 'technical',
    summary: 'Ciphers, hidden trails and layered riddles. Race to crack every level first.',
    description:
      'A multi-level puzzle hunt across physical and digital clues. Decode ciphers, follow obscure trails and outthink the other teams against the clock.',
    format: 'Team hunt',
    eligibility: 'Open to all registered students.',
    sessions: [{ date: '2026-12-02', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 2 Seminar Hall (2nd & 4th Floor)',
    poc: 'Vedant & Harshdeep',
    note: 'Scoring, hints and fair-play rules will be announced before the hunt.',
    registrationEnabled: true,
    registrationUrl: form('cryptic-hunt'),
  },
  {
    id: 'reverse-engineering',
    name: 'Reverse Engineering',
    world: 'technical',
    summary: 'Take a system apart, find the hidden logic and rebuild how it works.',
    description:
      'Analyse compiled programs, untangle obfuscated logic and reconstruct what the code really does. A test of patience, precision and systems thinking.',
    format: 'Individual / team trial',
    eligibility: 'Open to all registered participants.',
    sessions: [{ date: '2026-12-04', time: '9:00 AM – 4:00 PM' }],
    venue: 'Devdan Multipurpose & Creativity Room',
    poc: 'Vedant, Prajwal VL & Prajwal S',
    note: 'Tools, platforms and time limits will be shared in the briefing.',
    registrationEnabled: true,
    registrationUrl: form('reverse-engineering'),
  },
  {
    id: 'ai-workshop',
    name: 'AI Workshop',
    world: 'technical',
    summary: 'A second hands-on workshop on applied AI tools and workflows.',
    description:
      'A practical session on modern AI tools and workflows, led by experienced practitioners. Bring a laptop; setup details will be emailed to registered attendees.',
    format: 'Hands-on workshop',
    eligibility: 'Open to all students. Prior registration required.',
    sessions: [{ date: '2026-12-01', time: '9:00 AM – 1:00 PM' }],
    venue: 'Amoga Hall',
    poc: 'Harshdeep',
    registrationEnabled: true,
    registrationUrl: form('ai-workshop'),
  },

  // Non-technical
  {
    id: 'nexus-olympics',
    name: 'NEXUS Olympics',
    world: 'non-technical',
    summary: 'A two-day, multi-round championship. Every challenge stays secret until it starts.',
    description:
      'Teams compete across a series of surprise rounds that test wit, reflexes and teamwork. Points add up across both days towards the NEXUS Olympics trophy.',
    format: 'Multi-round team championship',
    eligibility: 'Open to all registered teams.',
    sessions: [
      { date: '2026-11-25', time: '9:00 AM – 4:00 PM', venue: 'Block 5 Seminar Hall', label: 'Day 1' },
      { date: '2026-11-26', time: '9:00 AM – 4:00 PM', venue: 'Architecture 1st Floor Conference Room', label: 'Day 2' },
    ],
    venue: 'Block 5 Seminar Hall & Architecture Conference Room',
    poc: 'Sanjana, Jemimah & Prajwal S',
    note: 'Rounds are revealed live at the arena.',
    registrationEnabled: true,
    registrationUrl: form('nexus-olympics'),
  },
  {
    id: 'family-feud',
    name: 'Family Feud',
    world: 'non-technical',
    summary: 'Guess what the crowd said. Read the room and lock in the top answers before the buzzer.',
    description:
      'A fast team face-off built around survey answers. The team that best predicts popular opinion takes the round.',
    format: 'Team face-off',
    eligibility: 'Open to all registered teams.',
    sessions: [{ date: '2026-11-27', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 1 Auditorium',
    poc: 'Vedant & Merwin',
    registrationEnabled: true,
    registrationUrl: form('family-feud'),
  },
  {
    id: 'esports',
    name: 'Esports Championship',
    world: 'non-technical',
    summary: 'Bracket tournaments across popular multiplayer titles. Reflexes, coordination and clutch plays.',
    description:
      'Compete in a bracket-style tournament that rewards strategy, teamwork and mechanical skill.',
    format: 'Tournament brackets',
    eligibility: 'Open to all registered players.',
    sessions: [{ date: '2026-12-03', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 2, 4th Floor',
    poc: 'Merwin & Prajwal VL',
    note: 'Game titles, brackets and match timings will be sent to registered players.',
    registrationEnabled: true,
    registrationUrl: form('esports'),
  },
  {
    id: 'shark-tank',
    name: 'Shark Tank',
    world: 'non-technical',
    summary: 'Pitch your venture to the sharks. Defend your numbers and close the deal.',
    description:
      'Present a startup idea, product or social venture to a panel of judges. Expect tough questions about your market, model and plans to scale.',
    format: 'Team pitch & Q&A',
    eligibility: 'Open to student founders and teams.',
    sessions: [{ date: '2026-12-04', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 1 Auditorium',
    poc: 'Prajwal S & Swetha',
    note: 'Five-minute pitch followed by five minutes of questions.',
    registrationEnabled: true,
    registrationUrl: form('shark-tank'),
  },

  // Cultural
  {
    id: 'song',
    name: 'Song',
    world: 'cultural',
    summary: 'Solo and duet vocal performances across every genre.',
    description: 'Take the mic and win the room with your voice, range and stage presence.',
    format: 'Solo & duet',
    eligibility: 'Open to student vocalists and instrumentalists.',
    sessions: [{ date: '2026-11-23', time: '9:00 AM – 1:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George & Joel DSilva',
    note: 'Declare backing tracks and instruments when you register.',
    registrationEnabled: true,
    registrationUrl: form('song'),
  },
  {
    id: 'talent-show',
    name: 'Talent Show',
    world: 'cultural',
    summary: 'Stand-up, beatboxing, mimicry, poetry or something nobody has seen before.',
    description:
      'An open stage for any talent. Solo or with friends, if it can hold an audience, it belongs here.',
    format: 'Solo or group',
    eligibility: 'Open to all students.',
    sessions: [{ date: '2026-11-30', time: '9:00 AM – 1:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George & Stacy',
    note: 'Slots are limited and acts may be screened.',
    registrationEnabled: true,
    registrationUrl: form('talent-show'),
  },
  {
    id: 'dance',
    name: 'Dance',
    world: 'cultural',
    summary: 'Solo, duet and crew performances, from classical fusion to hip-hop.',
    description: 'Bring your choreography, your crew and your best moves to the main stage.',
    format: 'Solo / duet / crew',
    eligibility: 'Open to all university students.',
    sessions: [{ date: '2026-12-02', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George & Joel Anthony',
    note: 'Track submissions and time limits will be shared with registered entries.',
    registrationEnabled: true,
    registrationUrl: form('dance'),
  },
];

/** Non-competitive programme items that appear in the schedule only. */
export interface Ceremony {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

export const ceremonies: Ceremony[] = [
  {
    id: 'valedictory',
    name: 'Valedictory & Awards',
    date: '2026-12-05',
    time: '2:00 PM – 6:00 PM',
    venue: 'Main Auditorium',
    description: 'Closing ceremony, prize distribution and the final celebration of NEXUS.',
  },
];

const dayFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** "21 Nov", "25 & 26 Nov" or "To be announced". */
export function formatEventDates(event: NexusEvent): string {
  if (event.sessions.length === 0) return 'To be announced';
  const parts = event.sessions.map((s) => new Date(`${s.date}T00:00:00Z`));
  if (parts.length === 1) return dayFormatter.format(parts[0]);
  const sameMonth = parts.every((d) => d.getUTCMonth() === parts[0].getUTCMonth());
  if (sameMonth) {
    const month = dayFormatter.format(parts[0]).split(' ')[1];
    return `${parts.map((d) => d.getUTCDate()).join(' & ')} ${month}`;
  }
  return parts.map((d) => dayFormatter.format(d)).join(' & ');
}

export function formatEventTime(event: NexusEvent): string {
  return event.sessions[0]?.time ?? 'To be announced';
}
