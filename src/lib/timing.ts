import { useEffect, useState } from 'react';
import type { EventSession, NexusEvent } from '../data/events';

/**
 * Live status during the fest: what is on now, what is done, what is next.
 * Session times are written like "9:00 AM – 1:00 PM" and are in India time (IST).
 */

export type LiveStatus = 'upcoming' | 'live' | 'done';

const IST = '+05:30';

/** "2:00 PM" → "14:00" */
function to24h(clock: string): string | null {
  const m = clock.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`;
}

/** Start and end of a dated time range like "9:00 AM – 1:00 PM". Falls back to the whole day. */
export function windowOf(date: string, time: string): { start: number; end: number } {
  const [from, to] = time.split(/[–-]/).map((s) => to24h(s));
  const start = new Date(`${date}T${from ?? '00:00'}:00${IST}`).getTime();
  const end = new Date(`${date}T${to ?? '23:59'}:00${IST}`).getTime();
  return { start, end: end > start ? end : start + 60 * 60 * 1000 };
}

export const sessionWindow = (s: EventSession) => windowOf(s.date, s.time);

/** Where a single time range stands right now. */
export function statusOf(date: string, time: string, now: number): LiveStatus {
  const w = windowOf(date, time);
  if (now >= w.end) return 'done';
  if (now >= w.start) return 'live';
  return 'upcoming';
}

/** An event is live during any of its sessions, and done once its last session ends. */
export function eventStatus(event: NexusEvent, now: number): LiveStatus {
  if (!event.sessions.length) return 'upcoming';
  const windows = event.sessions.map(sessionWindow);
  if (windows.some((w) => now >= w.start && now < w.end)) return 'live';
  if (now >= Math.max(...windows.map((w) => w.end))) return 'done';
  return 'upcoming';
}

/** Today's date in India as YYYY-MM-DD. */
export function todayIst(now: number): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(now));
}

/** The current time, refreshed every 30 seconds so live badges change on their own. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
