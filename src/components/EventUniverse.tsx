import React, { useState } from 'react';
import { eventsData, EventCategory, categoryMeta, NexusEvent } from '../data/events';
import { CategorySelector } from './CategorySelector';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { Compass, Globe2 } from 'lucide-react';

interface EventUniverseProps {
  onRegisterEvent: (event: NexusEvent) => void;
  onGlobalRegister?: () => void;
}

export const EventUniverse: React.FC<EventUniverseProps> = ({
  onRegisterEvent,
}) => {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [selectedEvent, setSelectedEvent] = useState<NexusEvent | null>(null);

  // Filter events based on active category
  const filteredEvents = activeCategory === 'all'
    ? eventsData
    : eventsData.filter((e) => e.category === activeCategory);

  // Compute counts
  const counts = {
    all: eventsData.length,
    technical: eventsData.filter((e) => e.category === 'technical').length,
    'non-technical': eventsData.filter((e) => e.category === 'non-technical').length,
    cultural: eventsData.filter((e) => e.category === 'cultural').length,
  };

  return (
    <section
      id="events"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#813CFF]/15 border border-[#813CFF]/30 text-xs font-semibold text-[#c084fc] mb-4">
            <Globe2 className="w-3.5 h-3.5 text-[#38bdf8]" />
            Three Worlds Converging
          </div>
          <h2 className="font-space text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            THE EVENT UNIVERSE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A1A1B5] leading-relaxed">
            Navigate through distinct planetary domains. Explore verified competitions, masterclasses, forensic simulations, and artistic stages across NEXUS.
          </p>
        </div>

        {/* 3 Worlds Visual Cards (Worlds Section) */}
        <div id="worlds" className="mb-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['technical', 'non-technical', 'cultural'] as const).map((catKey) => {
            const meta = categoryMeta[catKey];
            const isSelected = activeCategory === catKey;

            return (
              <div
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? `bg-[#090817] ${meta.borderClass} shadow-xl`
                    : 'bg-[#090817]/60 border-white/10 hover:border-white/30'
                }`}
              >
                {/* Subtle World Atmospheric Glow */}
                <div
                  className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: meta.accentColor }}
                />

                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border font-semibold"
                    style={{
                      borderColor: `${meta.accentColor}55`,
                      color: meta.accentColor,
                      backgroundColor: `${meta.accentColor}15`,
                    }}
                  >
                    {meta.worldName}
                  </span>
                  <Compass
                    className="w-4 h-4 transition-transform group-hover:rotate-45"
                    style={{ color: meta.accentColor }}
                  />
                </div>

                <h3 className="font-space text-2xl font-bold text-white group-hover:text-[#F8FAFC]">
                  {meta.title}
                </h3>
                <h4
                  className="text-xs uppercase tracking-wider font-semibold mt-1"
                  style={{ color: meta.accentColor }}
                >
                  {meta.headline}
                </h4>
                <p className="text-xs text-[#A1A1B5] mt-3 leading-relaxed">
                  {meta.description}
                </p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                  <span className="text-[#A1A1B5]">
                    {counts[catKey]} Verified Events
                  </span>
                  <span
                    className="font-semibold flex items-center gap-1 group-hover:underline"
                    style={{ color: meta.accentColor }}
                  >
                    {isSelected ? 'Viewing World' : 'Enter World'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Filter Selector Tabs */}
        <div className="mb-10">
          <CategorySelector
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            counts={counts}
          />
        </div>

        {/* Dynamic Category World Banner when specific category is active */}
        {activeCategory !== 'all' && (
          <div className="mb-10 p-5 rounded-2xl bg-[#090817]/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-[#A1A1B5]">
                Currently Exploring:
              </span>
              <h3 className="font-space text-xl font-bold text-white flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: categoryMeta[activeCategory].accentColor }}
                />
                {categoryMeta[activeCategory].title} — {categoryMeta[activeCategory].worldName}
              </h3>
            </div>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs text-[#A1A1B5] hover:text-white underline underline-offset-4 self-start sm:self-auto"
            >
              Reset to All Worlds
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpenDetails={(ev) => setSelectedEvent(ev)}
              onRegister={(ev) => onRegisterEvent(ev)}
            />
          ))}
        </div>

        {/* Dedicated Event Registration Notice */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-xs sm:text-sm text-[#A1A1B5]">
            Each event features a dedicated Google Form for team and individual entries. Click &quot;Register&quot; on any event above to open its official form directly in a new tab.
          </p>
        </div>

      </div>

      {/* Accessible Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={(ev) => {
          setSelectedEvent(null);
          onRegisterEvent(ev);
        }}
      />
    </section>
  );
};

