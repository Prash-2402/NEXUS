import { useMemo, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { worldOrder, worlds, type NexusEvent } from '../data/events';
import { scheduleDays, type ScheduleItem } from '../data/schedule';
import { gsap, ScrollTrigger, useGsap } from '../lib/motion';
import { cn } from '../lib/utils';
import { SectionHeader } from './ui/SectionHeader';

interface ScheduleProps {
  onRegister: (event: NexusEvent) => void;
}

const colorFor = (item: ScheduleItem) => (item.world === 'ceremony' ? '#eef1f8' : worlds[item.world].color);

function todayIso() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: siteConfig.dates.timezone }).format(new Date());
}

export function Schedule({ onRegister }: ScheduleProps) {
  const ref = useRef<HTMLElement>(null);
  const today = useMemo(todayIso, []);

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
      gsap.from(day.querySelectorAll('[data-day-reveal]'), {
        autoAlpha: 0,
        x: 24,
        duration: 0.9,
        stagger: 0.06,
        scrollTrigger: { trigger: day, start: 'top 85%', once: true },
      });
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

          {scheduleDays.map((day) => {
            const isToday = day.date === today;
            const empty = day.items.length === 0;
            return (
              <li
                key={day.date}
                data-day
                className={cn('group relative flex gap-5 sm:gap-8', empty ? 'pb-6' : 'pb-10')}
              >
                <div className="relative z-10 w-14 shrink-0 text-center sm:w-20">
                  <div
                    className={cn(
                      'mx-auto flex w-14 flex-col items-center rounded-2xl border bg-ink-950 py-2 transition-colors duration-700 sm:w-16',
                      'border-white/10 group-[.is-past]:border-white/25',
                      isToday && 'border-gold/70',
                    )}
                  >
                    <span className={cn('font-display text-xl font-semibold leading-none transition-colors duration-700', empty ? 'text-fg-faint' : 'text-fg-muted group-[.is-past]:text-fg')}>
                      {day.day}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-faint">{day.month}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint" data-day-reveal>
                    {day.weekday} · Day {String(day.dayNumber).padStart(2, '0')}
                    {isToday && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold">Today</span>}
                  </p>

                  {empty ? (
                    <p className="mt-2 text-sm text-fg-faint" data-day-reveal>
                      No events scheduled
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {day.items.map((item) => (
                        <div
                          key={item.key}
                          data-day-reveal
                          className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/85 p-5 backdrop-blur-md transition-colors hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="absolute inset-y-0 left-0 w-[2px]" style={{ background: colorFor(item) }} />
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-semibold text-fg">
                              {item.name}
                              {item.label && <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-fg-faint">{item.label}</span>}
                            </h3>
                            <p className="mt-1 text-[13px] text-fg-muted">
                              <span className="block whitespace-nowrap sm:inline">{item.time}</span>
                              <span className="mx-2 hidden text-fg-faint sm:inline">·</span>
                              <span className="block sm:inline">{item.venue}</span>
                            </p>
                          </div>
                          {item.event?.registrationEnabled && (
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
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
