import type { PointerEvent } from 'react';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { formatEventDates, formatEventTime, worlds, type NexusEvent } from '../data/events';

interface EventCardProps {
  event: NexusEvent;
  index: number;
  onOpenDetails: (event: NexusEvent) => void;
  onRegister: (event: NexusEvent) => void;
}

export function EventCard({ event, index, onOpenDetails, onRegister }: EventCardProps) {
  const world = worlds[event.world];

  // Soft spotlight that follows the cursor.
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <article
      data-event-card
      onPointerMove={onMove}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/80 p-6 backdrop-blur-md transition-[border-color,transform] duration-500 ease-out hover:-translate-y-1 hover:border-white/20 sm:p-7"
      style={{ ['--accent' as string]: world.color }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), ${world.color}1f, transparent 60%)`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${world.color}, transparent)` }} />

      <div className="relative flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className="flex items-center gap-2" style={{ color: world.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: world.color }} />
          {world.title}
        </span>
        <span className="text-fg-faint">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 className="relative mt-6 font-display text-2xl font-semibold tracking-tight text-fg">{event.name}</h3>
      <p className="relative mt-3 text-[15px] leading-relaxed text-fg-muted">{event.summary}</p>

      <dl className="relative mt-6 space-y-2 border-t border-white/[0.06] pt-5 text-[13px] text-fg-muted">
        <div className="flex items-center justify-between gap-4">
          <dt className="sr-only">Date</dt>
          <dd className="whitespace-nowrap font-display text-base font-medium text-fg">
            {event.sessions.length ? formatEventDates(event) : 'Date to be announced'}
          </dd>
          {event.sessions.length > 0 && (
            <>
              <dt className="sr-only">Time</dt>
              <dd className="flex items-center gap-1.5 text-right">
                <Clock className="h-3.5 w-3.5 shrink-0 text-fg-faint" />
                {formatEventTime(event)}
              </dd>
            </>
          )}
        </div>
        <div className="flex items-start gap-1.5">
          <dt className="sr-only">Venue</dt>
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-faint" />
          <dd>{event.venue}</dd>
        </div>
      </dl>

      <div className="relative mt-auto flex items-center gap-3 pt-7">
        <button
          onClick={() => onOpenDetails(event)}
          className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-[13px] text-fg transition-colors hover:border-white/35 hover:bg-white/[0.04]"
          aria-label={`View details for ${event.name}`}
        >
          Details
        </button>
        <button
          onClick={() => onRegister(event)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-fg px-4 py-2.5 text-[13px] font-medium text-ink-950 transition-all hover:bg-white hover:shadow-[0_0_30px_-6px_var(--accent)]"
          aria-label={`Register for ${event.name}`}
        >
          Register
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
