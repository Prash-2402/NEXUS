import { ArrowRight } from 'lucide-react';
import { worlds } from '../data/events';
import { scheduleDays, type ScheduleItem } from '../data/schedule';
import { scrollToId } from '../lib/motion';
import { statusOf, todayIst, useNow } from '../lib/timing';
import { cn } from '../lib/utils';

/**
 * Shown in the hero while the fest is on, in place of the countdown:
 * today's events with what is live, what is next and what is done.
 * On a day with no events, it points to the next day that has some.
 */

const colorFor = (item: ScheduleItem) => (item.world === 'ceremony' ? '#eef1f8' : worlds[item.world].color);
const shortDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
const longDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

export function LiveToday() {
  const now = useNow();
  const today = todayIst(now);
  const days = scheduleDays.filter((d) => d.items.length > 0);
  const todays = days.find((d) => d.date === today);
  const statuses = todays?.items.map((item) => statusOf(todays.date, item.time, now)) ?? [];
  const allDone = statuses.length > 0 && statuses.every((s) => s === 'done');
  const next = days.find((d) => d.date > today);
  const firstUpcoming = statuses.indexOf('upcoming');

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900/70 p-5 text-left backdrop-blur-md sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-label text-gold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          NEXUS is live
        </p>
        <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-label text-fg-faint">
          <span className="sm:hidden">{shortDay(today)}</span>
          <span className="hidden sm:inline">{todays ? `Today · ${longDay(today)}` : longDay(today)}</span>
        </p>
      </div>

      {todays ? (
        <ul className="mt-4 space-y-2">
          {todays.items.map((item, i) => {
            const status = statuses[i];
            return (
              <li
                key={item.key}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3.5 py-3',
                  status === 'live' ? 'border-gold/40 bg-gold/[0.06]' : 'border-white/[0.06] bg-white/[0.02]',
                  status === 'done' && 'opacity-50',
                )}
              >
                <span className="h-8 w-[3px] shrink-0 rounded-full" style={{ background: colorFor(item) }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-semibold text-fg">{item.name}</p>
                  <p className="truncate text-xs text-fg-muted">
                    {item.time} · {item.venue}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]',
                    status === 'live' && 'bg-gold/15 text-gold',
                    status === 'upcoming' && 'bg-white/[0.06] text-fg-muted',
                    status === 'done' && 'text-fg-faint',
                  )}
                >
                  {status === 'live' ? 'Live now' : status === 'done' ? 'Done' : i === firstUpcoming ? 'Up next' : 'Later'}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-fg-muted">No events today.</p>
      )}

      {(allDone || !todays) && next && (
        <p className="mt-4 text-sm text-fg-muted">
          <span className="text-fg">Next up:</span> {next.items.map((i) => i.name).join(', ')} on {longDay(next.date)}.
        </p>
      )}

      <button
        onClick={() => scrollToId('schedule')}
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg"
      >
        Full schedule
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
