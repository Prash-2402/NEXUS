import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scroll spy for active section highlight
      const sections = ['about', 'worlds', 'events', 'experience', 'schedule', 'organizers', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030308]/90 backdrop-blur-md border-b border-[#813CFF]/25 shadow-xl shadow-black/50 py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-[#030308]/90 via-[#030308]/60 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Top Corner: Department Logo + CAADS Logo (No NEXUS Logo) */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
          {/* Department Logo */}
          <a
            href="#hero"
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#315CFF] rounded-xl transition-transform hover:scale-105"
            aria-label={siteConfig.departmentName}
          >
            <img
              src={siteConfig.branding.deptLogo}
              alt={siteConfig.departmentName}
              className="h-11 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_16px_rgba(49,92,255,0.4)]"
            />
          </a>

          {/* CAADS Logo Next to Department Logo */}
          <div className="flex items-center transition-transform hover:scale-105">
            <img
              src={siteConfig.branding.caadsLogo}
              alt="CAADS"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(129,60,255,0.35)]"
            />
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {siteConfig.navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-[#813CFF] ${
                  isActive
                    ? 'text-white'
                    : 'text-[#A1A1B5] hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Corner: CHRIST University Logo & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
          {/* CHRIST Logo */}
          <div className="flex items-center transition-transform hover:scale-105">
            <img
              src={siteConfig.branding.christLogo}
              alt="CHRIST (Deemed to be University)"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(245,196,81,0.25)]"
            />
          </div>

          {/* Primary Action Button (Desktop) */}
          <div className="hidden 2xl:flex items-center">
            <button
              onClick={onRegisterClick}
              className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#813CFF] focus:ring-offset-2 focus:ring-offset-[#030308]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[1px] bg-[#090817] rounded-[7px] transition-all group-hover:bg-opacity-40" />
              <span className="relative z-10 text-white flex items-center gap-1.5 font-space font-medium">
                REGISTER
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Hamburger Menu Toggle (When Links are hidden) */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A1A1B5] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#813CFF] rounded-lg bg-[#090817] border border-[#813CFF]/20"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#090817]/95 backdrop-blur-xl border-b border-[#813CFF]/30 px-5 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-[#A1A1B5] hover:text-white hover:bg-[#17102E]/60 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#813CFF]/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRegisterClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] rounded-lg shadow-lg shadow-[#813CFF]/30"
              >
                {siteConfig.registration.ctaText}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

