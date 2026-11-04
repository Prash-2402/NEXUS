import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { eventsData, worldOrder, worlds, type EventFilter, type NexusEvent } from '../data/events';
import { focusWorld, gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion';
import { cn } from '../lib/utils';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { SectionHeader } from './ui/SectionHeader';

interface EventUniverseProps {
  onRegisterEvent: (event: NexusEvent) => void;
}

const filters: Array<{ id: EventFilter; label: string; color?: string }> = [
  { id: 'all', label: 'All' },
  ...worldOrder.map((id) => ({ id, label: worlds[id].title, color: worlds[id].color })),
];

export function EventUniverse({ onRegisterEvent }: EventUniverseProps) {
  const [filter, setFilter] = useState<EventFilter>('all');
  const [selected, setSelected] = useState<NexusEvent | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const firstRender = useRef(true);

  const visible = filter === 'all' ? eventsData : eventsData.filter((e) => e.world === filter);
  const count = (id: EventFilter) => (id === 'all' ? eventsData.length : eventsData.filter((e) => e.world === id).length);

  const choose = useCallback((id: EventFilter) => {
    setFilter(id);
    focusWorld(id === 'all' ? null : id);
  }, []);

  // "Explore X events" in the Worlds section switches the filter here.
  useEffect(() => {
    const onFilter = (e: Event) => choose((e as CustomEvent<EventFilter>).detail);
    window.addEventListener('nexus:filter', onFilter);
    return () => window.removeEventListener('nexus:filter', onFilter);
  }, [choose]);

  // Sliding tab indicator
  useLayoutEffect(() => {
    const update = () => {
      const el = tabsRef.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [filter]);

  // Cards rise in on first view, and re-flow when the filter changes.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-event-card]');
      if (firstRender.current) {
        firstRender.current = false;
        gsap.set(cards, { autoAlpha: 0, y: 50 });
        ScrollTrigger.batch(cards, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true }),
        });
      } else {
        gsap.fromTo(cards, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, overwrite: true });
        ScrollTrigger.refresh();
      }
    }, gridRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section id="events" data-stage="3" className="section">
      <div className="container-site">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="03"
            label="Events"
            title={[{ text: 'Choose your' }, { text: 'arena.', className: 'text-gradient' }]}
            lead={`${eventsData.length} events across three worlds. Every event has its own registration form, so pick as many as your schedule allows.`}
          />

          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Filter events by world"
            className="no-scrollbar relative -mx-5 flex shrink-0 gap-1 overflow-x-auto px-5 sm:mx-0 sm:rounded-full sm:border sm:border-white/10 sm:bg-ink-900/60 sm:p-1 sm:backdrop-blur-md"
            data-reveal
          >
            <span
              className="absolute bottom-1 top-1 hidden rounded-full bg-white/[0.09] transition-all duration-500 ease-out sm:block"
              style={{ left: indicator.left, width: indicator.width }}
            />
            {filters.map((f) => (
              <button
                key={f.id}
                role="tab"
                data-filter={f.id}
                aria-selected={filter === f.id}
                onClick={() => choose(f.id)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 sm:border-transparent',
                  filter === f.id ? 'border-white/25 text-fg' : 'border-white/10 text-fg-muted hover:text-fg',
                )}
              >
                {f.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: f.color }} />}
                {f.label}
                <span className="font-mono text-[10px] text-fg-faint">{count(f.id)}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
          {visible.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              onOpenDetails={setSelected}
              onRegister={onRegisterEvent}
            />
          ))}
        </div>
      </div>

      <EventDetailsModal
        event={selected}
        onClose={() => setSelected(null)}
        onRegister={(ev) => {
          setSelected(null);
          onRegisterEvent(ev);
        }}
      />
    </section>
  );
}
