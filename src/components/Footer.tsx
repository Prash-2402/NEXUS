import React from 'react';
import { siteConfig } from '../config/site';
import { ArrowUp, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  onRegisterClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRegisterClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-transparent border-t border-[#813CFF]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Attributions (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={siteConfig.branding.nexusLogo}
                alt="NEXUS Logo"
                className="h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(129,60,255,0.4)]"
              />
            </div>
            
            <p className="text-xs uppercase font-space tracking-[0.25em] text-[#38bdf8] font-semibold">
              {siteConfig.eventIdentity}
            </p>

            <p className="text-sm text-[#A1A1B5] max-w-sm leading-relaxed">
              Organized by <strong className="text-white font-medium">{siteConfig.organizingClub}</strong> ({siteConfig.organizingClubFullName}) under the <strong className="text-white font-medium">{siteConfig.departmentName}</strong>.
            </p>

            <div className="text-xs text-[#F5C451] font-mono">
              {siteConfig.dates.display}
            </div>

            {/* Official Co-Branding Badges */}
            <div className="flex items-center gap-4 pt-2">
              <img
                src={siteConfig.branding.deptLogo}
                alt="Department"
                className="h-10 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(49,92,255,0.4)]"
              />
              <img
                src={siteConfig.branding.caadsLogo}
                alt="CAADS"
                className="h-8 w-auto object-contain"
              />
              <img
                src={siteConfig.branding.christLogo}
                alt="CHRIST (Deemed to be University)"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

          {/* Quick Navigation (Col 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-space text-sm font-semibold uppercase tracking-wider text-white">
              Universe
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1B5]">
              {siteConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Registration & Connect (Col 9-12) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-space text-sm font-semibold uppercase tracking-wider text-white">
              Registration &amp; Channels
            </h4>
            <p className="text-xs text-[#A1A1B5] leading-relaxed">
              Join students across universities in the ultimate convergence of intelligence, competition, and creativity.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] to-[#813CFF] hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-[#813CFF]/30"
              >
                Register Now
              </button>
              
              <a
                href={siteConfig.socials.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#F5C451]/50 text-[#A1A1B5] hover:text-[#F5C451] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${siteConfig.socials.contactEmail}`}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#38bdf8]/50 text-[#A1A1B5] hover:text-[#38bdf8] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Attribution & Back To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1B5]">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} NEXUS. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Organized by CAADS • CHRIST (Deemed to be University)</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#A1A1B5] hover:text-white transition-colors"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

