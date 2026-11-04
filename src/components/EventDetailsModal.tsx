import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { worlds, type NexusEvent } from '../data/events';

interface EventDetailsModalProps {
  event: NexusEvent | null;
  onClose: () => void;
  onRegister: (event: NexusEvent) => void;
}

const longDate = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

export function EventDetailsModal({ event, onClose, onRegister }: EventDetailsModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState<NexusEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // Keep the last event mounted during the exit transition.
  useEffect(() => {
    if (event) {
      setShown(event);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setShown(null), 350);
      return () => clearTimeout(t);
    }
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [event, onClose]);

  if (!shown) return null;
  const world = worlds[shown.world];

  const facts: Array<[string, React.ReactNode]> = [
    [
      shown.sessions.length > 1 ? 'Dates' : 'Date',
      shown.sessions.length === 0
        ? 'To be announced'
        : shown.sessions.map((s) => (
            <span key={s.date} className="block">
              {longDate.format(new Date(`${s.date}T00:00:00Z`))}
              {s.label && <span className="text-fg-faint"> · {s.label}</span>}
            </span>
          )),
    ],
    ['Time', shown.sessions[0]?.time ?? 'To be announced'],
    ['Venue', shown.venue],
    ['Format', shown.format],
    ['Eligibility', shown.eligibility],
    ...(shown.poc ? ([['Coordinators', shown.poc]] as Array<[string, React.ReactNode]>) : []),
  ];

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/70 backdrop-blur-md transition-opacity duration-300 sm:items-center sm:p-6 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className={`relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-900 shadow-2xl transition-all duration-500 ease-out sm:rounded-3xl ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${world.color}, transparent)` }} />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${world.color}26` }}
        />

        <div className="relative p-6 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label" style={{ color: world.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: world.color }} />
              {world.title} · {world.worldName}
            </p>
            <button
              ref={closeRef}
              onClick={onClose}
              className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-fg-muted transition-colors hover:border-white/30 hover:text-fg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 id="event-modal-title" className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {shown.name}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-fg">{shown.summary}</p>
          <p className="mt-3 leading-relaxed text-fg-muted">{shown.description}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-white/[0.07] pt-8 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-label text-fg-faint">{k}</dt>
                <dd className="mt-1.5 text-[15px] text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          {shown.note && (
            <p className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm leading-relaxed text-fg-muted">
              {shown.note}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => onRegister(shown)} className="btn-primary flex-1">
              Register for {shown.name}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="btn-ghost sm:w-auto">
              Close
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-fg-faint sm:text-left">Registration opens in a new tab.</p>
        </div>
      </div>
    </div>
  );
}
