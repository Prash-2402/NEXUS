/**
 * NEXUS 7 — Event Universe Data Store
 * 
 * Contains all verified events for Technical, Non-Technical, and Cultural categories.
 * Note: Unannounced official details (timings, venues, rules, prize pools) use "Details coming soon"
 * placeholders to ensure no fake information is communicated to participants.
 */


import { siteConfig } from '../config/site';

export type EventCategory = 'all' | 'technical' | 'non-technical' | 'cultural';

export interface SubActivity {
  id: string;
  name: string;
  description: string;
  isProvisionalName?: boolean;
}

export interface NexusEvent {
  id: string;
  name: string;
  category: 'technical' | 'non-technical' | 'cultural';
  shortDescription: string;
  description: string;
  badge?: string;
  iconName: 'Cpu' | 'Binary' | 'Terminal' | 'BookOpen' | 'Trophy' | 'Palette' | 'Music' | 'Mic' | 'Theater' | 'Search' | 'Gamepad' | 'Users' | 'Lightbulb';
  format: string;
  eligibility: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  poc?: string;
  registrationEnabled: boolean;
  registrationUrl: string; // Separate Google Form URL for this specific event
  formEntryValue?: string;
  subActivities?: SubActivity[];
  rulesPlaceholder?: string;
}

export interface CategoryInfo {
  id: 'technical' | 'non-technical' | 'cultural';
  title: string;
  worldName: string;
  headline: string;
  description: string;
  accentColor: string;
  glowColor: string;
  gradient: string;
  borderClass: string;
}

export const categoryMeta: Record<'technical' | 'non-technical' | 'cultural', CategoryInfo> = {
  technical: {
    id: 'technical',
    title: 'Technical',
    worldName: 'World of Synthesis',
    headline: 'Digital Geometry & Algorithmic Supremacy',
    description: 'High-octane coding challenges, cryptic cyber-mazes, reverse engineering trials, and masterclass technology workshops.',
    accentColor: '#315CFF',
    glowColor: 'rgba(49, 92, 255, 0.4)',
    gradient: 'from-[#315CFF]/20 via-[#17102E]/60 to-[#030308]',
    borderClass: 'border-[#315CFF]/30 hover:border-[#315CFF]/70',
  },
  'non-technical': {
    id: 'non-technical',
    title: 'Non-Technical',
    worldName: 'World of Kinetic Strategy',
    headline: 'High-Spirited Intellect & Olympic Feats',
    description: 'From gripping murder mysteries and athletic sports showdowns to the flagship multi-stage NEXUS Olympics games.',
    accentColor: '#813CFF',
    glowColor: 'rgba(129, 60, 255, 0.4)',
    gradient: 'from-[#813CFF]/20 via-[#17102E]/60 to-[#030308]',
    borderClass: 'border-[#813CFF]/30 hover:border-[#813CFF]/70',
  },
  cultural: {
    id: 'cultural',
    title: 'Cultural',
    worldName: 'World of Resonance',
    headline: 'Stellar Expression & Artistic Grace',
    description: 'Electrifying choreographies, soulful musical renditions, and a stage-commanding showcase of multifaceted talents.',
    accentColor: '#F5C451',
    glowColor: 'rgba(245, 196, 81, 0.35)',
    gradient: 'from-[#F5C451]/15 via-[#813CFF]/20 to-[#030308]',
    borderClass: 'border-[#F5C451]/30 hover:border-[#F5C451]/70',
  },
};

export const eventsData: NexusEvent[] = [
  // ================= TECHNICAL EVENTS =================
  {
    id: 'murder-mystery',
    name: 'Murder Mystery',
    category: 'technical',
    shortDescription: 'An immersive investigative forensic simulation where clues, alibis, and deductive reasoning reveal the truth.',
    description: 'A staged crime scene, suspicious testimonies, and a trail of forensic evidence. Work through interrogations and psychological deductions to uncover the perpetrator before time runs out.',
    badge: 'Forensic Trial',
    iconName: 'Search',
    format: 'Team Investigation',
    eligibility: 'Open to all registered participants.',
    date: '23 November 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Multipurpose Hall - Devdan',
    poc: 'Swetha & Prajwal VL',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['murder-mystery'],
    formEntryValue: 'murder_mystery',
    rulesPlaceholder: 'Detective briefings, dossier access, and case parameters will be delivered at the crime scene briefing.',
  },
  {
    id: 'cryptic-hunt',
    name: 'Cryptic Hunt',
    category: 'technical',
    shortDescription: 'A multi-layered digital enigma spanning cyberspace, cipher decrypts, and algorithmic riddles.',
    description: 'Put your lateral thinking and cyber-investigative skills to the test. Unravel obscure internet trails, decode encrypted ciphers, and race against the clock to crack each cryptic tier.',
    badge: 'Cyber Enigma',
    iconName: 'Binary',
    format: 'Competitive Team Hunt',
    eligibility: 'Open to all registered students.',
    date: '2 December 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Block 2 Seminar Hall (4th & 2nd Floor)',
    poc: 'Vedant & Harshdeep',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['cryptic-hunt'],
    formEntryValue: 'cryptic_hunt',
    rulesPlaceholder: 'Scoring criteria, hint mechanisms, and anti-cheating guidelines will be announced prior to the hunt start.',
  },
  {
    id: 'reverse-engineering',
    name: 'Reverse Engineering',
    category: 'technical',
    shortDescription: 'Deconstruct complex binaries, unearth hidden logic, and rebuild architectural blueprints from scratch.',
    description: 'Analyze compiled binaries, decipher obfuscated logic, and reconstruct underlying codebases. A pure trial of diagnostic precision, binary analysis, and systems mastery.',
    badge: 'Systems Deep Dive',
    iconName: 'Cpu',
    format: 'Competitive Trial',
    eligibility: 'Open to all registered participants.',
    date: '4 December 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Devdan Multipurpose & Devdan Creativity Room',
    poc: 'Vedant, Prajwal V L & Prajwal S',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['reverse-engineering'],
    formEntryValue: 'reverse_engineering',
    rulesPlaceholder: 'Tooling specifications, platform binaries, and time bounds will be provided in the briefing deck.',
  },
  {
    id: 'workshops',
    name: 'AI Workshops & Masterclasses',
    category: 'technical',
    shortDescription: 'Hands-on masterclasses in next-generation artificial intelligence, machine learning architectures, and modern frameworks.',
    description: 'Immerse yourself in specialized technical masterclasses conducted by experienced practitioners. Gain practical skills in state-of-the-art AI systems, data pipelines, and computational intelligence.',
    badge: 'Hands-On Learning',
    iconName: 'BookOpen',
    format: 'Interactive Workshop Sessions',
    eligibility: 'Open to all students with prior registration.',
    date: '28 November 2026',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    venue: 'Amoga Hall (Workshop-1) / TBD (Workshop-2)',
    poc: 'Swetha & Prajwal S (Workshop-1) / Harshdeep (Workshop-2)',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['workshops'],
    formEntryValue: 'workshops',
    rulesPlaceholder: 'Prerequisites, laptop setup instructions, and software requirements will be emailed to registered attendees.',
  },
  {
    id: 'hackathon',
    name: 'Hackathon',
    category: 'technical',
    shortDescription: 'The premier AI-driven innovation sprint where visionaries build high-impact autonomous solutions under pressure.',
    description: 'Assemble your team of builders, researchers, and designers to solve forward-thinking engineering problems. Build functional prototypes, harness AI models, and pitch your work before a panel of academic and industry specialists.',
    badge: 'Flagship Tech',
    iconName: 'Terminal',
    format: 'Team-based sprint',
    eligibility: 'Open to university students.',
    date: '23 November 2026 (Kickoff)',
    startTime: 'Details coming soon',
    endTime: 'Details coming soon',
    venue: 'Campus Tech Labs / Details coming soon',
    poc: 'Swetha & Prajwal VL',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['hackathon'],
    formEntryValue: 'hackathon',
    rulesPlaceholder: 'Complete problem statements, evaluation rubrics, and submission requirements will be released prior to commencement.',
  },

  // ================= NON-TECHNICAL EVENTS =================
  {
    id: 'nexus-olympics',
    name: 'NEXUS Olympics',
    category: 'non-technical',
    shortDescription: 'The flagship multi-stage decathlon featuring confidential surprise challenges unveiled live at the arena.',
    description: 'A vibrant showdown of quick wit, teamwork, and spontaneous battles across multiple surprise arenas. The internal events are kept strictly confidential and will be revealed as live surprises during the festival.',
    badge: 'Surprise Arenas',
    iconName: 'Trophy',
    format: 'Multi-stage Championship',
    eligibility: 'Open to all registered squads and participants.',
    date: '25 & 26 November 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Block 5 Seminar Hall & Architecture 1st Conf Room',
    poc: 'Sanjana & Prajwal S',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['nexus-olympics'],
    formEntryValue: 'nexus_olympics',
    rulesPlaceholder: 'Points will accumulate across all surprise rounds towards the overall NEXUS Olympics trophy. Challenge parameters and arena rules are revealed live.',
  },
  {
    id: 'family-feud',
    name: 'Family Feud',
    category: 'non-technical',
    shortDescription: 'The exhilarating battle of intuition and rapid reflexes: guess the most popular survey responses under pressure.',
    description: 'A high-energy team showdown inspired by the classic family face-off. Test how well your squad reads the room, anticipates popular culture, and locks in top answers before the buzzer sounds.',
    badge: 'Crowd Pulse',
    iconName: 'Users',
    format: 'Team Face-off',
    eligibility: 'Open to all registered teams.',
    date: '27 November 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Block 1 Audi',
    poc: 'Vedant & Merwin',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['family-feud'],
    formEntryValue: 'family_feud',
    rulesPlaceholder: 'Teams will compete in bracket rounds with point multipliers and sudden-death buzzer challenges.',
  },
  {
    id: 'esports',
    name: 'ESports Championship',
    category: 'non-technical',
    shortDescription: 'Competitive tournaments testing agility, tactical coordination, and gaming supremacy in the arena.',
    description: 'Take the battle to the virtual battlefield. A high-voltage showcase of reaction time, strategic synergy, and competitive gaming across premier multiplayer titles.',
    badge: 'Gaming Arena',
    iconName: 'Gamepad',
    format: 'Tournament Brackets',
    eligibility: 'Open to all registered gamers.',
    date: '3 December 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Block 2 4th Floor',
    poc: 'Merwin & Prajwal V L',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['esports'],
    formEntryValue: 'esports',
    rulesPlaceholder: 'Tournament brackets, game titles, hardware guidelines, and match timings will be sent to registered players.',
  },
  {
    id: 'shark-tank',
    name: 'Shark Tank',
    category: 'non-technical',
    shortDescription: 'Pitch your breakthrough ventures, defend your unit economics, and negotiate under the spotlight.',
    description: 'Step into the tank with your most compelling startup concepts, disruptive products, or social enterprises. Face probing questions from judges, substantiate market demand, and prove scalability.',
    badge: 'Venture Pitch',
    iconName: 'Lightbulb',
    format: 'Team Pitch & Q&A',
    eligibility: 'Open to aspiring student founders and teams.',
    date: '4 December 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Block 1 Audi',
    poc: 'Prajwal S & Swetha',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['shark-tank'],
    formEntryValue: 'shark_tank',
    rulesPlaceholder: 'Deck submission limits, pitch duration (5 mins pitch + 5 mins Q&A), and evaluation rubrics will be detailed in the participant guide.',
  },

  // ================= CULTURAL EVENTS =================
  {
    id: 'song',
    name: 'Song',
    category: 'cultural',
    shortDescription: 'Soulful vocal performances and melodic compositions resonating across the universe.',
    description: 'Step up to the microphone and captivate the audience with your vocal power, dynamic range, and musical authenticity across genres.',
    badge: 'Acoustic & Melodic',
    iconName: 'Mic',
    format: 'Solo & Duet Performances',
    eligibility: 'Open to student vocalists and instrumentalists.',
    date: '23 November 2026',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    venue: '3rd Block Audi',
    poc: 'Joel J George & Joel DSilva (and Stacy)',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['song'],
    formEntryValue: 'song',
    rulesPlaceholder: 'Audio backing tracks and instrument requirements must be declared during registration confirmation.',
  },
  {
    id: 'dance',
    name: 'Dance',
    category: 'cultural',
    shortDescription: 'Breathtaking choreographies merging rhythm, synchrony, and cosmic expressive movement.',
    description: 'Light up the stage with mesmerizing moves, synchrony, and storytelling. Open to diverse dance forms from classical fusion to urban hip-hop and contemporary expressions.',
    badge: 'Stage Spectacle',
    iconName: 'Palette',
    format: 'Solo / Duet / Crew',
    eligibility: 'Open to all university students.',
    date: '2 December 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: '3rd Block Audi',
    poc: 'Joel J George & Stacy',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['dance'],
    formEntryValue: 'dance',
    rulesPlaceholder: 'Track submissions, time limits, and staging regulations will be shared with shortlisted entries.',
  },
  {
    id: 'talent-show',
    name: 'Talent Show',
    category: 'cultural',
    shortDescription: 'An open cosmic arena for extraordinary arts: stand-up comedy, illusionism, poetry, and beyond.',
    description: 'A grand celebration of unique creative abilities. Whether it is beatboxing, stand-up comedy, theatrical monologues, mimicry, or instrumental sorcery, take centre stage.',
    badge: 'Spotlight Showcase',
    iconName: 'Theater',
    format: 'Individual or Collaborative',
    eligibility: 'Open to all creative innovators.',
    date: '30 November 2026',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    venue: '3rd Block Audi',
    poc: 'Joel J George & Sanjana',
    registrationEnabled: true,
    registrationUrl: siteConfig.registration.eventForms['talent-show'],
    formEntryValue: 'talent_show',
    rulesPlaceholder: 'Performance slots are limited and subject to screening. Details on tech riders coming soon.',
  },
];

