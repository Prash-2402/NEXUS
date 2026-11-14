import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { useCountdown } from '../hooks/useCountdown';
import { gsap, useGsap } from '../lib/motion';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Hero({ onRegisterClick, onExploreClick }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const countdown = useCountdown(siteConfig.dates.startDate, siteConfig.dates.endDate);

  useGsap(ref, () => {
    // Intro
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('[data-hero="logo"]', { autoAlpha: 0, scale: 0.92, filter: 'blur(14px)', duration: 1.8 })
      .from('[data-hero="eyebrow"]', { autoAlpha: 0, y: 12, duration: 1 }, 0.4)
      .from('[data-hero="tagline"] .split-word > span', { yPercent: 115, duration: 1.2, stagger: 0.08 }, 0.7)
      .from('[data-hero="fade"]', { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.1 }, 1.0);

    // Drift away as the journey begins
    gsap.to('[data-hero="content"]', {
      yPercent: -18,
      autoAlpha: 0,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
    });
    gsap.to('[data-hero="cue"]', {
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: '15% top', scrub: true },
    });
  });

  const units = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <section ref={ref} id="hero" data-stage="0" className="relative z-10 flex min-h-[100svh] items-center pb-24 pt-28">
      <div data-hero="content" className="container-site flex flex-col items-center text-center">
        <p data-hero="eyebrow" className="font-mono text-[11px] uppercase tracking-label text-fg-muted sm:text-xs">
          {siteConfig.organizingClub} presents · {siteConfig.eventIdentity}
        </p>

        <h1 className="sr-only">
          {siteConfig.eventName}, {siteConfig.eventIdentity}. {siteConfig.tagline}.
        </h1>
        <img
          data-hero="logo"
          src={siteConfig.branding.nexusLogo}
          alt=""
          width={1200}
          height={393}
          className="mt-8 w-[min(90vw,780px)] select-none drop-shadow-[0_0_60px_rgba(110,150,255,0.35)]"
          draggable={false}
        />

        <p data-hero="tagline" className="mt-6 font-display text-2xl font-medium tracking-tight text-fg sm:mt-8 sm:text-4xl" aria-hidden="true">
          {siteConfig.tagline.split(' ').map((w, i, all) => (
            <span key={i}>
              <span className="split-word">
                <span className={i === all.length - 1 ? 'text-gradient' : ''}>{w}</span>
              </span>
              {i < all.length - 1 && ' '}
            </span>
          ))}
        </p>

        <p data-hero="fade" className="mt-4 font-mono text-[11px] uppercase tracking-label text-fg-muted sm:text-xs">
          <span className="block sm:inline">{siteConfig.dates.display}</span>
          <span className="mx-3 hidden text-fg-faint sm:inline">/</span>
          <span className="mt-1 block sm:mt-0 sm:inline">{siteConfig.campus}</span>
        </p>

        <div data-hero="fade" className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <button onClick={onExploreClick} className="btn-primary w-full sm:w-auto">
            Explore events
            <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={onRegisterClick} className="btn-ghost w-full sm:w-auto">
            Register now
          </button>
        </div>

        <div data-hero="fade" className="mt-12 sm:mt-14" aria-live="off">
          {countdown.status === 'upcoming' ? (
            <dl className="flex items-stretch divide-x divide-white/10" aria-label="Countdown to NEXUS">
              {units.map((u) => (
                <div key={u.label} className="px-4 text-center sm:px-7">
                  <dd className="font-display text-3xl font-medium tabular-nums text-fg sm:text-4xl">{pad(u.value)}</dd>
                  <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">{u.label}</dt>
                </div>
              ))}
            </dl>
          ) : (
            <p className="font-mono text-xs uppercase tracking-label text-gold">{countdown.formattedString}</p>
          )}
        </div>
      </div>

      <a
        data-hero="cue"
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 [@media(min-height:860px)]:flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-label text-fg-faint transition-colors hover:text-fg"
      >
        Scroll to begin
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </span>
      </a>
    </section>
  );
}
