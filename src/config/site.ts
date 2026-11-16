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
      'murder-mystery': 'https://docs.google.com/forms/d/1WCGz58tWaL4O1EeTpZQSCrbqQI25L1a9aY6vedB4zfw/edit',
      'cryptic-hunt': 'https://docs.google.com/forms/d/12xoaJgYVsFwP_zijhouE7Kymx6Y5z-2-UMSMUtdL-z4/edit',
      'reverse-engineering': 'https://docs.google.com/forms/d/1_605kFC5RXWXizeXusRjft7IwiteJMgV3yMxec5SZRA/edit',
      'nexus-olympics': 'https://docs.google.com/forms/d/e/1FAIpQLSdLITNC1UG5-b-77-cuxTodvyIiL47KmDVHcECLgRJp6ZiqGA/viewform',
      'family-feud': 'https://forms.google.com/nexus-family-feud-form-placeholder',
      esports: 'https://docs.google.com/forms/d/1NXdPEIEq1r5AtzT6QvjDW6qaD7cldZoCFE2VGwXUAi0/edit',
      'shark-tank': 'https://docs.google.com/forms/d/1yHUvcnZAuiarnVDrdavZeaxHrwm3mAQoGfveLQFUi9E/edit',
      song: 'https://docs.google.com/forms/d/1DEOiFEZq7EzPTP5ZNHLlaXewkQWNheGInQ7aJNkM_mI/edit',
      dance: 'https://docs.google.com/forms/d/1yh3D4QocibpdEcgwiGu4xYguVG7PWRcByP9ZYxsIO14/edit',
      'talent-show': 'https://docs.google.com/forms/d/15yKqQ-aY_3NswbYt9yvBxIYgDuLlPPvN-BccljGkBqw/edit',
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
