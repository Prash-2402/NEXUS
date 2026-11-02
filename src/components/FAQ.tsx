import React, { useState } from 'react';
import { faqData } from '../data/faq';
import { HelpCircle, ChevronDown, MessageCircle, Mail } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#813CFF]/15 border border-[#813CFF]/30 text-xs font-semibold text-[#c084fc] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#F5C451]" />
            Knowledge Base
          </div>
          <h2 className="font-space text-3xl sm:text-5xl font-bold tracking-tight text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-3 text-base text-[#A1A1B5]">
            Everything you need to know about navigating the NEXUS universe, verified eligibility, and registrations.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-[#090817] border-[#813CFF]/50 shadow-xl shadow-black/40'
                    : 'bg-[#090817]/60 border-white/5 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#813CFF] rounded-2xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="font-space text-base sm:text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#813CFF]" />
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#17102E] border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#813CFF]/30 border-[#813CFF]/50' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#A1A1B5] leading-relaxed border-t border-white/5 animate-in fade-in duration-200"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Prompt */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#17102E]/60 to-[#090817]/80 border border-[#813CFF]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#813CFF]/20 flex items-center justify-center text-[#c084fc] shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-space text-sm font-bold text-white">Have a specific question not listed here?</h4>
              <p className="text-xs text-[#A1A1B5]">Our organizing committee is here to assist you.</p>
            </div>
          </div>
          <a
            href="mailto:caads@christuniversity.in"
            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#030308] border border-[#813CFF]/40 hover:bg-[#813CFF]/20 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#F5C451]" />
            Email The CAADS Team
          </a>
        </div>

      </div>
    </section>
  );
};

