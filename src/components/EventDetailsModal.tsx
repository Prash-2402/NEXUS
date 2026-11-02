import React, { useEffect, useRef } from 'react';
import { NexusEvent } from '../data/events';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Trophy
} from 'lucide-react';

interface EventDetailsModalProps {
  event: NexusEvent | null;
  onClose: () => void;
  onRegister: (event: NexusEvent) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const getCategoryColor = () => {
    switch (event.category) {
      case 'technical': return 'from-[#315CFF] to-[#17102E]';
      case 'non-technical': return 'from-[#813CFF] to-[#17102E]';
      case 'cultural': return 'from-[#F5C451] to-[#813CFF]';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-3xl bg-[#090817] border border-[#813CFF]/30 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header Gradient */}
        <div className={`h-3 w-full bg-gradient-to-r ${getCategoryColor()}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#17102E]/70 hover:bg-[#813CFF]/30 text-[#A1A1B5] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#813CFF]"
          aria-label="Close details dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Category & Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#813CFF]/20 text-[#d8b4fe] border border-[#813CFF]/30">
              {event.category.replace('-', ' ')}
            </span>
            {event.badge && (
              <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                {event.badge}
              </span>
            )}
          </div>

          {/* Event Name */}
          <h2 id="modal-title" className="font-space text-3xl sm:text-4xl font-extrabold text-white">
            {event.name}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
            {event.description || event.shortDescription || 'Event details coming soon.'}
          </p>

          {/* Surprise Challenge Notice for NEXUS Olympics */}
          {event.id === 'nexus-olympics' && (
            <div className="p-4 rounded-2xl bg-[#030308]/70 border border-[#813CFF]/30">
              <span className="flex items-center gap-2 text-xs font-bold text-[#F5C451] uppercase tracking-wider mb-2 font-space">
                <Trophy className="w-4 h-4" />
                Classified Surprise Arenas
              </span>
              <p className="text-xs text-[#A1A1B5] leading-relaxed">
                All internal challenge rounds and stage activities are classified surprises! Multi-stage arenas testing spontaneity, speed, and teamwork will be revealed live on the floor during the championship.
              </p>
            </div>
          )}

          {/* Sub-activities if present */}
          {event.subActivities && event.subActivities.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#030308]/60 border border-[#813CFF]/30">
              <span className="flex items-center gap-2 text-xs font-bold text-[#F5C451] uppercase tracking-wider mb-3">
                <Trophy className="w-4 h-4" />
                Featured Activities ({event.subActivities.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {event.subActivities.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-lg bg-[#090817] border border-white/5">
                    <span className="font-space text-sm font-semibold text-white block">
                      {act.name}
                    </span>
                    <span className="text-xs text-[#A1A1B5] block mt-0.5">
                      {act.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-white/5 flex items-start gap-3">
              <Users className="w-4 h-4 text-[#38bdf8] mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A1A1B5] block">Format</span>
                <span className="text-sm font-medium text-white">{event.format || 'Details coming soon'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#813CFF] mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A1A1B5] block">Eligibility</span>
                <span className="text-sm font-medium text-white">{event.eligibility || 'Details coming soon'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-white/5 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#F5C451] mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A1A1B5] block">Date</span>
                <span className="text-sm font-medium text-white">{event.date || 'Details coming soon'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-white/5 flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#38bdf8] mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A1A1B5] block">Time</span>
                <span className="text-sm font-medium text-white">
                  {event.startTime !== 'Details coming soon' ? `${event.startTime} - ${event.endTime}` : 'Details coming soon'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-white/5 flex items-start gap-3 sm:col-span-2">
              <MapPin className="w-4 h-4 text-[#813CFF] mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A1A1B5] block">Venue</span>
                <span className="text-sm font-medium text-white">{event.venue || 'Details coming soon'}</span>
              </div>
            </div>

            {event.poc && (
              <div className="p-3.5 rounded-xl bg-[#17102E]/40 border border-[#315CFF]/30 flex items-start gap-3 sm:col-span-2">
                <Users className="w-4 h-4 text-[#38bdf8] mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#38bdf8] font-semibold block">Event POC (Organizers)</span>
                  <span className="text-sm font-medium text-white">{event.poc}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rules & Guidelines Notice */}
          <div className="p-4 rounded-xl bg-[#030308]/60 border border-white/10 flex items-start gap-3">
            <FileText className="w-4 h-4 text-[#A1A1B5] mt-0.5 shrink-0" />
            <div className="text-xs text-[#A1A1B5] leading-relaxed">
              <strong className="text-white block font-medium mb-1">Participation Rules &amp; Rubrics:</strong>
              {event.rulesPlaceholder || 'Official rulebook, scoring criteria, and reporting guidelines will be published by the organizing committee prior to the event.'}
            </div>
          </div>

          {/* Dedicated Event Registration Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <span className="text-xs text-[#A1A1B5] text-center sm:text-left">
              Official Google Form for {event.name} will open in a new tab.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#A1A1B5] hover:text-white bg-[#030308] border border-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onRegister(event)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#813CFF]/30"
              >
                <span>Register for {event.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

