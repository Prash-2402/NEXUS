import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { worldOrder, worlds, type NexusEvent } from '../data/events';
import { scheduleDays, type ScheduleItem } from '../data/schedule';
import { gsap, ScrollTrigger, useGsap } from '../lib/motion';
import { cn } from '../lib/utils';
import { statusOf, todayIst, useNow } from '../lib/timing';
import { SectionHeader } from './ui/SectionHeader';

interface ScheduleProps {
  onRegister: (event: NexusEvent) => void;
}

const colorFor = (item: ScheduleItem) => (item.world === 'ceremony' ? '#eef1f8' : worlds[item.world].color);

export function Schedule({ onRegister }: ScheduleProps) {
  const ref = useRef<HTMLElement>(null);
  const now = useNow();
  const today = todayIst(now);

  useGsap(ref, () => {
    gsap.fromTo(
      '[data-timeline-progress]',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-timeline]', start: 'top 60%', end: 'bottom 60%', scrub: true },
      },
    );
    gsap.utils.toArray<HTMLElement>('[data-day]').forEach((day) => {
      ScrollTrigger.create({
        trigger: day,
        start: 'top 60%',
        onEnter: () => day.classList.add('is-past'),
        onLeaveBack: () => day.classList.remove('is-past'),
      });
      // fromTo with explicit end values, so the cards always finish fully visible
      gsap.fromTo(
        day.querySelectorAll('[data-day-reveal]'),
        { autoAlpha: 0, x: 24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.06,
          scrollTrigger: { trigger: day, start: 'top 85%', once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} id="schedule" data-stage="4" className="section">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              index="04"
              label="Schedule"
              title={[{ text: `${scheduleDays.length} days.` }, { text: 'One orbit.', className: 'text-gradient', br: true }]}
              lead={`${siteConfig.dates.display}. Timings can change, so check back before you head out.`}
            />
            <ul className="mt-10 space-y-3" data-reveal>
              {worldOrder.map((id) => (
                <li key={id} className="flex items-center gap-3 text-sm text-fg-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: worlds[id].color }} />
                  {worlds[id].title}
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm text-fg-muted">
                <span className="h-2 w-2 rounded-full bg-fg" />
                Ceremony
              </li>
            </ul>
          </div>
        </div>

        <ol data-timeline className="relative lg:col-span-8">
          <span className="absolute bottom-0 left-[27px] top-0 w-px bg-white/[0.08] sm:left-[39px]" aria-hidden="true" />
          <span
            data-timeline-progress
            className="absolute bottom-0 left-[27px] top-0 w-px origin-top bg-gradient-to-b from-tech via-strat to-gold sm:left-[39px]"
            aria-hidden="true"
          />

          {/* Only days that have events; empty dates are left out */}
          {scheduleDays.filter((day) => day.items.length > 0).map((day) => {
            const isToday = day.date === today;
            return (
              <li
                key={day.date}
                data-day
                className="group relative flex gap-5 pb-10 sm:gap-8"
              >
                <div className="relative z-10 w-14 shrink-0 text-center sm:w-20">
                  <div
                    className={cn(
                      'mx-auto flex w-14 flex-col items-center rounded-2xl border bg-ink-950 py-2 transition-colors duration-700 sm:w-16',
                      'border-white/10 group-[.is-past]:border-white/25',
                      isToday && 'border-gold/70',
                    )}
                  >
                    <span className="font-display text-xl font-semibold leading-none text-fg-muted transition-colors duration-700 group-[.is-past]:text-fg">
                      {day.day}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-faint">{day.month}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint" data-day-reveal>
                    {day.weekday}
                    {isToday && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold">Today</span>}
                  </p>

                    <div className="mt-3 space-y-3">
                      {day.items.map((item) => {
                        const status = statusOf(day.date, item.time, now);
                        return (
                        <div
                          key={item.key}
                          data-day-reveal
                          className={cn(
                            'relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-ink-900/85 p-5 backdrop-blur-md transition-[border-color,filter] hover:border-white/15 sm:flex-row sm:items-center sm:justify-between',
                            status === 'live' ? 'border-gold/40' : 'border-white/[0.07]',
                            // dim with a filter, not opacity: GSAP owns the opacity for the reveal
                            status === 'done' && '[filter:saturate(0.4)_brightness(0.6)] hover:[filter:none]',
                          )}
                        >
                          <span className="absolute inset-y-0 left-0 w-[2px]" style={{ background: colorFor(item) }} />
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-semibold text-fg">
                              {item.name}
                              {item.label && <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-fg-faint">{item.label}</span>}
                              {status === 'live' && (
                                <span className="ml-2 inline-flex translate-y-[-2px] items-center gap-1.5 rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-gold">
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                                  Live now
                                </span>
                              )}
                              {status === 'done' && (
                                <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-fg-faint">Done</span>
                              )}
                            </h3>
                            <p className="mt-1 text-[13px] text-fg-muted">
                              <span className="block whitespace-nowrap sm:inline">{item.time}</span>
                              <span className="mx-2 hidden text-fg-faint sm:inline">·</span>
                              <span className="block sm:inline">{item.venue}</span>
                            </p>
                          </div>
                          {item.event?.registrationEnabled && status !== 'done' && (
                            <button
                              onClick={() => item.event && onRegister(item.event)}
                              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/15 px-4 py-2 text-[13px] text-fg transition-colors hover:border-white/40 hover:bg-white/[0.04] sm:self-auto"
                              aria-label={`Register for ${item.name}`}
                            >
                              Register
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        );
                      })}
                    </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
