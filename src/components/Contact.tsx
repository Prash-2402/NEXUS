import React from 'react';
import { siteConfig } from '../config/site';
import { Mail, Instagram, MapPin, Building2, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#315CFF]/15 border border-[#315CFF]/30 text-xs font-semibold text-[#38bdf8] mb-4">
            <Mail className="w-3.5 h-3.5" />
            Direct Communications
          </div>
          <h2 className="font-space text-3xl sm:text-5xl font-bold tracking-tight text-white">
            STAY CONNECTED TO THE NEXUS
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#A1A1B5]">
            Reach out to the CAADS organizing committee for inquiries, partnerships, or assistance.
          </p>
        </div>

        {/* Contact Methods Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Official Email */}
          <div className="p-7 rounded-2xl bg-[#090817]/80 border border-[#813CFF]/30 hover:border-[#813CFF]/60 transition-all flex flex-col justify-between group backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#813CFF]/15 border border-[#813CFF]/30 flex items-center justify-center text-[#c084fc] mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-space text-lg font-bold text-white mb-1">
                Official Inquiries
              </h3>
              <p className="text-xs text-[#A1A1B5] mb-4">
                General queries, event guidelines, and registration assistance.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.socials.contactEmail}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#38bdf8] hover:text-white transition-colors break-all"
            >
              <span>{siteConfig.socials.contactEmail}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Card 2: Instagram */}
          <div className="p-7 rounded-2xl bg-[#090817]/80 border border-[#F5C451]/25 hover:border-[#F5C451]/60 transition-all flex flex-col justify-between group backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F5C451]/15 border border-[#F5C451]/30 flex items-center justify-center text-[#F5C451] mb-5 group-hover:scale-105 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-space text-lg font-bold text-white mb-1">
                Official Instagram
              </h3>
              <p className="text-xs text-[#A1A1B5] mb-4">
                Follow behind-the-scenes teasers, live scoreboards, and announcements.
              </p>
            </div>
            <a
              href={siteConfig.socials.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5C451] hover:text-white transition-colors"
            >
              <span>@caads_christ</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="p-7 rounded-2xl bg-[#090817]/80 border border-[#315CFF]/30 hover:border-[#315CFF]/60 transition-all flex flex-col justify-between group backdrop-blur-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#315CFF]/15 border border-[#315CFF]/30 flex items-center justify-center text-[#38bdf8] mb-5 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-space text-lg font-bold text-white mb-1">
                Host Campus
              </h3>
              <p className="text-xs text-[#A1A1B5] mb-4">
                CHRIST (Deemed to be University), Bangalore Central Campus.
              </p>
            </div>
            <div className="text-xs text-[#A1A1B5] flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Bangalore, Karnataka, India</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

