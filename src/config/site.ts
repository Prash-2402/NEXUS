/**
 * NEXUS — global site configuration.
 * Edit the values here to update the whole site without touching components.
 */

export interface SiteConfig {
  eventName: string;
  eventIdentity: string;
  tagline: string;
  conceptIdea: string;
  departmentName: string;
  organizingClub: string;
  organizingClubFullName: string;
  institution: string;
  campus: string;
  location: string;
  dates: {
    display: string;
    short: string;
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
    timezone: string;
  };
  registration: {
    status: 'open' | 'coming_soon' | 'closed';
    // One Google Form per event, keyed by event id
    eventForms: Record<string, string>;
  };
  socials: {
    instagramUrl: string;
    instagramHandle: string;
    contactEmail: string;
    websiteUrl: string;
  };
  branding: {
    nexusLogo: string;
    deptLogo: string;
    caadsLogo: string;
    christLogo: string;
  };
  navLinks: Array<{ label: string; href: string }>;
}

export const siteConfig: SiteConfig = {
  eventName: 'NEXUS',
  eventIdentity: 'An AI Utsav',
  tagline: 'Where Worlds Converge',
  conceptIdea: 'Different worlds. One universe.',
  departmentName: 'Department of AI & Data Science Engineering',
  organizingClub: 'CAADS',
  organizingClubFullName: 'Christites Association of AI and Data Science',
  institution: 'CHRIST (Deemed to be University)',
  campus: 'Kengeri Campus, Bangalore',
  location: 'Bangalore, India',
  dates: {
    display: '21 November – 5 December 2026',
    short: '21 Nov – 5 Dec 2026',
    startDate: '2026-11-21T09:00:00+05:30',
    endDate: '2026-12-05T18:00:00+05:30',
    timezone: 'Asia/Kolkata',
  },
  registration: {
    status: 'open',
    eventForms: {
      'tableau-workshop': 'https://forms.google.com/nexus-tableau-workshop-form-placeholder',
      'ai-workshop': 'https://forms.google.com/nexus-ai-workshop-form-placeholder',
      'murder-mystery': 'https://forms.google.com/nexus-murder-mystery-form-placeholder',
      'cryptic-hunt': 'https://forms.google.com/nexus-cryptic-hunt-form-placeholder',
      'reverse-engineering': 'https://forms.google.com/nexus-reverse-engineering-form-placeholder',
      'nexus-olympics': 'https://forms.google.com/nexus-olympics-form-placeholder',
      'family-feud': 'https://forms.google.com/nexus-family-feud-form-placeholder',
      esports: 'https://forms.google.com/nexus-esports-form-placeholder',
      'shark-tank': 'https://forms.google.com/nexus-shark-tank-form-placeholder',
      song: 'https://forms.google.com/nexus-song-form-placeholder',
      dance: 'https://forms.google.com/nexus-dance-form-placeholder',
      'talent-show': 'https://forms.google.com/nexus-talent-show-form-placeholder',
    },
  },
  socials: {
    instagramUrl: 'https://www.instagram.com/caads.adse/',
    instagramHandle: '@caads.adse',
    contactEmail: 'caads@christuniversity.in',
    websiteUrl: 'https://nexus.christuniversity.in',
  },
  branding: {
    nexusLogo: '/assets/logos/nexus-logo.webp',
    deptLogo: '/assets/logos/dept-logo.webp',
    caadsLogo: '/assets/logos/caads-logo.webp',
    christLogo: '/assets/logos/christ-logo.webp',
  },
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Worlds', href: '#worlds' },
    { label: 'Events', href: '#events' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
};
