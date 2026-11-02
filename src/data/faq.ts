/**
 * NEXUS 7 — FAQ Data
 * 
 * Verified questions and answers for participants.
 * Does not invent rules, fees, or unannounced criteria.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'registration' | 'events' | 'logistics';
}

export const faqData: FAQItem[] = [
  {
    id: 'what-is-nexus',
    question: 'What is NEXUS?',
    answer: 'NEXUS is the flagship AI Utsav organized by CAADS (Christites Association of AI and Data Science) under the Department of AI & Data Science Engineering at CHRIST (Deemed to be University), Bangalore. It is a multi-dimensional digital convergence bringing together Technical competitions, Non-Technical strategy arenas, and Cultural arts from 23 November 2026 to 5 December 2026.',
    category: 'general',
  },
  {
    id: 'who-is-eligible',
    question: 'Who is eligible to participate in NEXUS?',
    answer: 'NEXUS welcomes university students across disciplines. Detailed event-specific eligibility guidelines and team formation rules will be officially published as event registrations commence.',
    category: 'general',
  },
  {
    id: 'how-to-register',
    question: 'How do I register for events?',
    answer: 'Registration is conducted through a single unified Google Form provided by the CAADS organizing committee. You can click any "Register Now" button across the website to open the official registration form in a new tab.',
    category: 'registration',
  },
  {
    id: 'multiple-events',
    question: 'Can I register for multiple events across categories?',
    answer: 'Yes, participants are encouraged to explore events across Technical, Non-Technical, and Cultural categories, provided their individual schedules do not conflict. Detailed time slots will be announced soon.',
    category: 'registration',
  },
  {
    id: 'event-locations',
    question: 'Where will the events take place?',
    answer: 'All offline events will take place at the CHRIST (Deemed to be University) campus in Bangalore, India, across computer labs, auditoriums, amphitheatre, and sports grounds. Select stages (like Cryptic Hunt phases) may also feature online components. Specific room allocations will be announced soon.',
    category: 'logistics',
  },
  {
    id: 'nexus-olympics-format',
    question: 'What is the NEXUS Olympics?',
    answer: 'NEXUS Olympics is a flagship non-technical decathlon featuring a series of multi-stage challenges. To test spontaneity and quick reflexes under pressure, all arena events inside are kept confidential and will be revealed as surprises on the spot! Teams compete across all rounds to rack up points for the championship trophy.',
    category: 'events',
  },
  {
    id: 'contact-organizers',
    question: 'How can I contact the CAADS organizing team?',
    answer: 'You can reach out directly via the official organizing email at caads@christuniversity.in or follow our updates on Instagram @caads_christ. Further direct student coordinator contacts will be shared prior to the event.',
    category: 'general',
  },
];

