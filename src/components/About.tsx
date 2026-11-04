import { useRef } from 'react';
import { siteConfig } from '../config/site';
import { eventsData } from '../data/events';
import { festivalDayCount } from '../data/schedule';
import { gsap, useGsap } from '../lib/motion';
import { SplitText } from './ui/SplitText';

const stats = [
  { value: festivalDayCount, label: 'Days' },
  { value: eventsData.length, label: 'Events' },
  { value: 3, label: 'Worlds' },
];

export function About() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v)).padStart(2, '0');
        },
      });
    });
    gsap.fromTo(
      '[data-about="rule"]',
      { scaleX: 0 },
      { scaleX: 1, duration: 1.6, scrollTrigger: { trigger: '[data-about="rule"]', start: 'top 90%', once: true } },
    );
  });

  return (
    <section ref={ref} id="about" data-stage="1" className="section">
      <div className="container-site">
        <p className="eyebrow" data-reveal>
          <span className="text-ice">01</span>
          <span>About NEXUS</span>
        </p>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SplitText
            as="h2"
            className="heading-xl lg:col-span-7"
            segments={[{ text: 'More than an event.' }, { text: 'A convergence.', className: 'text-gradient', br: true }]}
          />

          <div className="space-y-6 lg:col-span-5 lg:pt-4">
            <p className="text-lg leading-relaxed text-fg sm:text-xl" data-reveal>
              NEXUS is the flagship AI Utsav of {siteConfig.organizingClub}, where technology, strategy and culture share
              one stage.
            </p>
            <p className="lead" data-reveal>
              Over {festivalDayCount} days, students from every discipline build, compete, perform and meet people they
              would never have met otherwise. Three worlds, each with its own pull, all orbiting the same idea:{' '}
              <span className="text-fg">{siteConfig.conceptIdea.toLowerCase()}</span>
            </p>
          </div>
        </div>

        <div data-about="rule" className="hairline mt-16 h-px origin-left sm:mt-24" />

        <dl className="grid grid-cols-3 gap-4 pt-10">
          {stats.map((s) => (
            <div key={s.label} data-reveal>
              <dd
                data-count={s.value}
                className="font-display text-5xl font-medium tabular-nums tracking-tight text-fg sm:text-7xl lg:text-8xl"
              >
                {String(s.value).padStart(2, '0')}
              </dd>
              <dt className="mt-2 font-mono text-[11px] uppercase tracking-label text-fg-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
