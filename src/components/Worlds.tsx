import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { eventsData, worldOrder, worlds, type WorldId } from '../data/events';
import { focusWorld, gsap, ScrollTrigger, scrollToId, selectWorldFilter, useGsap } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * The three worlds. On large screens the section pins for three screens while
 * the camera flies past one planet per world; on phones the panels stack.
 */
export function Worlds() {
  const ref = useRef<HTMLElement>(null);

  const explore = (id: WorldId) => {
    selectWorldFilter(id);
    scrollToId('events');
  };

  useGsap(ref, () => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-world-panel]');
    const dots = gsap.utils.toArray<HTMLElement>('[data-world-dot]');
    const mm = gsap.matchMedia();

    const setActive = (i: number) => {
      dots.forEach((d, di) => d.classList.toggle('is-active', di === i));
      focusWorld(worldOrder[i]);
    };

    mm.add('(min-width: 1024px)', () => {
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 60 });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 1 },
        scrollTrigger: {
          trigger: '[data-world-stage]',
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
          onLeave: () => focusWorld(null),
          onLeaveBack: () => focusWorld(null),
          onEnter: () => setActive(0),
          onEnterBack: () => setActive(2),
        },
      });
      // Hold each panel, then hand over to the next.
      tl.to({}, { duration: 0.6 })
        .to(panels[0], { autoAlpha: 0, y: -60 })
        .to(panels[1], { autoAlpha: 1, y: 0 }, '<0.3')
        .to({}, { duration: 0.8 })
        .to(panels[1], { autoAlpha: 0, y: -60 })
        .to(panels[2], { autoAlpha: 1, y: 0 }, '<0.3')
        .to({}, { duration: 0.6 });
      gsap.fromTo('[data-world-progress]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-world-stage]', start: 'top top', end: () => `+=${window.innerHeight * 3}`, scrub: true },
      });
    });

    mm.add('(max-width: 1023px)', () => {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && setActive(i),
        });
        gsap.from(panel.querySelectorAll('[data-world-item]'), {
          autoAlpha: 0,
          y: 40,
          stagger: 0.08,
          duration: 1.1,
          scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
        });
      });
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => focusWorld(null),
        onLeaveBack: () => focusWorld(null),
      });
    });
  });

  return (
    <section ref={ref} id="worlds" className="relative z-10">
      {/* Anchor for the 3D camera; kept outside the pinned element so it measures correctly. */}
      <div data-stage="2" aria-hidden="true" />
      <div data-world-stage className="relative lg:h-screen">
        <div className="container-site relative flex h-full flex-col pt-24 lg:pt-28">
          <p className="eyebrow">
            <span className="text-ice">02</span>
            <span>The Worlds</span>
          </p>

          <div className="relative mt-6 flex-1 lg:mt-0">
            {worldOrder.map((id) => {
              const w = worlds[id];
              const list = eventsData.filter((e) => e.world === id);
              return (
                <article
                  key={id}
                  data-world-panel
                  className="flex min-h-[88svh] flex-col justify-end pb-16 lg:absolute lg:inset-0 lg:min-h-0 lg:justify-center lg:pb-0"
                  aria-labelledby={`world-${id}`}
                >
                  <div className="max-w-xl">
                    <div data-world-item className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-label" style={{ color: w.color }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: w.color, boxShadow: `0 0 16px ${w.color}` }} />
                      {w.index} · {w.worldName}
                    </div>
                    <h3
                      id={`world-${id}`}
                      data-world-item
                      className="mt-5 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-fg sm:text-7xl xl:text-8xl"
                    >
                      {w.title}
                    </h3>
                    <p data-world-item className="mt-5 font-display text-2xl text-fg/90">
                      {w.line}
                    </p>
                    <p data-world-item className="lead mt-3">
                      {w.description}
                    </p>
                    <ul data-world-item className="mt-7 flex flex-wrap gap-2">
                      {list.map((e) => (
                        <li key={e.id} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-fg-muted">
                          {e.name}
                        </li>
                      ))}
                    </ul>
                    <button
                      data-world-item
                      onClick={() => explore(id)}
                      className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg"
                    >
                      <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-white">
                        Explore {w.title.toLowerCase()} events
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Progress rail (desktop) */}
          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-5 lg:flex">
            <div className="relative h-40 w-px bg-white/10">
              <div data-world-progress className="absolute inset-0 origin-top bg-gradient-to-b from-tech via-strat to-gold" />
            </div>
            <ol className="flex flex-col gap-10 font-mono text-[11px] text-fg-faint">
              {worldOrder.map((id, i) => (
                <li
                  key={id}
                  data-world-dot
                  className={cn('transition-colors duration-500 [&.is-active]:text-fg', i === 0 && 'is-active')}
                >
                  {worlds[id].index}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
