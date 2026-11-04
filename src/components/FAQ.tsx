import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqData } from '../data/faq';
import { cn } from '../lib/utils';
import { SectionHeader } from './ui/SectionHeader';

export function FAQ() {
  const [open, setOpen] = useState<string | null>(faqData[0]?.id ?? null);

  return (
    <section id="faq" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader index="06" label="FAQ" title={[{ text: 'Questions,' }, { text: 'answered.', className: 'text-gradient', br: true }]} />
        </div>

        <div className="border-t border-white/[0.08] lg:col-span-7">
          {faqData.map((item) => {
            const isOpen = open === item.id;
            return (
              <div key={item.id} className="border-b border-white/[0.08]" data-reveal>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                  >
                    <span className={cn('font-display text-lg transition-colors sm:text-xl', isOpen ? 'text-fg' : 'text-fg/80 hover:text-fg')}>
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-out',
                        isOpen ? 'rotate-45 border-white/40 text-fg' : 'border-white/15 text-fg-muted',
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${item.id}`}
                  role="region"
                  className={cn('grid transition-[grid-template-rows] duration-500 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-fg-muted">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
