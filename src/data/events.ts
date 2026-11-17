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
  /** Total prize pool, from the registration form */
  prize?: string;
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
      'Tech Olympics, Family Feud, Copa del Nexus and Shark Tank. Quick wit, teamwork and nerve under pressure.',
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
    registrationEnabled: true,
    registrationUrl: form('tableau-workshop'),
  },
  {
    id: 'murder-mystery',
    name: 'Murder Protocol',
    world: 'technical',
    summary: 'A murder has taken place. Decode the clues, scan the QR codes, analyse the evidence and catch the killer.',
    description:
      'A team investigation: decode clues, scan QR codes, analyse evidence and piece together what happened before time runs out. Observation, logic and teamwork crack the case.',
    format: 'Team of 3–5 · 90–120 minutes',
    eligibility: 'Open to all students, in teams of 3 to 5.',
    sessions: [{ date: '2026-11-23', time: '9:00 AM – 4:00 PM' }],
    venue: 'Multipurpose Hall, Devdan',
    poc: 'Swetha & Prajwal S',
    prize: '₹6,000',
    registrationEnabled: true,
    registrationUrl: form('murder-mystery'),
  },
  {
    id: 'cryptic-hunt',
    name: 'Cryptic Hunt',
    world: 'technical',
    summary: 'Crack the clues, solve the puzzles and find the treasure, stage by stage.',
    description:
      'A multi-stage puzzle and treasure hunt. Decode cryptic clues and beat challenging puzzles with your team, stage by stage, racing the others to the final mystery.',
    format: 'Team of 3–4 · Multi-stage',
    eligibility: 'Open to all students, in teams of 3 to 4.',
    sessions: [{ date: '2026-12-02', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 2, 3rd Floor Seminar Hall',
    poc: 'Vedant & Harshdeep',
    prize: '₹8,000',
    registrationEnabled: true,
    registrationUrl: form('cryptic-hunt'),
  },
  {
    id: 'reverse-engineering',
    name: 'UI Reverse Engineering',
    world: 'technical',
    summary: 'An app or website is revealed. Your team rebuilds it, as close to the original as you can, against the clock.',
    description:
      'A team frontend challenge: the organisers reveal an application or website, and each team recreates a functional, visually accurate version within the allotted time, then demonstrates it.',
    format: 'Team of 2–4',
    eligibility: 'Open to all students, in teams of 2 to 4.',
    sessions: [{ date: '2026-12-04', time: '9:00 AM – 4:00 PM' }],
    venue: 'Devdan Multipurpose Room & Creativity Room',
    poc: 'Viswa & Joel Jacob',
    prize: '₹7,000',
    registrationEnabled: true,
    registrationUrl: form('reverse-engineering'),
  },
  {
    id: 'ai-workshop',
    name: 'Salesforce Workshop',
    world: 'technical',
    summary: 'Introduction to Salesforce Data Cloud, with a full day of real-time, hands-on practice.',
    description:
      'An offline, instructor-led workshop by certified Salesforce trainer Harshdeep Sharma. Learn Salesforce CRM fundamentals, Data Cloud architecture, data ingestion, harmonization, customer data unification and segmentation, through guided exercises, a hands-on lab and a closing demo with Q&A.',
    format: 'Hands-on workshop · Full day',
    eligibility: 'Open to all students, beginners welcome. Bring your own laptop with stable internet.',
    sessions: [{ date: '2026-12-01', time: '9:00 AM – 5:00 PM' }],
    venue: 'Amoga Hall',
    poc: 'Harshdeep',
    registrationEnabled: true,
    registrationUrl: form('ai-workshop'),
  },

  // Non-technical
  {
    id: 'nexus-olympics',
    name: 'Tech Olympics',
    world: 'non-technical',
    summary: 'Two action-packed days. Movie and music knowledge on day one, logic and AI-powered creativity on day two.',
    description:
      'Day 1, The Reel Rush, goes from the big screen to the beat. Day 2, The Mind Games, is about outsmarting, outthinking and outplaying everyone else. Each day has three events, and teams can enter one day or both.',
    format: 'Team of exactly 4 · Day 1, Day 2 or both',
    eligibility: 'Teams of exactly 4. Teams entering both days must keep the same members.',
    sessions: [
      { date: '2026-11-25', time: '9:00 AM – 4:00 PM', venue: 'Block 5 Seminar Hall', label: 'Day 1 · The Reel Rush' },
      { date: '2026-11-26', time: '9:00 AM – 4:00 PM', venue: 'Architecture 1st Conference Room', label: 'Day 2 · The Mind Games' },
    ],
    venue: 'Block 5 Seminar Hall (Day 1) · Architecture 1st Conference Room (Day 2)',
    poc: 'Sanjana, Jemimah & Prajwal S',
    prize: '₹8,000',
    registrationEnabled: true,
    registrationUrl: form('nexus-olympics'),
  },
  {
    id: 'family-feud',
    name: 'Family Feud',
    world: 'non-technical',
    summary: 'Guess what the crowd said. Read the room and lock in the top answers before the buzzer.',
    description:
      'A survey-based team game inspired by the TV show: teams guess the most popular answers from a pre-event student survey. Team against team, think like the crowd.',
    format: 'Team of 4–5 · Team vs team',
    eligibility: 'Open to all students, in teams of 4 to 5.',
    sessions: [{ date: '2026-11-23', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 1 Auditorium',
    poc: 'Vedant & Merwin',
    prize: '₹5,000',
    registrationEnabled: true,
    registrationUrl: form('family-feud'),
  },
  {
    id: 'esports',
    name: 'Copa del Nexus',
    world: 'non-technical',
    summary: 'One game. One champion. Knockout football in EA SPORTS FC 26 on PC or eFootball on mobile.',
    description:
      'An individual knockout tournament with 10-minute matches. Register for either EA SPORTS FC 26 (PC) or eFootball (Mobile) and battle your way to the title.',
    format: 'Individual · Knockout · 10-minute matches',
    eligibility: 'Individual entry. Choose EA SPORTS FC 26 (PC) or eFootball (Mobile).',
    sessions: [{ date: '2026-12-03', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 2, 4th Floor Seminar Hall',
    poc: 'Merwin & Prajwal VL',
    prize: '₹5,000',
    registrationEnabled: true,
    registrationUrl: form('esports'),
  },
  {
    id: 'shark-tank',
    name: 'The Venture Trial: Shark Tank',
    world: 'non-technical',
    summary: 'Think big, pitch bold. Convince the sharks your venture has what it takes.',
    description:
      'An entrepreneurial team competition: present your business idea, demonstrate the concept and convince the judges of its potential. Proposals are submitted in advance and the top 12 teams make the final.',
    format: 'Team of exactly 4 · Top 12 in the final',
    eligibility: 'Teams of exactly 4. Submit a business proposal for shortlisting.',
    sessions: [{ date: '2026-12-04', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 1 Auditorium',
    poc: 'Prajwal S & Swetha',
    note: 'Submit your proposal before the event. Only the top 12 shortlisted teams are invited to the final round.',
    prize: '₹7,000',
    registrationEnabled: true,
    registrationUrl: form('shark-tank'),
  },

  // Cultural
  {
    id: 'song',
    name: 'Melodiya',
    world: 'cultural',
    summary: 'A solo singing competition. Four minutes, one stage, your voice.',
    description:
      'NEXUS Melodiya is a solo singing competition open to every genre. Each singer gets up to 4 minutes on stage plus 1 minute to set up. 30 slots, first come, first served.',
    format: 'Solo · 4 minutes + 1 minute setup',
    eligibility: 'Solo singers only. Maximum of 30 participants.',
    sessions: [{ date: '2026-11-23', time: '9:00 AM – 1:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George & Joel DSilva',
    prize: '₹5,000',
    registrationEnabled: true,
    registrationUrl: form('song'),
  },
  {
    id: 'talent-show',
    name: 'Christ Got Talent',
    world: 'cultural',
    summary: 'Stand-up, beatboxing, mimicry, poetry or something nobody has seen before. Solo or as a duo.',
    description:
      'A platform to bring any talent into the spotlight, on your own or as a duo. If it can hold an audience, it belongs here.',
    format: 'Solo or duo',
    eligibility: 'Open to all students. One or two performers.',
    sessions: [{ date: '2026-11-30', time: '9:00 AM – 1:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George & Stacy',
    prize: '₹5,000',
    registrationEnabled: true,
    registrationUrl: form('talent-show'),
  },
  {
    id: 'dance',
    name: 'Nritya',
    world: 'cultural',
    summary: 'Move. Express. Perform. A solo dance competition for every style.',
    description:
      'Nritya is a solo dance stage for every style, from classical and contemporary to hip-hop and fusion. Bring your choreography and own the stage.',
    format: 'Solo',
    eligibility: 'Solo dancers only.',
    sessions: [{ date: '2026-12-02', time: '9:00 AM – 4:00 PM' }],
    venue: 'Block 3 Auditorium',
    poc: 'Joel J George, Joel Anthony & Laya Shaju',
    prize: '₹5,000',
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
