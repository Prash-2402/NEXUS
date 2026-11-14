import type { CSSProperties } from 'react';
import { ImageIcon } from 'lucide-react';
import { siteConfig } from '../config/site';
import { eventsData, worldOrder, worlds } from '../data/events';
import { festivalDayCount } from '../data/schedule';
import { cn } from '../lib/utils';
import { PHOTOS, PLACEHOLDER_COUNT } from './photos';
import {
  BEAT,
  BLACKOUT_LINE,
  CH,
  CONVERGE_LINES,
  DATES_CARD,
  DROP_END,
  DROP_WORDS,
  IMPACTS,
  INSTITUTION_CARDS,
  MEMORY_CAPTION,
  MONTAGE_WORDS,
  type TimedText,
  worldWindow,
} from './timeline';

/**
 * The picture layer of the launch film: photos, title cards and flashes.
 * A pure function of `t` (seconds after the countdown), so chapter skips are safe.
 */

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Window {
  at: number;
  end: number;
}

/** Enter/exit progress for something that lives in [at, end]; null when it is off screen. */
function progress(t: number, w: Window, delay = 0, dur = 0.8) {
  if (t < w.at + delay || t > w.end + 0.2) return null;
  const enter = easeOut(clamp01((t - w.at - delay) / dur));
  const exit = clamp01((w.end - t) / 0.45);
  return { enter, exit, alpha: Math.min(enter, exit) };
}

/** Fade up into place. Hidden until its delay has passed. */
function rise(t: number, w: Window, delay = 0, dur = 0.8, distance = 26): CSSProperties {
  const p = progress(t, w, delay, dur);
  if (!p) return { opacity: 0 };
  return {
    opacity: p.alpha,
    transform: `translateY(${(1 - p.enter) * distance}px)`,
    filter: `blur(${(1 - p.enter) * 8}px)`,
  };
}

/** Punch in from large, fast, for beat-synced text. */
function slam(t: number, w: Window, delay = 0, from = 1.5): CSSProperties {
  const p = progress(t, w, delay, 0.22);
  if (!p) return { opacity: 0 };
  return {
    opacity: p.alpha,
    transform: `scale(${from - (from - 1) * p.enter})`,
    filter: `blur(${(1 - p.enter) * 10}px)`,
  };
}

const photoCount = PHOTOS.length || PLACEHOLDER_COUNT;
/** Photos used by the memory chapter; the montage starts after them so nothing repeats. */
const MEMORY_FRAMES = 14;

/* ---------- Photos ---------- */

function Photo({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const src = PHOTOS.length ? PHOTOS[index % PHOTOS.length] : null;
  return (
    <div className={cn('overflow-hidden rounded-xl border border-white/15 bg-ink-800 shadow-2xl', className)} style={style}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#151a2e,#0b0e1c_60%,#1a1530)]">
          <ImageIcon className="h-8 w-8 text-fg-faint" strokeWidth={1.25} />
          <span className="font-mono text-[11px] uppercase tracking-label text-fg-faint">
            Photo {String((index % photoCount) + 1).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}

// Fixed scatter so every run looks the same
const SCATTER = [
  [-0.32, -0.14],
  [0.3, 0.12],
  [-0.12, 0.2],
  [0.34, -0.2],
  [-0.36, 0.18],
  [0.08, -0.22],
  [0.24, 0.24],
  [-0.24, -0.04],
  [0.16, 0.02],
  [-0.06, -0.12],
  [0.38, 0.02],
  [-0.38, -0.22],
];

/** Last year's photos drift towards the camera in 3D, desaturated like memories. */
function MemoryField({ t }: { t: number }) {
  if (t > CH.montage + 0.4) return null;
  const life = 6.5;
  const spacing = 0.9;
  const frames = [];
  for (let i = 0; i < MEMORY_FRAMES; i++) {
    const born = i * spacing - 1;
    const age = t - born;
    if (age < 0 || age > life) continue;
    const u = age / life;
    const [x, y] = SCATTER[i % SCATTER.length];
    const z = -1400 + u * 1700;
    const alpha = Math.min(clamp01(u / 0.25), clamp01((1 - u) / 0.2));
    frames.push(
      <Photo
        key={i}
        index={i}
        className="absolute left-1/2 top-1/2 h-[28vh] w-[42vh]"
        style={{
          transform: `translate(-50%, -50%) translate3d(${x * 100}vw, ${y * 100}vh, ${z}px) rotate(${(x - y) * 8}deg)`,
          opacity: alpha * clamp01((CH.montage + 0.4 - t) / 0.6),
          filter: 'grayscale(0.55) sepia(0.15) brightness(0.92)',
        }}
      />,
    );
  }
  return (
    <div className="absolute inset-0 [perspective:1000px] [transform-style:preserve-3d]">
      <div className="absolute inset-0 bg-ink-950/45" />
      {frames}
    </div>
  );
}

/** Full-screen cuts on the beat, speeding up into the blackout. */
function Montage({ t }: { t: number }) {
  if (t < CH.montage || t >= CH.blackout) return null;
  const local = t - CH.montage;
  const span = CH.blackout - CH.montage;
  // one cut per bar, then per beat, then twice a beat
  const step = local < 4 ? BEAT * 4 : local < span - 2 ? BEAT : BEAT / 2;
  const base = local < 4 ? 0 : local < span - 2 ? 4 : span - 2;
  const offset = local < 4 ? 0 : local < span - 2 ? 2 : 2 + (span - 6) / BEAT;
  const cut = Math.floor((local - base) / step);
  const index = offset + cut;
  const sinceCut = (local - base) - cut * step;
  const punch = Math.exp(-sinceCut * 7);
  return (
    <div className="absolute inset-0 bg-ink-950">
      <Photo
        index={MEMORY_FRAMES + index}
        className="absolute inset-0 rounded-none border-0"
        style={{ transform: `scale(${1 + punch * 0.06 + local * 0.004})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,rgba(4,5,11,0.2),rgba(4,5,11,0.85))]" />
      <div className="absolute inset-0 bg-white" style={{ opacity: punch * 0.12 }} />
    </div>
  );
}

/* ---------- Text ---------- */

function Line({ t, line, className }: { t: number; line: TimedText; className?: string }) {
  const words = line.text.split(' ');
  if (!progress(t, line)) return null;
  return (
    <p className={cn('absolute inset-x-0 px-6 text-center font-display font-medium tracking-tight text-fg', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block" style={rise(t, line, i * 0.09, 0.9)}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

const MEMORY_LINES: TimedText[] = [
  { at: 1.2, end: 4.6, text: 'Last year, we built something.' },
  { at: 5.0, end: 11.2, text: 'A stage. A crowd. A feeling.' },
];

function Blackout({ t }: { t: number }) {
  if (t < CH.blackout || t >= CH.drop) return null;
  return (
    <div className="absolute inset-0 bg-black">
      <Line t={t} line={BLACKOUT_LINE} className="top-1/2 -translate-y-1/2 text-2xl text-fg/90 sm:text-4xl" />
    </div>
  );
}

function Drop({ t }: { t: number }) {
  const w = { at: CH.drop, end: DROP_END };
  if (!progress(t, w)) return null;
  const out = clamp01((t - (DROP_END - 0.5)) / 0.5);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `scale(${1 + out * 0.15})`, opacity: 1 - out }}
    >
      <h2 className="flex flex-wrap items-baseline justify-center gap-x-[3vw] px-6 font-display font-bold uppercase leading-none tracking-tight text-fg">
        {DROP_WORDS.map((word, i) => (
          <span
            key={word.text}
            className={cn(
              'inline-block drop-shadow-[0_0_40px_rgba(143,184,255,0.55)]',
              i === 0 ? 'text-[17vw] sm:text-[13vw]' : 'text-[11vw] sm:text-[8vw]',
              i === 2 && 'text-gradient',
            )}
            style={slam(t, { at: word.at, end: DROP_END }, 0, 1.8)}
          >
            {word.text}
          </span>
        ))}
      </h2>
    </div>
  );
}

/* ---------- Cards ---------- */

function Scrim({ t, w, variant }: { t: number; w: Window; variant: 'centre' | 'left' }) {
  const p = progress(t, w, 0, 0.3);
  if (!p) return null;
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0',
        variant === 'centre'
          ? 'bg-[radial-gradient(60%_55%_at_50%_45%,rgba(4,5,11,0.78),rgba(4,5,11,0)_100%)]'
          : 'bg-[linear-gradient(90deg,rgba(4,5,11,0.85)_0%,rgba(4,5,11,0.55)_38%,rgba(4,5,11,0)_62%)]',
      )}
      style={{ opacity: p.alpha }}
    />
  );
}

function LogoCard({
  t,
  w,
  logo,
  logoClass,
  eyebrow,
  name,
}: {
  t: number;
  w: Window;
  logo: string;
  logoClass: string;
  eyebrow: string;
  name: string;
}) {
  const p = progress(t, w, 0, 0.25);
  if (!p) return null;
  return (
    <>
      <Scrim t={t} w={w} variant="centre" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="relative flex h-40 items-center justify-center"
          style={{
            opacity: p.alpha,
            transform: `scale(${1.25 - p.enter * 0.25})`,
            filter: `blur(${(1 - p.enter) * 12}px)`,
          }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-ice/20 blur-3xl" />
          <img src={logo} alt="" className={cn('relative object-contain drop-shadow-[0_0_30px_rgba(143,184,255,0.4)]', logoClass)} />
        </div>
        <p className="mt-8 max-w-3xl font-mono text-[11px] uppercase tracking-label text-ice [text-wrap:balance] sm:text-xs" style={rise(t, w, 0.15, 0.3, 14)}>
          {eyebrow}
        </p>
        <h2
          className="mt-3 max-w-4xl font-display text-3xl font-semibold tracking-tight text-fg [text-wrap:balance] sm:text-4xl lg:text-6xl"
          style={rise(t, w, 0.25, 0.3, 14)}
        >
          {name}
        </h2>
      </div>
    </>
  );
}

function WorldCard({ t, index }: { t: number; index: number }) {
  const w = worldWindow(index);
  if (!progress(t, w)) return null;
  const id = worldOrder[index];
  const world = worlds[id];
  const list = eventsData.filter((e) => e.world === id);
  return (
    <>
      <Scrim t={t} w={w} variant="left" />
      <div className="absolute inset-x-6 bottom-[8svh] md:inset-x-auto md:bottom-auto md:left-[7vw] md:top-1/2 md:w-[min(46vw,580px)] md:-translate-y-1/2">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-label sm:text-xs" style={{ color: world.color, ...rise(t, w, 0, 0.3) }}>
          <span className="h-2 w-2 rounded-full" style={{ background: world.color, boxShadow: `0 0 16px ${world.color}` }} />
          World {world.index} · {world.worldName}
        </p>
        <h2
          className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-fg sm:text-6xl lg:text-8xl"
          style={slam(t, w, 0, 1.25)}
        >
          {world.title}
        </h2>
        <p className="mt-4 font-display text-xl text-fg/90 sm:text-3xl" style={rise(t, w, 0.5, 0.4)}>
          {world.line}
        </p>
        <ol className="mt-6 space-y-1.5 border-l pl-5" style={{ borderColor: `${world.color}66` }}>
          {list.map((e, i) => (
            <li
              key={e.id}
              className="flex items-baseline gap-4 font-display text-base text-fg sm:text-xl lg:text-2xl"
              // one event per beat
              style={rise(t, w, 1.4 + i * BEAT, 0.25, 14)}
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
  const p = progress(t, w, delay, 1.4);
  const shown = p ? Math.round(p.enter * value) : 0;
  return (
    <div className="text-center" style={rise(t, w, delay, 0.5)}>
      <div className="font-display text-5xl font-medium tabular-nums text-fg sm:text-7xl">{String(shown).padStart(2, '0')}</div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-label text-fg-muted">{label}</div>
    </div>
  );
}

function DatesCard({ t }: { t: number }) {
  const w = DATES_CARD;
  if (!progress(t, w)) return null;
  return (
    <>
      <Scrim t={t} w={w} variant="centre" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-[12svh] text-center">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold sm:text-xs" style={rise(t, w, 0, 0.3)}>
          Save the dates
        </p>
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-8xl" style={slam(t, w, 0.1, 1.3)}>
          {siteConfig.dates.display}
        </h2>
        <p className="mt-4 font-display text-lg text-fg-muted sm:text-2xl" style={rise(t, w, 0.5)}>
          {siteConfig.institution}, {siteConfig.campus}
        </p>
        <div className="mt-12 flex items-start gap-10 sm:gap-16">
          <Counter t={t} w={w} delay={1.0} value={festivalDayCount} label="Days" />
          <Counter t={t} w={w} delay={1.5} value={eventsData.length} label="Events" />
          <Counter t={t} w={w} delay={2.0} value={worldOrder.length} label="Worlds" />
        </div>
      </div>
    </>
  );
}

/** White flash: full on the drop, a small kick on every other impact. */
function Flash({ t }: { t: number }) {
  let a = 0;
  for (const at of IMPACTS) {
    const d = t - at;
    if (d < 0 || d > 0.8) continue;
    a = Math.max(a, at === CH.drop ? clamp01(1 - d / 0.7) : Math.exp(-d * 10) * 0.22);
  }
  if (a <= 0.001) return null;
  return <div className="absolute inset-0 bg-white" style={{ opacity: a }} />;
}

/* ---------- The film ---------- */

export function Cinematic({ t }: { t: number }) {
  if (t < 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <MemoryField t={t} />
      {MEMORY_LINES.map((l) => (
        <Line key={l.text} t={t} line={l} className="bottom-[14svh] text-2xl sm:text-4xl" />
      ))}
      {progress(t, MEMORY_CAPTION) && (
        <p className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-label text-fg-muted sm:left-10 sm:top-10" style={rise(t, MEMORY_CAPTION)}>
          {MEMORY_CAPTION.text} · {siteConfig.eventName}
        </p>
      )}

      <Montage t={t} />
      {MONTAGE_WORDS.map((l) => (
        <p
          key={l.text}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display text-6xl font-bold tracking-tight text-fg sm:text-8xl lg:text-9xl"
          style={slam(t, l, 0, 1.4)}
        >
          {l.text}
        </p>
      ))}

      <Blackout t={t} />
      <Drop t={t} />

      <LogoCard t={t} w={INSTITUTION_CARDS.christ} logo={siteConfig.branding.christLogo} logoClass="h-20 sm:h-28" eyebrow="Hosted at" name={siteConfig.institution} />
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
        <Line key={l.text} t={t} line={l} className="top-1/2 -translate-y-1/2 text-5xl sm:text-7xl lg:text-8xl" />
      ))}

      <DatesCard t={t} />
      <Flash t={t} />
    </div>
  );
}
