import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from './config/site';
import type { NexusEvent } from './data/events';
import { gsap, ScrollTrigger, scrollToId, useGsap } from './lib/motion';
import { SpaceBackground } from './scene/SpaceBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Worlds } from './components/Worlds';
import { EventUniverse } from './components/EventUniverse';
import { Schedule } from './components/Schedule';
import { Organizers } from './components/Organizers';
import { FAQ } from './components/FAQ';
import { RegistrationCTA } from './components/RegistrationCTA';
import { Footer } from './components/Footer';
import { Toast } from './components/ui/Toast';
import { isLaunchUrl } from './launch/isLaunchUrl';

const LaunchExperience = lazy(() => import('./launch/LaunchExperience').then((m) => ({ default: m.LaunchExperience })));
const launchMode = isLaunchUrl();

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();
  // In launch mode the site stays unmounted until the sequence hands over.
  const [revealed, setRevealed] = useState(!launchMode);
  const [showLaunch, setShowLaunch] = useState(launchMode);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  const handleRegister = useCallback(
    (event?: NexusEvent) => {
      if (!event) {
        scrollToId('events');
        showToast('Pick an event below to open its registration form.');
        return;
      }
      if (siteConfig.registration.status === 'closed' || !event.registrationEnabled) {
        showToast(`Registrations for ${event.name} are closed.`);
        return;
      }
      if (siteConfig.registration.status === 'coming_soon' || !event.registrationUrl) {
        showToast(`Registration for ${event.name} opens soon.`);
        return;
      }
      window.open(event.registrationUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opened the ${event.name} registration form in a new tab.`);
    },
    [showToast],
  );

  // Site-wide reveals: headings slide up word by word, blocks fade up.
  useGsap(rootRef, () => {
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      gsap.from(el.querySelectorAll('.split-word > span'), {
        yPercent: 115,
        duration: 1.2,
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    gsap.set(blocks, { autoAlpha: 0, y: 36 });
    ScrollTrigger.batch(blocks, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true }),
    });
  }, [revealed]);

  // Recalculate trigger positions once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen text-fg">
      <a
        href="#events"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to events
      </a>

      <SpaceBackground />

      {revealed && (
        <>
          <Navbar onRegisterClick={() => handleRegister()} />
          <main className="relative z-10">
            <Hero onRegisterClick={() => handleRegister()} onExploreClick={() => scrollToId('events')} />
            <About />
            <Worlds />
            <EventUniverse onRegisterEvent={handleRegister} />
            <Schedule onRegister={handleRegister} />
            <Organizers />
            <FAQ />
            <RegistrationCTA onRegisterClick={() => handleRegister()} />
          </main>
          <Footer />
          <Toast message={toast} onDismiss={() => setToast(null)} />
        </>
      )}

      {showLaunch && (
        <Suspense fallback={null}>
          <LaunchExperience onReveal={() => setRevealed(true)} onFinished={() => setShowLaunch(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
