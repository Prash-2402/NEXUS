import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';

interface NavbarProps {
  onRegisterClick: () => void;
}

export function Navbar({ onRegisterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down, show on scroll up, and drive the progress bar.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const ids = siteConfig.navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          scrolled || open
            ? 'border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <a href="#hero" className="flex shrink-0 items-center gap-3" aria-label="NEXUS home">
            <img src={siteConfig.branding.deptLogo} alt={siteConfig.departmentName} className="h-9 w-9 sm:h-10 sm:w-10" width={40} height={40} />
            <span className="h-6 w-px bg-white/15" />
            <img src={siteConfig.branding.caadsLogo} alt="CAADS" className="h-7 w-auto sm:h-8" height={32} />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {siteConfig.navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {isActive && <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]" />}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <img
              src={siteConfig.branding.christLogo}
              alt={siteConfig.institution}
              className="hidden h-8 w-auto opacity-90 sm:block"
              height={32}
            />
            <button onClick={onRegisterClick} className="btn-primary hidden px-5 py-2.5 text-[13px] md:inline-flex">
              Register
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-fg lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-ice via-strat to-gold"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl transition-opacity duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav className="container-site flex h-full flex-col justify-center gap-1 pt-16" aria-label="Mobile">
          {siteConfig.navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-4xl font-medium text-fg transition-all duration-700 ease-out',
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
            >
              <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
              {link.label}
            </a>
          ))}
          <button
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onRegisterClick();
            }}
            className={cn(
              'btn-primary mt-8 w-full py-4 transition-all duration-700',
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
            )}
            style={{ transitionDelay: open ? '420ms' : '0ms' }}
          >
            Register for an event
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-label text-fg-faint">
            {siteConfig.dates.short}
          </p>
        </nav>
      </div>
    </>
  );
}
