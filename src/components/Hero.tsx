import React from 'react';
import { siteConfig } from '../config/site';
import { useCountdown } from '../hooks/useCountdown';
import { Compass, ChevronDown, Calendar } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, onExploreClick }) => {
  const countdown = useCountdown(siteConfig.dates.startDate, siteConfig.dates.endDate);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 overflow-hidden"
    >
      {/* Subtle Atmospheric Light Behind Hero */}
      <div
        className="absolute w-[320px] sm:w-[550px] md:w-[750px] h-[320px] sm:h-[400px] md:h-[500px] rounded-full pointer-events-none filter blur-[100px] sm:blur-[140px] opacity-20 -z-10"
        style={{
          background:
            'radial-gradient(circle, #813CFF 0%, #315CFF 45%, #F5C451 75%, transparent 100%)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center z-10">
        
        {/* Small Uppercase Event Identity */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#315CFF]" />
          <span className="text-xs sm:text-sm font-space uppercase tracking-[0.35em] text-[#38bdf8] font-semibold">
            {siteConfig.eventIdentity}
          </span>
          <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#813CFF]" />
        </div>

        {/* Hero Title Focal Point: Official NEXUS Orbital Glass Logo */}
        <div className="relative my-4 sm:my-8 w-full flex flex-col items-center justify-center">
          <div className="relative w-full max-w-4xl lg:max-w-5xl px-2 sm:px-4 flex items-center justify-center">
            {/* Luminous Cosmic Aura Behind Logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#315CFF]/30 via-[#813CFF]/45 to-[#F5C451]/25 filter blur-3xl rounded-full opacity-80 pointer-events-none -z-10 scale-105" />
            
            {/* Orbital Glass Logo Image */}
            <img
              src={siteConfig.branding.nexusLogo}
              alt="NEXUS"
              className="w-full h-auto max-h-[200px] sm:max-h-[280px] md:max-h-[360px] lg:max-h-[420px] object-contain filter drop-shadow-[0_0_50px_rgba(129,60,255,0.65)] select-none transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
          <h1 className="sr-only">NEXUS — An AI Utsav</h1>
        </div>

        {/* Central Concept & Official Tagline Placeholder */}
        <p className="mt-2 text-base sm:text-lg md:text-xl font-medium text-[#F8FAFC]/90 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.tagline}
        </p>
        <p className="mt-1 text-xs sm:text-sm text-[#A1A1B5] italic font-light tracking-wide">
          "{siteConfig.conceptIdea}"
        </p>

        {/* Dates Badge */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#F8FAFC]">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#090817]/80 border border-[#315CFF]/30 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-medium">{siteConfig.dates.display}</span>
          </div>
        </div>

        {/* Live Countdown Capsule */}
        <div className="mt-6 w-full max-w-md">
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#090817]/90 via-[#17102E]/80 to-[#090817]/90 border border-[#813CFF]/30 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#A1A1B5] mb-2 px-1">
              <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-[#F8FAFC]">
                <span className="w-2 h-2 rounded-full bg-[#F5C451] animate-pulse" />
                Cosmic Launch Status
              </span>
              <span className="text-[11px] text-[#A1A1B5]">Asia/Kolkata (IST)</span>
            </div>

            {countdown.status === 'upcoming' ? (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[#030308]/70 border border-[#315CFF]/20">
                  <span className="block font-space text-lg sm:text-xl font-bold text-white">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] uppercase text-[#A1A1B5]">Days</span>
                </div>
                <div className="p-2 rounded-lg bg-[#030308]/70 border border-[#813CFF]/20">
                  <span className="block font-space text-lg sm:text-xl font-bold text-white">
                    {countdown.hours}
                  </span>
                  <span className="text-[10px] uppercase text-[#A1A1B5]">Hours</span>
                </div>
                <div className="p-2 rounded-lg bg-[#030308]/70 border border-[#813CFF]/20">
                  <span className="block font-space text-lg sm:text-xl font-bold text-white">
                    {countdown.minutes}
                  </span>
                  <span className="text-[10px] uppercase text-[#A1A1B5]">Mins</span>
                </div>
                <div className="p-2 rounded-lg bg-[#030308]/70 border border-[#F5C451]/20">
                  <span className="block font-space text-lg sm:text-xl font-bold text-[#F5C451]">
                    {countdown.seconds}
                  </span>
                  <span className="text-[10px] uppercase text-[#A1A1B5]">Secs</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-sm font-semibold text-[#F5C451]">
                {countdown.formattedString}
              </div>
            )}
          </div>
        </div>

        {/* Primary and Secondary Call-To-Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: EXPLORE EVENTS */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-space font-semibold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#813CFF] hover:from-[#315CFF]/90 hover:to-[#F5C451]/90 transition-all duration-300 shadow-lg shadow-[#813CFF]/30 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#813CFF] focus:ring-offset-2 focus:ring-offset-[#030308]"
          >
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            EXPLORE EVENTS
          </button>

          {/* Secondary CTA: REGISTER NOW */}
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-space font-semibold text-sm tracking-wider uppercase text-[#F8FAFC] bg-[#090817] hover:bg-[#17102E] border border-[#813CFF]/40 hover:border-[#F5C451]/70 transition-all duration-300 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#F5C451] focus:ring-offset-2 focus:ring-offset-[#030308]"
          >
            REGISTER NOW
          </button>
        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-10 flex flex-col items-center gap-1.5 text-xs text-[#A1A1B5]">
          <span className="uppercase tracking-[0.2em] text-[10px]">Explore The Nexus Universe</span>
          <a
            href="#about"
            className="p-1 rounded-full border border-[#813CFF]/20 text-[#A1A1B5] hover:text-white hover:border-[#813CFF]/50 transition-all animate-bounce"
            aria-label="Scroll down to About section"
          >
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
