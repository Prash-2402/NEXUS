/**
 * NEXUS — schedule.
 * Built automatically from event sessions and ceremonies, one entry per festival day.
 */

import { ceremonies, eventsData, NexusEvent, WorldId } from './events';
import { siteConfig } from '../config/site';

export interface ScheduleItem {
  key: string;
  name: string;
  world: WorldId | 'ceremony';
  time: string;
  venue: string;
  label?: string;
  event?: NexusEvent;
}

export interface ScheduleDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  weekday: string;
  day: string;
  month: string;
  items: ScheduleItem[];
}

const toIso = (d: Date) => d.toISOString().slice(0, 10);

function buildSchedule(): ScheduleDay[] {
  const start = new Date(`${siteConfig.dates.startDate.slice(0, 10)}T00:00:00Z`);
  const end = new Date(`${siteConfig.dates.endDate.slice(0, 10)}T00:00:00Z`);
  const days: ScheduleDay[] = [];

  for (let d = new Date(start), n = 1; d <= end; d.setUTCDate(d.getUTCDate() + 1), n++) {
    const date = toIso(d);
    const items: ScheduleItem[] = [];

    eventsData.forEach((event) => {
      event.sessions
        .filter((s) => s.date === date)
        .forEach((s) =>
          items.push({
            key: `${event.id}-${date}`,
            name: event.name,
            world: event.world,
            time: s.time,
            venue: s.venue ?? event.venue,
            label: s.label,
            event,
          }),
        );
    });

    ceremonies
      .filter((c) => c.date === date)
      .forEach((c) =>
        items.push({ key: c.id, name: c.name, world: 'ceremony', time: c.time, venue: c.venue }),
      );

    days.push({
      date,
      dayNumber: n,
      weekday: d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' }),
      day: String(d.getUTCDate()).padStart(2, '0'),
      month: d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' }),
      items,
    });
  }

  return days;
}

export const scheduleDays = buildSchedule();
export const festivalDayCount = scheduleDays.length;
