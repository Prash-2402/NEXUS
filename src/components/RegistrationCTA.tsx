import React from 'react';
import { siteConfig } from '../config/site';
import { ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RegistrationCTAProps {
  onRegisterClick: () => void;
}

export const RegistrationCTA: React.FC<RegistrationCTAProps> = ({ onRegisterClick }) => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#17102E] via-[#090817] to-[#030308] border border-[#813CFF]/40 shadow-2xl overflow-hidden text-center">

          {/* Ambient Lighting Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-[#315CFF]/20 via-[#813CFF]/25 to-[#F5C451]/15 filter blur-[100px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C451]/10 border border-[#F5C451]/30 text-xs font-semibold text-[#F5C451] mb-5">
              Official Event Registrations
            </div>

            <h2 className="font-space text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              STEP INTO THE NEXUS UNIVERSE
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#A1A1B5] leading-relaxed">
              Each competition features a dedicated Google Form for team and individual submissions. Explore our complete event roster and secure your spot.
            </p>

            {/* Feature Checkpoints */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#F8FAFC]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                <span>Dedicated Event Forms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#813CFF]" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5C451]" />
                <span>Open to All Universities</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-space text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] hover:opacity-95 transition-all shadow-xl shadow-[#813CFF]/40 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#F5C451]"
              >
                <span>{siteConfig.registration.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <p className="mt-4 text-xs text-[#A1A1B5] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
              {siteConfig.registration.notice}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

