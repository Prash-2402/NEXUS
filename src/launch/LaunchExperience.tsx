import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { siteConfig } from '../config/site';
import { getEngine, onEngine } from '../scene/engineRef';
import type { SpaceEngine } from '../scene/SpaceEngine';
import { cn } from '../lib/utils';
import { Cinematic } from './Cinematic';
import { LaunchAudio } from './LaunchAudio';
import { LogoParticles } from './LogoParticles';
import { CH, COUNTDOWN } from './timeline';
import { BEAT_EVENTS } from './beat';
import { PHOTOS } from './photos';

/**
 * The stage launch film. Opens on a locked screen; one press (or Space / Enter)
 * starts the countdown, then the camera flies through the chapters in `timeline.ts`
 * while the title cards play, ending with the logo reveal and a handoff into the live site.
 *
 * Esc skips to the site. Right arrow jumps to the next chapter (for rehearsals).
 */

const TYPE_SPEED = 0.055;
const CHAPTERS = [
  CH.montage,
  CH.blackout,
  CH.drop,
  CH.institution,
  CH.worlds,
  CH.worlds + CH.worldDur,
  CH.worlds + CH.worldDur * 2,
  CH.converge,
  CH.dates,
  CH.logo,
  CH.handoff,
];

interface LaunchExperienceProps {
  /** Mount the real site underneath (called once at the handoff). */
  onReveal: () => void;
  /** Overlay has fully faded; unmount it. */
  onFinished: () => void;
}

type Phase = 'idle' | 'countdown' | 'running';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function LaunchExperience({ onReveal, onFinished }: LaunchExperienceProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(COUNTDOWN);
  const [t, setT] = useState(-COUNTDOWN);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [logoBox, setLogoBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const engineRef = useRef<SpaceEngine | null>(getEngine());
  const audioRef = useRef(new LaunchAudio());
  /** Next beat event to schedule. */
  const beatIndex = useRef(0);
  const particlesRef = useRef<LogoParticles | null>(null);
  const phaseRef = useRef<Phase>('idle');
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const fired = useRef(new Set<string>());
  const typedRef = useRef(0);
  const countRef = useRef(COUNTDOWN);
  const rafRef = useRef(0);
  const revealed = useRef(false);
  const finished = useRef(false);

  const tagline = siteConfig.tagline;

  useEffect(() => onEngine((engine) => (engineRef.current = engine)), []);

  // While the locked screen is up: set up the sound engine and load and decode every photo,
  // so neither the launch press nor the fast montage cuts ever stall.
  useEffect(() => {
    const audioTimer = window.setTimeout(() => audioRef.current.prepare(), 600);
    const { christLogo, deptLogo, caadsLogo } = siteConfig.branding;
    const kept = [...PHOTOS, christLogo, deptLogo, caadsLogo].map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.decode().catch(() => undefined);
      return img;
    });
    return () => {
      window.clearTimeout(audioTimer);
      kept.length = 0;
    };
  }, []);

  // Lock the page while the show runs.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const particles = new LogoParticles(canvas, isMobile);
    particlesRef.current = particles;
    particles.load(siteConfig.branding.nexusLogo).then(() => setLogoBox({ ...particles.logoBox }));
    const onResize = () => particles.resize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const once = (key: string, fn: () => void) => {
    if (fired.current.has(key)) return;
    fired.current.add(key);
    fn();
  };

  const handoff = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    engineRef.current?.setLaunch(null);
    audioRef.current.finish();
    document.body.style.overflow = '';
    if (window.location.pathname !== '/') window.history.replaceState(null, '', '/');
    onReveal();
  }, [onReveal]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    cancelAnimationFrame(rafRef.current);
    audioRef.current.dispose();
    onFinished();
  }, [onFinished]);

  // The timeline. `t` is seconds since ignition; negative during the countdown.
  const frame = useCallback(
    (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const dt = Math.min((now - lastRef.current) / 1000, 0.1);
      lastRef.current = now;
      const t = (now - startRef.current) / 1000 - COUNTDOWN;
      const engine = engineRef.current;
      const audio = audioRef.current;
      const particles = particlesRef.current;

      if (!revealed.current) engine?.setLaunch(t);
      setT(t);

      if (t < 0) {
        const n = Math.ceil(-t);
        if (n !== countRef.current) {
          countRef.current = n;
          setCount(n);
          audio.tick(n);
        }
        particles?.draw(t, dt, 0);
        return;
      }

      once('start', () => {
        phaseRef.current = 'running';
        setPhase('running');
      });

      // The beat: schedule a little ahead on the audio clock so every hit lands exactly.
      const LOOKAHEAD = 0.2;
      while (beatIndex.current < BEAT_EVENTS.length && BEAT_EVENTS[beatIndex.current].at < t + LOOKAHEAD) {
        const ev = BEAT_EVENTS[beatIndex.current++];
        if (ev.at >= t - 0.05) audio.schedule(ev, audio.now + (ev.at - t));
      }
      if (t >= CH.logo) once('particles', () => particles?.assemble(t));
      if (t >= CH.hit) {
        once('hit', () => {
          particles?.burst(t);
        });
      }
      if (t >= CH.handoff) once('handoff', handoff);
      if (t >= CH.finished) once('finished', finish);

      // Flash and backdrop
      if (backdropRef.current) backdropRef.current.style.opacity = String(0.55 * clamp01(1 - t / 1.2));

      // Logo: particles first, then the crisp image takes over
      const logoIn = clamp01((t - CH.hit) / 0.7);
      particles?.draw(t, dt, 1 - logoIn);
      if (logoRef.current) {
        logoRef.current.style.opacity = String(logoIn);
        logoRef.current.style.transform = `scale(${1 + (1 - logoIn) * 0.06})`;
      }

      // Tagline types out
      if (taglineRef.current && t >= CH.tagline) {
        const chars = Math.min(tagline.length, Math.floor((t - CH.tagline) / TYPE_SPEED));
        if (chars !== typedRef.current) {

          typedRef.current = chars;
          taglineRef.current.textContent = tagline.slice(0, chars);
        }
        if (cursorRef.current) cursorRef.current.style.visibility = chars >= tagline.length ? 'hidden' : 'visible';
      }
      if (lineRef.current) lineRef.current.style.opacity = String(clamp01((t - CH.line) / 0.9));

      // Everything fades out after the handoff
      if (rootRef.current && t >= CH.handoff) {
        rootRef.current.style.opacity = String(clamp01(1 - (t - CH.handoff) / 2));
      }
    },
    [finish, handoff, tagline],
  );

  const launch = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    phaseRef.current = 'countdown';
    setPhase('countdown');
    const audio = audioRef.current;
    audio.init();
    audio.setMuted(muted);
    startRef.current = performance.now();
    lastRef.current = startRef.current;
    audio.tick(COUNTDOWN);
    rafRef.current = requestAnimationFrame(frame);
  }, [frame, muted]);

  /** Move the clock so that `t` becomes `seconds`. */
  const jumpTo = useCallback((seconds: number) => {
    startRef.current = performance.now() - (seconds + COUNTDOWN) * 1000;
    const next = BEAT_EVENTS.findIndex((e) => e.at >= seconds);
    beatIndex.current = next === -1 ? BEAT_EVENTS.length : next;
  }, []);

  const skip = useCallback(() => {
    if (phaseRef.current === 'idle') {
      handoff();
      finish();
      return;
    }
    jumpTo(CH.handoff);
  }, [finish, handoff, jumpTo]);

  const nextChapter = useCallback(() => {
    if (phaseRef.current === 'idle') return;
    const now = (performance.now() - startRef.current) / 1000 - COUNTDOWN;
    const next = CHAPTERS.find((c) => c > now + 0.05);
    if (next !== undefined) {
      jumpTo(next);
    }
  }, [jumpTo]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        launch();
      } else if (e.key === 'Escape') {
        skip();
      } else if (e.key === 'ArrowRight') {
        nextChapter();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [launch, nextChapter, skip, toggleFullscreen]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Show the locked-screen view in the scene while idle.
  useEffect(() => {
    if (phase === 'idle') engineRef.current?.setLaunch(-COUNTDOWN);
  }, [phase]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audioRef.current.setMuted(next);
  };

  const idle = phase === 'idle';

  return (
    <div
      ref={rootRef}
      className={cn('fixed inset-0 z-[100] select-none text-fg', !idle && 'cursor-none')}
      role="region"
      aria-label="NEXUS launch"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(4,5,11,0.2),rgba(4,5,11,1))]"
        style={{ opacity: 0.55 }}
      />
      <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: 0 }} />

      {/* Locked screen */}
      {idle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-label text-fg-muted sm:text-xs">
            {siteConfig.organizingClub} · {siteConfig.departmentName}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
            NEXUS 2026
          </h1>

          <button
            onClick={launch}
            className="group relative mt-16 flex h-52 w-52 items-center justify-center rounded-full sm:h-64 sm:w-64"
            aria-label="Launch the NEXUS website"
            autoFocus
          >
            {/* Expanding pulses */}
            <span className="launch-ring absolute inset-0 rounded-full border border-ice/40" />
            <span className="launch-ring absolute inset-0 rounded-full border border-gold/30 [animation-delay:1.2s]" />
            {/* Rotating light arcs */}
            <span className="launch-arc absolute inset-0 rounded-full" />
            <span className="launch-arc-2 absolute inset-[7px] rounded-full" />
            {/* Glass core */}
            <span className="launch-core absolute inset-4 rounded-full border border-white/15 transition-all duration-700 group-hover:border-white/40 group-hover:shadow-[inset_0_0_60px_rgba(143,184,255,0.45),0_0_120px_-10px_rgba(143,184,255,0.8)]" />
            <span className="launch-core-glow absolute inset-4 rounded-full" />
            <span className="relative flex flex-col items-center">
              <span className="font-display text-2xl font-semibold uppercase tracking-[0.35em] text-fg sm:text-3xl">Launch</span>
              <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fg-muted transition-colors group-hover:text-fg">Press to begin</span>
            </span>
          </button>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-label text-fg-faint">
            Space to launch · F fullscreen · Esc skips to the site
          </p>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-fg-muted">
            <button onClick={toggleMute} className="flex items-center gap-2 text-xs transition-colors hover:text-fg">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              Sound {muted ? 'off' : 'on'}
            </button>
            <button onClick={toggleFullscreen} className="flex items-center gap-2 text-xs transition-colors hover:text-fg">
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>
      )}

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-[11px] uppercase tracking-label text-fg-muted">Launching in</p>
          <div
            key={count}
            className="launch-pop mt-4 font-display text-[9rem] font-semibold leading-none tabular-nums text-fg sm:text-[14rem]"
          >
            {count}
          </div>
        </div>
      )}

      {/* Title cards */}
      {phase === 'running' && <Cinematic t={t} />}

      {/* Logo reveal */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
      {logoBox && (
        <img
          ref={logoRef}
          src={siteConfig.branding.nexusLogo}
          alt="NEXUS"
          className="pointer-events-none absolute drop-shadow-[0_0_60px_rgba(110,150,255,0.45)]"
          style={{ left: logoBox.x, top: logoBox.y, width: logoBox.w, height: logoBox.h, opacity: 0 }}
        />
      )}
      {phase === 'running' && logoBox && (
        <div
          className="pointer-events-none absolute left-0 right-0 flex flex-col items-center text-center"
          style={{ top: logoBox.y + logoBox.h + 28 }}
        >
          <p className="font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">
            <span ref={taglineRef} />
            <span
              ref={cursorRef}
              className="launch-cursor ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] bg-ice"
              style={{ visibility: 'hidden' }}
            />
          </p>
          <div
            ref={lineRef}
            className="mt-6 flex flex-wrap justify-center gap-x-3 px-6 font-mono text-[11px] uppercase tracking-label text-fg-muted sm:text-xs"
            style={{ opacity: 0 }}
          >
            <span>{siteConfig.eventIdentity} by {siteConfig.organizingClub}</span>
            <span className="text-fg-faint">/</span>
            <span>{siteConfig.dates.display}</span>
          </div>
        </div>
      )}
    </div>
  );
}
