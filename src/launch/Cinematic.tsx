import type { CSSProperties, ReactNode } from 'react';
import { siteConfig } from '../config/site';
import { eventsData, worldOrder, worlds } from '../data/events';
import { festivalDayCount } from '../data/schedule';
import { cn } from '../lib/utils';
import { CONVERGE_LINES, DATES_CARD, INSTITUTION_CARDS, WARP_LINES, worldWindow } from './timeline';

/**
 * The title cards of the launch film. Pure function of `t` (seconds after ignition):
 * each card computes its own enter/exit from the timeline, so scrubbing is safe.
 */

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Window {
  at: number;
  end: number;
}

/** Enter/exit progress for something that lives in [at, end]; null when it is not on screen. */
function window_(t: number, w: Window, delay = 0, dur = 0.8) {
  if (t < w.at + delay || t > w.end + 0.2) return null;
  const enter = easeOut(clamp01((t - w.at - delay) / dur));
  const exit = clamp01((w.end - t) / 0.55);
  return { enter, exit, alpha: Math.min(enter, exit) };
}

function rise(t: number, w: Window, delay = 0, dur = 0.8, distance = 26): CSSProperties | null {
  const p = window_(t, w, delay, dur);
  if (!p) return null;
  return {
    opacity: p.alpha,
    transform: `translateY(${(1 - p.enter) * distance}px)`,
    filter: `blur(${(1 - p.enter) * 8}px)`,
  };
}

function Scrim({ t, w, variant }: { t: number; w: Window; variant: 'centre' | 'left' }) {
  const p = window_(t, w, 0, 1);
  if (!p) return null;
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0',
        variant === 'centre'
          ? 'bg-[radial-gradient(60%_55%_at_50%_45%,rgba(4,5,11,0.78),rgba(4,5,11,0)_100%)]'
          : 'bg-[linear-gradient(90deg,rgba(4,5,11,0.85)_0%,rgba(4,5,11,0.55)_38%,rgba(4,5,11,0)_62%)] md:block',
      )}
      style={{ opacity: p.alpha }}
    />
  );
}

/* ---------- Cards ---------- */

function Beat({ t, w, children, size = 'lg' }: { t: number; w: Window; children: ReactNode; size?: 'lg' | 'xl' }) {
  const words = String(children).split(' ');
  if (!window_(t, w)) return null;
  return (
    <p
      className={cn(
        'absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display font-medium tracking-tight text-fg',
        size === 'xl' ? 'text-5xl sm:text-7xl lg:text-8xl' : 'text-3xl sm:text-5xl lg:text-6xl',
      )}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block" style={rise(t, w, i * 0.09, 0.9) ?? { opacity: 0 }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

function LogoCard({
  t,
  w,
  logo,
  logoClass,
  eyebrow,
  name,
  sub,
}: {
  t: number;
  w: Window;
  logo: string;
  logoClass: string;
  eyebrow: string;
  name: string;
  sub?: string;
}) {
  const p = window_(t, w);
  if (!p) return null;
  return (
    <>
      <Scrim t={t} w={w} variant="centre" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="relative flex h-40 items-center justify-center"
          style={{
            opacity: p.alpha,
            transform: `scale(${0.86 + p.enter * 0.14})`,
            filter: `blur(${(1 - p.enter) * 14}px)`,
          }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-ice/15 blur-3xl" />
          <img src={logo} alt="" className={cn('relative object-contain drop-shadow-[0_0_30px_rgba(143,184,255,0.35)]', logoClass)} />
        </div>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-label text-ice sm:text-xs" style={rise(t, w, 0.35) ?? undefined}>
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-4xl font-display text-3xl font-semibold tracking-tight text-fg [text-wrap:balance] sm:text-4xl lg:text-6xl" style={rise(t, w, 0.5) ?? undefined}>
          {name}
        </h2>
        {sub && (
          <p className="mt-4 font-display text-lg text-fg-muted sm:text-2xl" style={rise(t, w, 0.7) ?? undefined}>
            {sub}
          </p>
        )}
      </div>
    </>
  );
}

function WorldCard({ t, index }: { t: number; index: number }) {
  const w = worldWindow(index);
  const p = window_(t, w);
  if (!p) return null;
  const id = worldOrder[index];
  const world = worlds[id];
  const list = eventsData.filter((e) => e.world === id);
  return (
    <>
      <Scrim t={t} w={w} variant="left" />
      <div className="absolute inset-x-6 bottom-[8svh] md:inset-x-auto md:bottom-auto md:left-[7vw] md:top-1/2 md:w-[min(46vw,580px)] md:-translate-y-1/2">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-label sm:text-xs" style={{ color: world.color, ...(rise(t, w, 0) ?? {}) }}>
          <span className="h-2 w-2 rounded-full" style={{ background: world.color, boxShadow: `0 0 16px ${world.color}` }} />
          World {world.index} · {world.worldName}
        </p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-fg sm:text-6xl lg:text-8xl" style={rise(t, w, 0.15, 0.9, 40) ?? undefined}>
          {world.title}
        </h2>
        <p className="mt-4 font-display text-xl text-fg/90 sm:text-3xl" style={rise(t, w, 0.4) ?? undefined}>
          {world.line}
        </p>
        <ol className="mt-6 space-y-1.5 border-l pl-5" style={{ borderColor: `${world.color}66` }}>
          {list.map((e, i) => (
            <li
              key={e.id}
              className="flex items-baseline gap-4 font-display text-base text-fg sm:text-xl lg:text-2xl"
              style={rise(t, w, 0.9 + i * 0.22, 0.7, 18) ?? { opacity: 0 }}
            >
              <span className="font-mono text-[11px] text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
              {e.name}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function Counter({ t, w, delay, value, label }: { t: number; w: Window; delay: number; value: number; label: string }) {
  const p = window_(t, w, delay, 1.6);
  const shown = p ? Math.round(p.enter * value) : 0;
  return (
    <div className="text-center" style={rise(t, w, delay, 0.8) ?? { opacity: 0 }}>
      <div className="font-display text-5xl font-medium tabular-nums text-fg sm:text-7xl">{String(shown).padStart(2, '0')}</div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-label text-fg-muted">{label}</div>
    </div>
  );
}

function DatesCard({ t }: { t: number }) {
  const w = DATES_CARD;
  if (!window_(t, w)) return null;
  return (
    <>
      <Scrim t={t} w={w} variant="centre" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-[12svh] text-center">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold sm:text-xs" style={rise(t, w, 0) ?? undefined}>
          Save the dates
        </p>
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-8xl" style={rise(t, w, 0.2, 0.9, 36) ?? undefined}>
          {siteConfig.dates.display}
        </h2>
        <p className="mt-4 font-display text-lg text-fg-muted sm:text-2xl" style={rise(t, w, 0.5) ?? undefined}>
          {siteConfig.institution}, {siteConfig.campus}
        </p>
        <div className="mt-12 flex items-start gap-10 sm:gap-16">
          <Counter t={t} w={w} delay={1.0} value={festivalDayCount} label="Days" />
          <Counter t={t} w={w} delay={1.2} value={eventsData.length} label="Events" />
          <Counter t={t} w={w} delay={1.4} value={worldOrder.length} label="Worlds" />
        </div>
      </div>
    </>
  );
}

/* ---------- The film ---------- */

export function Cinematic({ t }: { t: number }) {
  if (t < 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {WARP_LINES.map((l) => (
        <Beat key={l.text} t={t} w={l}>
          {l.text}
        </Beat>
      ))}

      <LogoCard
        t={t}
        w={INSTITUTION_CARDS.christ}
        logo={siteConfig.branding.christLogo}
        logoClass="h-20 sm:h-28"
        eyebrow="Hosted at"
        name={siteConfig.institution}
        sub={siteConfig.campus}
      />
      <LogoCard
        t={t}
        w={INSTITUTION_CARDS.department}
        logo={siteConfig.branding.deptLogo}
        logoClass="h-32 w-32 sm:h-40 sm:w-40"
        eyebrow="Organised by"
        name={siteConfig.departmentName}
      />
      <LogoCard
        t={t}
        w={INSTITUTION_CARDS.caads}
        logo={siteConfig.branding.caadsLogo}
        logoClass="h-16 sm:h-24"
        eyebrow={siteConfig.organizingClubFullName}
        name={`${siteConfig.organizingClub} presents`}
      />

      {worldOrder.map((_, i) => (
        <WorldCard key={i} t={t} index={i} />
      ))}

      {CONVERGE_LINES.map((l) => (
        <Beat key={l.text} t={t} w={l} size="xl">
          {l.text}
        </Beat>
      ))}

      <DatesCard t={t} />
    </div>
  );
}
