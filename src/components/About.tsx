import React from 'react';
import { siteConfig } from '../config/site';
import { Cpu, Trophy, Palette, Orbit } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-4">
          <Orbit className="w-4 h-4 text-[#813CFF] animate-spin-very-slow" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#A1A1B5] font-semibold font-space">
            Genesis &amp; Purpose
          </span>
        </div>

        {/* Editorial Heading */}
        <div className="max-w-4xl">
          <h2 className="font-space text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            MORE THAN AN EVENT.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451]">
              A CONVERGENCE.
            </span>
          </h2>
        </div>

        {/* Narrative & Animated Convergence Orbit Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-[#A1A1B5] font-normal leading-relaxed">
            <p className="text-white/90 text-lg sm:text-xl font-light leading-relaxed">
              NEXUS is an AI Utsav bringing together technology, creativity, competition, and culture. From technical challenges and innovative ideas to competitive experiences and cultural expression, NEXUS creates a space for students to explore their interests, showcase their abilities, and connect across disciplines.
            </p>
            <p>
              Organized by <strong className="text-white font-medium">{siteConfig.organizingClub}</strong> at{' '}
              <strong className="text-white font-medium">{siteConfig.institution}</strong>, the festival is architected around a central creative axiom: <em className="text-[#38bdf8] font-normal not-italic">"Different worlds converging into one universe."</em>
            </p>
            <p className="text-sm text-[#A1A1B5]">
              Whether decrypting advanced cyphers, orchestrating team strategies across the NEXUS Olympics, or commanding the auditorium spotlight through musical and choreographic arts, each dimension offers an immersive proving ground.
            </p>

            {/* Three Converging Dimensions Summary */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#090817]/80 border border-[#315CFF]/30 hover:border-[#315CFF]/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#315CFF]/15 flex items-center justify-center text-[#315CFF] mb-2.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-space font-semibold text-white text-sm">Technical</h3>
                <p className="text-xs text-[#A1A1B5] mt-1">Hackathon, Cryptic Hunt, Reverse Engineering &amp; Workshops.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090817]/80 border border-[#813CFF]/30 hover:border-[#813CFF]/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#813CFF]/15 flex items-center justify-center text-[#813CFF] mb-2.5">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="font-space font-semibold text-white text-sm">Non-Technical</h3>
                <p className="text-xs text-[#A1A1B5] mt-1">Sports, Murder Mystery &amp; the 6-in-1 NEXUS Olympics.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090817]/80 border border-[#F5C451]/30 hover:border-[#F5C451]/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 flex items-center justify-center text-[#F5C451] mb-2.5">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-space font-semibold text-white text-sm">Cultural</h3>
                <p className="text-xs text-[#A1A1B5] mt-1">Dance, Song &amp; Grand Finale Talent Show.</p>
              </div>
            </div>
          </div>

          {/* Mobile-Only Inline Visual (On desktop, repositioned fixed widget covers watermark) */}
          <div className="lg:hidden flex items-center justify-center pt-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#315CFF]/20 via-[#813CFF]/20 to-[#F5C451]/20 filter blur-2xl animate-pulse-slow" />
              
              {/* Orbit 1: Technical (Blue) */}
              <div 
                className="absolute inset-3 border border-dashed border-[#315CFF]/40 rounded-full animate-spin-very-slow"
                style={{ animationDuration: '40s' }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#315CFF] shadow-[0_0_12px_#315CFF] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Orbit 2: Non-Technical (Violet) */}
              <div 
                className="absolute inset-10 border border-[#813CFF]/40 rounded-full animate-spin-very-slow"
                style={{ animationDirection: 'reverse', animationDuration: '28s' }}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#813CFF] shadow-[0_0_15px_#813CFF] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              {/* Orbit 3: Cultural (Stellar Gold) */}
              <div 
                className="absolute inset-20 border border-dotted border-[#F5C451]/50 rounded-full animate-spin-very-slow"
                style={{ animationDuration: '20s' }}
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F5C451] shadow-[0_0_14px_#F5C451] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Central Singularity / Core */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#17102E] to-[#030308] border border-[#813CFF]/60 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(129,60,255,0.4)]">
                <span className="font-space font-extrabold text-white text-base tracking-wider">NEXUS</span>
                <span className="text-[8px] font-space tracking-widest text-[#F5C451] uppercase">AI UTSAV</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

