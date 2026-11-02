import { useState, useCallback } from 'react';
import { siteConfig } from './config/site';
import { NexusEvent, eventsData } from './data/events';
import { CinematicGalaxyBackground } from './components/CinematicGalaxyBackground';
import { CosmicOrbitConvergence } from './components/CosmicOrbitConvergence';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { EventUniverse } from './components/EventUniverse';
import { PromoVideo } from './components/PromoVideo';
import { Schedule } from './components/Schedule';
import { Organizers } from './components/Organizers';
import { FAQ } from './components/FAQ';
import { RegistrationCTA } from './components/RegistrationCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Check } from 'lucide-react';

export function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dedicated event registration dispatch
  const handleRegister = useCallback((event?: NexusEvent) => {
    // If no specific event is passed (e.g. from global Navbar, Hero, or CTA buttons),
    // scroll smoothly to the Event Universe so participants can select which event's form to open
    if (!event) {
      const el = document.getElementById('events');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setToastMessage('Choose an event below to open its official registration form.');
        setTimeout(() => setToastMessage(null), 4000);
      }
      return;
    }

    if (siteConfig.registration.status === 'closed' || !event.registrationEnabled) {
      setToastMessage(`Registrations for ${event.name} are currently closed.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const formUrl = event.registrationUrl || siteConfig.registration.eventForms[event.id] || '';

    if (formUrl && formUrl.trim() !== '') {
      setToastMessage(`Opening ${event.name} registration form in a new tab...`);
      setTimeout(() => {
        window.open(formUrl, '_blank', 'noopener,noreferrer');
      }, 300);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    } else {
      setToastMessage(`Official registration link for ${event.name} will be published shortly by CAADS.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  }, []);

  const handleExploreEvents = useCallback(() => {
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen text-[#F8FAFC] selection:bg-[#813CFF]/40 selection:text-white bg-[#030308]">
      {/* Cinematic Frame-by-Frame Galaxy Animation Background (301 FFmpeg video frames) */}
      <CinematicGalaxyBackground totalFrames={301} />

      {/* Rotating Cosmic Convergence Hub (Repositioned to precisely cover the Gemini watermark) */}
      <CosmicOrbitConvergence />

      {/* Main UI Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar onRegisterClick={() => handleRegister()} />

        <main className="flex-1">
          {/* Hero Section with Scroll-Controlled Sticky Track */}
          <Hero
            onRegisterClick={() => handleRegister()}
            onExploreClick={handleExploreEvents}
          />

          {/* About Section: More Than An Event. A Convergence. */}
          <About />

          {/* Event Universe Section: Technical, Non-Technical & Cultural */}
          <EventUniverse
            onRegisterEvent={(ev) => handleRegister(ev)}
            onGlobalRegister={() => handleRegister()}
          />

          {/* Promo Video Section: Experience Nexus */}
          <PromoVideo />

          {/* Schedule Section: 23 Nov – 5 Dec 2026 Interactive Calendar */}
          <Schedule
            onRegisterClick={(ev) => {
              if (ev?.eventId) {
                const found = eventsData.find((e: NexusEvent) => e.id === ev.eventId);
                if (found) {
                  handleRegister(found);
                  return;
                }
              }
              handleRegister();
            }}
          />

          {/* Organizers Section: CAADS & CHRIST University */}
          <Organizers />

          {/* FAQ Section: Knowledge Base */}
          <FAQ />

          {/* Registration Conversion CTA Banner */}
          <RegistrationCTA onRegisterClick={() => handleRegister()} />

          {/* Contact & Social Section */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer onRegisterClick={() => handleRegister()} />
      </div>

      {/* Real-time Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-[#090817]/95 border border-[#813CFF]/60 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#813CFF]/20 flex items-center justify-center text-[#F5C451] shrink-0">
              <Check className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">
                {toastMessage}
              </p>
              <p className="text-[11px] text-[#A1A1B5] mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-[#38bdf8]" />
                Official Google Form in new tab
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#A1A1B5] hover:text-white text-xs font-mono px-1"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
