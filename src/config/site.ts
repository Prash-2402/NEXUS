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
  departmentName: 'Department of AI and Data Science Engineering',
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
      // Public Google Form links, one per event. Leave an event out (or empty) to show "Registration opens soon".
      'murder-mystery': 'https://docs.google.com/forms/d/e/1FAIpQLSdWUP4dh3_X6eDPTT7NdAKy1WnNGox-KyzHvmd2qcQ3-GWUtA/viewform',
      'cryptic-hunt': 'https://docs.google.com/forms/d/e/1FAIpQLSc1ftK4j1FPEl3VB2w5wdSQXmlDKWrp3ODHBUqlFT3wNavJKw/viewform',
      'reverse-engineering': 'https://docs.google.com/forms/d/e/1FAIpQLScSbnxFOn3MU2qz1VTEEBMRIkqNv2H-Cfqwy9uiQXTUSxjkaQ/viewform',
      'family-feud': 'https://docs.google.com/forms/d/e/1FAIpQLSf26tKlQfLokCTwQVFoZ4UFL45Zc2EOnWW4C56Q27n1BjldnA/viewform',
      esports: 'https://docs.google.com/forms/d/e/1FAIpQLSfF1agNUBH_OtcEo7LbW-kJT0VtbbUzs2Df66rbWIDm9CWJtA/viewform',
      'shark-tank': 'https://docs.google.com/forms/d/e/1FAIpQLSd46On5sQ57FcTo8PD3FkgWPXPwaoYM31rrYv0t2fX1KzwdYw/viewform',
      song: 'https://docs.google.com/forms/d/e/1FAIpQLSet2AWF5v4Q0yuY6uZIVgfbY2_0vdkjnydB6sz-PpImFfGnqA/viewform',
      'talent-show': 'https://docs.google.com/forms/d/e/1FAIpQLSeax1p9TLbqqrwmQgzfocbLwBfUsCWaE9mIhnaFnSYiNMm4bQ/viewform',
      dance: 'https://docs.google.com/forms/d/e/1FAIpQLScbSJT-i-AU6A2Oh7nq95aCbBBWc_eblaCnfDrC0Az7NwtkTw/viewform',
      'tableau-workshop': '',
      'ai-workshop': 'https://docs.google.com/forms/d/e/1FAIpQLScKHVaUhfcBMx2xaUOnn2HdcQlHPA1lHZnPnCpCYULaYhmBVA/viewform',
      'nexus-olympics': 'https://docs.google.com/forms/d/e/1FAIpQLSdLITNC1UG5-b-77-cuxTodvyIiL47KmDVHcECLgRJp6ZiqGA/viewform',
    },
  },
  socials: {
    instagramUrl: 'https://www.instagram.com/caads.adse/',
    instagramHandle: '@caads.adse',
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
