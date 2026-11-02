import React from 'react';
import { siteConfig } from '../config/site';
import { Award, ExternalLink, ShieldCheck, GraduationCap } from 'lucide-react';

export const Organizers: React.FC = () => {
  return (
    <section
      id="organizers"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C451]/10 border border-[#F5C451]/25 text-xs font-semibold text-[#F5C451] mb-4">
            <Award className="w-3.5 h-3.5" />
            Leadership &amp; Stewardship
          </div>
          <h2 className="font-space text-3xl sm:text-5xl font-bold tracking-tight text-white">
            THE ORGANIZERS
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#A1A1B5]">
            NEXUS is organized by the {siteConfig.departmentName} and {siteConfig.organizingClub} ({siteConfig.organizingClubFullName}).
          </p>
        </div>

        {/* Cohesive Brand Identity Grid: Department & CAADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Academic Department */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#090817] to-[#17102E]/60 border border-[#315CFF]/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between group hover:border-[#315CFF]/70 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#38bdf8] px-3 py-1 rounded-full bg-[#315CFF]/15 border border-[#315CFF]/30 font-semibold">
                  Academic Department
                </span>
                <span className="text-xs text-[#A1A1B5] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8]" />
                  Academic Patron
                </span>
              </div>

              {/* Official Department Logo Container (No Background) */}
              <div className="w-full max-w-xs h-16 flex items-center mb-6">
                <img
                  src={siteConfig.branding.deptLogo}
                  alt={siteConfig.departmentName}
                  className="max-h-full w-auto object-contain filter drop-shadow-[0_0_12px_rgba(49,92,255,0.4)]"
                />
              </div>

              <h3 className="font-space text-2xl font-bold text-white mb-2">
                {siteConfig.departmentName}
              </h3>
              <p className="text-xs sm:text-sm text-[#38bdf8] font-mono mb-4">
                Engineering &amp; Technology
              </p>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Fostering world-class education, research, and technical ingenuity in artificial intelligence and data science engineering. The Department provides visionary academic stewardship and leadership for NEXUS.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#A1A1B5]">
                Academic Leadership
              </span>
              <span className="text-xs font-semibold text-[#38bdf8]">
                Department
              </span>
            </div>
          </div>

          {/* Card 2: CAADS Organizing Association */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#090817] to-[#17102E]/60 border border-[#813CFF]/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between group hover:border-[#813CFF]/70 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#c084fc] px-3 py-1 rounded-full bg-[#813CFF]/15 border border-[#813CFF]/30 font-semibold">
                  Student Association
                </span>
                <span className="text-xs text-[#A1A1B5] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#813CFF]" />
                  Flagship Festival
                </span>
              </div>

              {/* Official CAADS Logo Container (No Background) */}
              <div className="w-full max-w-xs h-16 flex items-center mb-6">
                <img
                  src={siteConfig.branding.caadsLogo}
                  alt={siteConfig.organizingClub}
                  className="max-h-full w-auto object-contain filter drop-shadow-[0_0_12px_rgba(129,60,255,0.35)]"
                />
              </div>

              <h3 className="font-space text-2xl font-bold text-white mb-2">
                {siteConfig.organizingClub}
              </h3>
              <p className="text-xs sm:text-sm text-[#F5C451] font-mono mb-4">
                {siteConfig.organizingClubFullName}
              </p>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                CAADS champions computational thinking, artificial intelligence research, and multidisciplinary student innovation. As the official student association behind NEXUS, CAADS drives the technical, creative, and collaborative execution of the festival.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#A1A1B5]">
                @caads_christ
              </span>
              <a
                href={siteConfig.socials.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#38bdf8] transition-colors"
              >
                <span>Visit Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

