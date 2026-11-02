/**
 * NEXUS — Global Site Configuration
 * 
 * Centralized configuration for all event metadata, branding, registration URLs,
 * and contact links. Organizers can update these values here without touching component code.
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
  institutionFullName: string;
  location: string;
  dates: {
    display: string;
    startDate: string; // ISO 8601 string
    endDate: string;   // ISO 8601 string
    timezone: string;
  };
  registration: {
    status: 'open' | 'coming_soon' | 'closed';
    ctaText: string;
    ctaSubtext: string;
    notice: string;
    // Central map of separate Google Forms for each individual event
    eventForms: Record<string, string>;
  };
  media: {
    promoVideoUrl: string; // YouTube embed URL or direct video URL
    localVideoUrl?: string; // Local MP4 video asset (e.g. /reel.mp4)
    promoVideoThumbnail: string;
    hasVideoConfigured: boolean;
  };
  socials: {
    instagramUrl: string;
    contactEmail: string;
    websiteUrl: string;
  };
  branding: {
    nexusLogo: string;
    deptLogo: string;
    caadsLogo: string;
    christLogo: string;
    caadsLogoWhite?: string;
    christLogoWhite?: string;
    departmentLogo?: string;
  };
  navLinks: Array<{ label: string; href: string }>;
}

export const siteConfig: SiteConfig = {
  eventName: "NEXUS",
  eventIdentity: "An AI Utsav",
  // The official tagline is not finalized yet. Edit this single field to update globally.
  tagline: "Where Intelligence Converges With Human Spirit",
  conceptIdea: "Different worlds converging into one universe.",
  departmentName: "Department of AI & Data Science Engineering",
  organizingClub: "CAADS",
  organizingClubFullName: "Christites Association of AI and Data Science",
  institution: "CHRIST (Deemed to be University)",
  institutionFullName: "CHRIST (Deemed to be University), Bangalore",
  location: "Bangalore, India",
  dates: {
    display: "23 November 2026 – 5 December 2026",
    // 23 Nov 2026 09:00 AM IST
    startDate: "2026-11-23T09:00:00+05:30",
    // 5 Dec 2026 18:00 PM IST
    endDate: "2026-12-05T18:00:00+05:30",
    timezone: "Asia/Kolkata",
  },
  registration: {
    status: "open", // Options: 'open', 'coming_soon', 'closed'
    ctaText: "EXPLORE EVENTS & REGISTER",
    ctaSubtext: "Dedicated Google Form registration for each Technical, Non-Technical & Cultural event",
    notice: "Official event Google Forms open in a new tab.",
    // Separate Google Form links for every event. Paste official links here:
    eventForms: {
      hackathon: "https://forms.google.com/nexus-hackathon-form-placeholder",
      "cryptic-hunt": "https://forms.google.com/nexus-cryptic-hunt-form-placeholder",
      "reverse-engineering": "https://forms.google.com/nexus-reverse-engineering-form-placeholder",
      workshops: "https://forms.google.com/nexus-workshops-form-placeholder",
      sports: "https://forms.google.com/nexus-esports-form-placeholder",
      esports: "https://forms.google.com/nexus-esports-form-placeholder",
      "murder-mystery": "https://forms.google.com/nexus-murder-mystery-form-placeholder",
      "nexus-olympics": "https://forms.google.com/nexus-olympics-form-placeholder",
      dance: "https://forms.google.com/nexus-dance-form-placeholder",
      song: "https://forms.google.com/nexus-song-form-placeholder",
      "talent-show": "https://forms.google.com/nexus-talent-show-form-placeholder",
      "family-feud": "https://forms.google.com/nexus-family-feud-form-placeholder",
      "shark-tank": "https://forms.google.com/nexus-shark-tank-form-placeholder",
    },
  },
  media: {
    promoVideoUrl: "", // Provide YouTube embed URL if desired
    localVideoUrl: "/reel.mp4", // Official local teaser reel asset
    promoVideoThumbnail: "/assets/backgrounds/reel-poster.jpg",
    hasVideoConfigured: true,
  },
  socials: {
    instagramUrl: "https://instagram.com/caads_christ",
    contactEmail: "caads@christuniversity.in",
    websiteUrl: "https://nexus.christuniversity.in",
  },
  branding: {
    nexusLogo: "/assets/logos/nexus-orbital-logo.png",
    deptLogo: "/assets/logos/dept-logo.png",
    caadsLogo: "/assets/logos/caads-logo-white.png",
    caadsLogoWhite: "/assets/logos/caads-logo-white.png",
    christLogo: "/assets/logos/christ-logo-white.png",
    christLogoWhite: "/assets/logos/christ-logo-white.png",
  },
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Worlds", href: "#worlds" },
    { label: "Events", href: "#events" },
    { label: "Experience", href: "#experience" },
    { label: "Schedule", href: "#schedule" },
    { label: "Organizers", href: "#organizers" },
    { label: "FAQ", href: "#faq" },
  ],
};
