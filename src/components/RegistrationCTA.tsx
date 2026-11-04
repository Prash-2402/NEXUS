import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { scrollToId } from '../lib/motion';
import { SplitText } from './ui/SplitText';

interface RegistrationCTAProps {
  onRegisterClick: () => void;
}

export function RegistrationCTA({ onRegisterClick }: RegistrationCTAProps) {
  return (
    <section id="register" data-stage="5" className="section flex min-h-[90svh] items-center">
      <div className="container-site flex flex-col items-center text-center">
        <p className="chip" data-reveal>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          Registrations open
        </p>
        <SplitText
          as="h2"
          className="mt-8 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-fg sm:text-7xl lg:text-8xl"
          segments={[{ text: 'Your world' }, { text: 'is waiting.', className: 'text-gradient', br: true }]}
        />
        <p className="lead mt-6 max-w-xl" data-reveal>
          {siteConfig.dates.display}. Pick an event, register in under a minute and join the convergence.
        </p>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row" data-reveal>
          <button onClick={onRegisterClick} className="btn-primary w-full px-8 py-4 sm:w-auto">
            Find your event
            <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => scrollToId('schedule')} className="btn-ghost w-full px-8 py-4 sm:w-auto">
            View schedule
          </button>
        </div>
      </div>
    </section>
  );
}
