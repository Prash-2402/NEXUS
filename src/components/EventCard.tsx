import React from 'react';
import { NexusEvent } from '../data/events';
import { 
  Terminal, 
  Binary, 
  Cpu, 
  BookOpen, 
  Trophy, 
  Search, 
  Palette, 
  Mic, 
  Theater, 
  ArrowRight,
  Info,
  Gamepad2,
  Users,
  Lightbulb,
  Calendar,
  Clock,
  MapPin,
  UserCheck
} from 'lucide-react';

interface EventCardProps {
  event: NexusEvent;
  onOpenDetails: (event: NexusEvent) => void;
  onRegister: (event: NexusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onOpenDetails,
  onRegister,
}) => {
  // Map icon name to Lucide component
  const renderIcon = () => {
    const props = { className: 'w-5 h-5' };
    switch (event.iconName) {
      case 'Terminal': return <Terminal {...props} />;
      case 'Binary': return <Binary {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Mic': return <Mic {...props} />;
      case 'Theater': return <Theater {...props} />;
      case 'Gamepad': return <Gamepad2 {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  // Color schemes according to category
  const getTheme = () => {
    switch (event.category) {
      case 'technical':
        return {
          cardBg: 'bg-[#090b1c]/80',
          border: 'border-[#315CFF]/30 hover:border-[#315CFF]/80',
          glow: 'hover:shadow-[0_0_30px_rgba(49,92,255,0.25)]',
          iconBg: 'bg-[#315CFF]/15 text-[#38bdf8] border-[#315CFF]/40',
          badgeBg: 'bg-[#315CFF]/15 text-[#93c5fd] border-[#315CFF]/30',
          accent: '#315CFF',
        };
      case 'non-technical':
        return {
          cardBg: 'bg-[#0e0a20]/80',
          border: 'border-[#813CFF]/30 hover:border-[#813CFF]/80',
          glow: 'hover:shadow-[0_0_30px_rgba(129,60,255,0.25)]',
          iconBg: 'bg-[#813CFF]/15 text-[#c084fc] border-[#813CFF]/40',
          badgeBg: 'bg-[#813CFF]/15 text-[#d8b4fe] border-[#813CFF]/30',
          accent: '#813CFF',
        };
      case 'cultural':
        return {
          cardBg: 'bg-[#150f14]/80',
          border: 'border-[#F5C451]/30 hover:border-[#F5C451]/80',
          glow: 'hover:shadow-[0_0_30px_rgba(245,196,81,0.2)]',
          iconBg: 'bg-[#F5C451]/15 text-[#F5C451] border-[#F5C451]/40',
          badgeBg: 'bg-[#F5C451]/15 text-[#fef08a] border-[#F5C451]/30',
          accent: '#F5C451',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`group relative rounded-2xl ${theme.cardBg} border ${theme.border} ${theme.glow} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-md shadow-xl`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Icon Badge */}
          <div className={`w-11 h-11 rounded-xl ${theme.iconBg} border flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
            {renderIcon()}
          </div>

          {/* Category & Badge */}
          <div className="flex items-center gap-2">
            {event.badge && (
              <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${theme.badgeBg}`}>
                {event.badge}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1B5] font-medium">
              {event.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Event Name */}
        <h3 className="font-space text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#A1A1B5] transition-all">
          {event.name}
        </h3>

        {/* Short Description */}
        <p className="mt-3 text-sm text-[#A1A1B5] leading-relaxed line-clamp-3">
          {event.shortDescription || 'Event details coming soon.'}
        </p>

        {/* Event Key Meta Preview */}
        <div className="mt-4 pt-3.5 border-t border-white/5 space-y-1.5 text-xs text-[#A1A1B5]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#F5C451] shrink-0" />
            <span className="font-space font-medium text-[#F8FAFC] truncate">{event.date}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 truncate">
              <Clock className="w-3 h-3 text-[#38bdf8] shrink-0" />
              <span className="truncate">{event.startTime}{event.endTime && event.endTime !== 'Details coming soon' ? ` - ${event.endTime}` : ''}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate text-right">
              <MapPin className="w-3 h-3 text-[#813CFF] shrink-0" />
              <span className="truncate max-w-[120px]">{event.venue}</span>
            </span>
          </div>
          {event.poc && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#A1A1B5]/80 pt-0.5">
              <UserCheck className="w-3 h-3 text-[#38bdf8] shrink-0" />
              <span className="truncate"><strong className="text-[#A1A1B5]">POC:</strong> {event.poc}</span>
            </div>
          )}
        </div>

        {/* Mystery Surprise Arenas badge for NEXUS Olympics */}
        {event.id === 'nexus-olympics' && (
          <div className="mt-4 pt-4 border-t border-[#813CFF]/20 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#F5C451] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C451] animate-pulse" />
              Surprise Arenas Revealed Live
            </span>
          </div>
        )}

        {/* Sub-activities preview (if any event has explicit subActivities) */}
        {event.subActivities && event.subActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#813CFF]/20">
            <span className="text-[11px] font-semibold text-[#c084fc] uppercase tracking-wider block mb-2">
              Featured Activities ({event.subActivities.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {event.subActivities.map((act) => (
                <span
                  key={act.id}
                  className="px-2 py-0.5 rounded text-[11px] bg-[#030308]/60 text-[#e2e8f0] border border-[#813CFF]/25 font-mono"
                >
                  {act.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-7 pt-4 border-t border-white/5 flex items-center gap-3">
        {/* View Details Button */}
        <button
          onClick={() => onOpenDetails(event)}
          className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] bg-[#030308]/80 hover:bg-[#17102E] border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#813CFF]"
        >
          <Info className="w-3.5 h-3.5 text-[#A1A1B5]" />
          Details
        </button>

        {/* Register Button */}
        <button
          onClick={() => onRegister(event)}
          className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] to-[#813CFF] hover:from-[#315CFF]/90 hover:to-[#F5C451]/90 transition-all duration-300 shadow-md shadow-[#813CFF]/20 flex items-center justify-center gap-1.5 group/btn focus:outline-none focus:ring-2 focus:ring-[#F5C451]"
        >
          <span>Register</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

