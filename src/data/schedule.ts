import { siteConfig } from '../config/site';

export interface ScheduleEventItem {
  id: string;
  eventId?: string;
  eventName: string;
  category: 'technical' | 'non-technical' | 'cultural';
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "9:00 AM - 1:00 PM"
  endTime?: string;
  venue: string;
  poc?: string;
  status: 'upcoming' | 'live' | 'completed';
  description?: string;
  registrationUrl?: string;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 13
  displayDate: string; // e.g. "Monday, 23 November 2026"
  phaseTitle: string; // e.g. "Opening Showdowns: Song & Murder Mystery"
  events: ScheduleEventItem[];
}

export interface ScheduleConfig {
  isConfirmed: boolean;
  announcementNotice: string;
  spanDescription: string;
  festivalStartDate: string;
  festivalEndDate: string;
  days: DaySchedule[];
}

export const scheduleConfig: ScheduleConfig = {
  isConfirmed: true,
  announcementNotice: "Official schedule synchronized with department & CAADS event coordinator roster.",
  spanDescription: "23 November 2026 – 5 December 2026 • CHRIST (Deemed to be University), Bangalore",
  festivalStartDate: "2026-11-23",
  festivalEndDate: "2026-12-05",
  days: [
    {
      date: "2026-11-23",
      dayNumber: 1,
      displayDate: "Monday, 23 November 2026",
      phaseTitle: "Grand Inception: Song & Murder Mystery",
      events: [
        {
          id: "s1",
          eventId: "song",
          eventName: "Song",
          category: "cultural",
          date: "2026-11-23",
          startTime: "9:00 AM – 1:00 PM",
          venue: "3rd Block Audi",
          poc: "Joel J George & Joel DSilva",
          status: "upcoming",
          description: "Soulful vocal renditions, acoustic sets, and melodic performances.",
          registrationUrl: siteConfig.registration.eventForms.song,
        },
        {
          id: "s2",
          eventId: "murder-mystery",
          eventName: "Murder Mystery",
          category: "technical",
          date: "2026-11-23",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Multipurpose Hall - Devdan",
          poc: "Swetha & Prajwal VL",
          status: "upcoming",
          description: "Staged crime scene investigation, forensic trails, and deductive interrogation.",
          registrationUrl: siteConfig.registration.eventForms['murder-mystery'],
        },
      ],
    },
    {
      date: "2026-11-24",
      dayNumber: 2,
      displayDate: "Tuesday, 24 November 2026",
      phaseTitle: "Innovation Lab & Technical Mentorship",
      events: [],
    },
    {
      date: "2026-11-25",
      dayNumber: 3,
      displayDate: "Wednesday, 25 November 2026",
      phaseTitle: "NEXUS Olympics — Arena Day 1",
      events: [
        {
          id: "s3",
          eventId: "nexus-olympics",
          eventName: "Word Auction (NEXUS Olympics)",
          category: "non-technical",
          date: "2026-11-25",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 5 Seminar Hall",
          poc: "Sanjana & Prajwal S",
          status: "upcoming",
          description: "High-octane vocabulary bidding and strategic wordcraft decathlon stage.",
          registrationUrl: siteConfig.registration.eventForms['nexus-olympics'],
        },
        {
          id: "s4",
          eventId: "nexus-olympics",
          eventName: "Song Tuning (NEXUS Olympics)",
          category: "non-technical",
          date: "2026-11-25",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 5 Seminar Hall",
          poc: "Sanjana & Prajwal S",
          status: "upcoming",
          description: "Test musical reflexes, acoustics, and instinct under tournament clock pressure.",
          registrationUrl: siteConfig.registration.eventForms['nexus-olympics'],
        },
      ],
    },
    {
      date: "2026-11-26",
      dayNumber: 4,
      displayDate: "Thursday, 26 November 2026",
      phaseTitle: "NEXUS Olympics — Arena Day 2",
      events: [
        {
          id: "s5",
          eventId: "nexus-olympics",
          eventName: "Dialogue-Related Challenge (NEXUS Olympics)",
          category: "non-technical",
          date: "2026-11-26",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Architecture 1st Conference Room",
          poc: "Sanjana & Prajwal S",
          status: "upcoming",
          description: "Fast-fire cinematic recognition, linguistic adaptability, and spontaneity stage.",
          registrationUrl: siteConfig.registration.eventForms['nexus-olympics'],
        },
        {
          id: "s6",
          eventId: "nexus-olympics",
          eventName: "Brain vs Buzz (NEXUS Olympics)",
          category: "non-technical",
          date: "2026-11-26",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Architecture 1st Conference Room",
          poc: "Sanjana & Prajwal S",
          status: "upcoming",
          description: "Intellectual agility showdown testing reflexes, quick answers, and squad trivia.",
          registrationUrl: siteConfig.registration.eventForms['nexus-olympics'],
        },
      ],
    },
    {
      date: "2026-11-27",
      dayNumber: 5,
      displayDate: "Friday, 27 November 2026",
      phaseTitle: "Family Feud Arena",
      events: [
        {
          id: "s7",
          eventId: "family-feud",
          eventName: "Family Feud",
          category: "non-technical",
          date: "2026-11-27",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 1 Audi",
          poc: "Vedant & Merwin",
          status: "upcoming",
          description: "High-energy squad face-off guessing top crowd survey responses under the buzzer.",
          registrationUrl: siteConfig.registration.eventForms['family-feud'],
        },
      ],
    },
    {
      date: "2026-11-28",
      dayNumber: 6,
      displayDate: "Saturday, 28 November 2026",
      phaseTitle: "AI & Tech Masterclass",
      events: [
        {
          id: "s8",
          eventId: "workshops",
          eventName: "Workshop-1: Advanced AI & Engineering",
          category: "technical",
          date: "2026-11-28",
          startTime: "9:00 AM – 1:00 PM",
          venue: "Amoga Hall",
          poc: "Swetha & Prajwal S",
          status: "upcoming",
          description: "Hands-on masterclass focusing on artificial intelligence systems, computational pipelines, and modern frameworks.",
          registrationUrl: siteConfig.registration.eventForms.workshops,
        },
      ],
    },
    {
      date: "2026-11-29",
      dayNumber: 7,
      displayDate: "Sunday, 29 November 2026",
      phaseTitle: "Sunday Break — No Events Scheduled",
      events: [],
    },
    {
      date: "2026-11-30",
      dayNumber: 8,
      displayDate: "Monday, 30 November 2026",
      phaseTitle: "Spotlight Creative Expressions",
      events: [
        {
          id: "s9",
          eventId: "talent-show",
          eventName: "Talent Show",
          category: "cultural",
          date: "2026-11-30",
          startTime: "9:00 AM – 1:00 PM",
          venue: "3rd Block Audi",
          poc: "Joel J George & Sanjana",
          status: "upcoming",
          description: "Stage arena for stand-up comedy, mimicry, beatboxing, mono-acting, and extraordinary creative performance.",
          registrationUrl: siteConfig.registration.eventForms['talent-show'],
        },
      ],
    },
    {
      date: "2026-12-01",
      dayNumber: 9,
      displayDate: "Tuesday, 1 December 2026",
      phaseTitle: "Mid-Festival Intermission",
      events: [],
    },
    {
      date: "2026-12-02",
      dayNumber: 10,
      displayDate: "Wednesday, 2 December 2026",
      phaseTitle: "Cryptic Enigma & Dance Spectacle",
      events: [
        {
          id: "s10",
          eventId: "cryptic-hunt",
          eventName: "Cryptic Hunt",
          category: "technical",
          date: "2026-12-02",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 2 Seminar Hall (4th & 2nd Floor)",
          poc: "Vedant & Harshdeep",
          status: "upcoming",
          description: "Cyber puzzle hunt spanning cryptic ciphers, hidden digital anomalies, and algorithmic navigation.",
          registrationUrl: siteConfig.registration.eventForms['cryptic-hunt'],
        },
        {
          id: "s11",
          eventId: "dance",
          eventName: "Dance",
          category: "cultural",
          date: "2026-12-02",
          startTime: "9:00 AM – 4:00 PM",
          venue: "3rd Block Audi",
          poc: "Joel J George & Stacy",
          status: "upcoming",
          description: "Dynamic choreographies spanning classical fusion, hip-hop, contemporary, and crew showcases.",
          registrationUrl: siteConfig.registration.eventForms.dance,
        },
      ],
    },
    {
      date: "2026-12-03",
      dayNumber: 11,
      displayDate: "Thursday, 3 December 2026",
      phaseTitle: "ESports Gaming Championship",
      events: [
        {
          id: "s12",
          eventId: "esports",
          eventName: "ESports Championship",
          category: "non-technical",
          date: "2026-12-03",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 2 4th Floor",
          poc: "Merwin & Prajwal V L",
          status: "upcoming",
          description: "Competitive multiplayer gaming tournament testing reflexes, team synergy, and competitive prowess.",
          registrationUrl: siteConfig.registration.eventForms.esports,
        },
      ],
    },
    {
      date: "2026-12-04",
      dayNumber: 12,
      displayDate: "Friday, 4 December 2026",
      phaseTitle: "Shark Tank Pitch & Reverse Engineering",
      events: [
        {
          id: "s13",
          eventId: "shark-tank",
          eventName: "Shark Tank",
          category: "non-technical",
          date: "2026-12-04",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Block 1 Audi",
          poc: "Prajwal S & Swetha",
          status: "upcoming",
          description: "Student venture pitching arena, business model interrogation, and scalability defense before jury.",
          registrationUrl: siteConfig.registration.eventForms['shark-tank'],
        },
        {
          id: "s14",
          eventId: "reverse-engineering",
          eventName: "Reverse Engineering",
          category: "technical",
          date: "2026-12-04",
          startTime: "9:00 AM – 4:00 PM",
          venue: "Devdan Multipurpose & Creativity Room",
          poc: "Vedant, Prajwal V L & Prajwal S",
          status: "upcoming",
          description: "Disassemble binary structures, analyze compiled logic, and reconstruct engineering architectures.",
          registrationUrl: siteConfig.registration.eventForms['reverse-engineering'],
        },
      ],
    },
    {
      date: "2026-12-05",
      dayNumber: 13,
      displayDate: "Saturday, 5 December 2026",
      phaseTitle: "Grand Valedictory & Awards Gala",
      events: [
        {
          id: "s15",
          eventId: "valedictory",
          eventName: "NEXUS Valedictory & Awards Ceremony",
          category: "cultural",
          date: "2026-12-05",
          startTime: "2:00 PM – 6:00 PM",
          venue: "Main Auditorium",
          poc: "Department & CAADS Organizing Committee",
          status: "upcoming",
          description: "Grand closing ceremony, championship trophies, felicitations, and festival celebrations.",
        },
      ],
    },
  ],
};
