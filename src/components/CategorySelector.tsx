import React from 'react';
import { EventCategory } from '../data/events';
import { Layers, Terminal, Trophy, Palette } from 'lucide-react';

interface CategorySelectorProps {
  activeCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
  counts: {
    all: number;
    technical: number;
    'non-technical': number;
    cultural: number;
  };
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categories: Array<{
    id: EventCategory;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    activeClass: string;
    badgeColor: string;
  }> = [
    {
      id: 'all',
      label: 'All Worlds',
      sublabel: 'Complete Universe',
      icon: <Layers className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-[#315CFF]/30 via-[#813CFF]/30 to-[#F5C451]/30 border-[#813CFF]/60 text-white shadow-[0_0_20px_rgba(129,60,255,0.3)]',
      badgeColor: 'bg-[#813CFF]/20 text-white',
    },
    {
      id: 'technical',
      label: 'Technical',
      sublabel: 'World of Synthesis',
      icon: <Terminal className="w-4 h-4 text-[#315CFF]" />,
      activeClass: 'bg-[#315CFF]/20 border-[#315CFF] text-white shadow-[0_0_20px_rgba(49,92,255,0.4)]',
      badgeColor: 'bg-[#315CFF]/20 text-[#38bdf8]',
    },
    {
      id: 'non-technical',
      label: 'Non-Technical',
      sublabel: 'Kinetic & Olympics',
      icon: <Trophy className="w-4 h-4 text-[#813CFF]" />,
      activeClass: 'bg-[#813CFF]/25 border-[#813CFF] text-white shadow-[0_0_20px_rgba(129,60,255,0.4)]',
      badgeColor: 'bg-[#813CFF]/20 text-[#c084fc]',
    },
    {
      id: 'cultural',
      label: 'Cultural',
      sublabel: 'World of Resonance',
      icon: <Palette className="w-4 h-4 text-[#F5C451]" />,
      activeClass: 'bg-[#F5C451]/15 border-[#F5C451] text-white shadow-[0_0_20px_rgba(245,196,81,0.35)]',
      badgeColor: 'bg-[#F5C451]/20 text-[#F5C451]',
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="inline-flex p-1.5 rounded-2xl bg-[#090817]/90 border border-[#813CFF]/20 backdrop-blur-md max-w-full overflow-x-auto shadow-2xl">
        <div className="flex items-center gap-1.5 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-space text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2.5 border ${
                  isActive
                    ? cat.activeClass
                    : 'border-transparent text-[#A1A1B5] hover:text-white hover:bg-[#17102E]/50'
                } focus:outline-none focus:ring-2 focus:ring-[#813CFF]`}
                aria-pressed={isActive}
              >
                <span>{cat.icon}</span>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : cat.badgeColor
                      }`}
                    >
                      {counts[cat.id]}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[#A1A1B5] hidden sm:inline">
                    {cat.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

