import { siteConfig } from '../config/site';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'what-is-nexus',
    question: 'What is NEXUS?',
    answer: `NEXUS is the flagship AI Utsav of ${siteConfig.organizingClub}, the student association of the ${siteConfig.departmentName} at ${siteConfig.institution}. It brings technical, non-technical and cultural events together from ${siteConfig.dates.display}.`,
  },
  {
    id: 'who-can-participate',
    question: 'Who can participate?',
    answer:
      'NEXUS is open to university students across disciplines. Each event lists its own eligibility on its details card.',
  },
  {
    id: 'how-to-register',
    question: 'How do I register?',
    answer:
      'Every event has its own Google Form. Open the event in the Events section and press Register to open its form in a new tab.',
  },
  {
    id: 'multiple-events',
    question: 'Can I take part in more than one event?',
    answer:
      'Yes. You can register for as many events as you like across all three worlds, as long as their timings do not clash. Check the schedule before you sign up.',
  },
  {
    id: 'venue',
    question: 'Where does NEXUS take place?',
    answer: `All events are held at ${siteConfig.institution}, ${siteConfig.campus}. Each event card lists its venue.`,
  },
  {
    id: 'olympics',
    question: 'What is the NEXUS Olympics?',
    answer:
      'A two-day team championship made of surprise rounds. The challenges are kept secret until they begin, and points add up across both days towards the trophy.',
  },
  {
    id: 'contact',
    question: 'Who do I contact with questions?',
    answer: `Email ${siteConfig.socials.contactEmail} or message ${siteConfig.socials.instagramHandle} on Instagram. Each event also lists its student coordinators.`,
  },
];
