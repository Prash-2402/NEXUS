import React, { useState } from 'react';
import { scheduleConfig, DaySchedule } from '../data/schedule';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Bell,
  Compass,
  Users,
} from 'lucide-react';

interface ScheduleProps {
  onRegisterClick?: (event?: { eventId?: string; eventName: string; registrationUrl?: string }) => void;
}

interface CalendarMonth {
  name: string;
  year: number;
  monthNumber: number; // 11 for Nov, 12 for Dec
  totalDays: number;
  startDayOfWeek: number; // 0 for Monday, 6 for Sunday
}

const MONTHS: CalendarMonth[] = [
  {
    name: 'November 2026',
    year: 2026,
    monthNumber: 11,
    totalDays: 30,
    startDayOfWeek: 6, // Nov 1, 2026 is Sunday (index 6 in Mon-start)
  },
  {
    name: 'December 2026',
    year: 2026,
    monthNumber: 12,
    totalDays: 31,
    startDayOfWeek: 1, // Dec 1, 2026 is Tuesday (index 1 in Mon-start)
  },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Schedule: React.FC<ScheduleProps> = ({ onRegisterClick }) => {
  // Default to first festival day: Nov 23, 2026 (Day 1)
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-23');
  // Default view: November (0)
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);

  const currentMonth = MONTHS[currentMonthIndex];

  // Map of date string to DaySchedule
  const dayScheduleMap = React.useMemo(() => {
    const map = new Map<string, DaySchedule>();
    scheduleConfig.days.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, []);

  const selectedDaySchedule = dayScheduleMap.get(selectedDate);
  const isSelectedSunday = new Date(`${selectedDate}T12:00:00`).getDay() === 0;

  // Check if date is within Nov 23 - Dec 5
  const isFestivalDate = (dateStr: string) => {
    return dateStr >= scheduleConfig.festivalStartDate && dateStr <= scheduleConfig.festivalEndDate;
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    // If the selected date is in December and currently viewing November, auto-switch month
    if (dateStr.startsWith('2026-12') && currentMonthIndex === 0) {
      setCurrentMonthIndex(1);
    } else if (dateStr.startsWith('2026-11') && currentMonthIndex === 1) {
      setCurrentMonthIndex(0);
    }
  };

  const handleRegisterEvent = (e: React.MouseEvent, eventItem: { eventName: string; registrationUrl?: string; eventId?: string }) => {
    e.stopPropagation();
    if (onRegisterClick) {
      onRegisterClick({ eventId: eventItem.eventId, eventName: eventItem.eventName, registrationUrl: eventItem.registrationUrl });
    } else if (eventItem.registrationUrl) {
      window.open(eventItem.registrationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="schedule"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#315CFF]/15 border border-[#315CFF]/30 text-xs font-semibold text-[#38bdf8] mb-4">
            <CalendarIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
            Interactive Festival Calendar
          </div>
          <h2 className="font-space text-3xl sm:text-5xl font-bold tracking-tight text-white">
            THE NEXUS SCHEDULE
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#F5C451] font-medium">
            23 November 2026 – 5 December 2026
          </p>
          <p className="mt-1 text-xs sm:text-sm text-[#A1A1B5]">
            Click any highlighted festival date below to inspect the events, timings, venues, and registration links for that day.
          </p>
        </div>

        {/* Quick Festival Day Strip (Horizontal One-Tap Navigation) */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#A1A1B5] mb-2 px-1">
            <span className="font-space uppercase tracking-wider font-semibold text-[#F8FAFC] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C451]" />
              Festival Timeline Jump
            </span>
            <span className="text-[11px] text-[#A1A1B5]">13 Cosmic Days</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {scheduleConfig.days.map((day) => {
              const isSelected = selectedDate === day.date;
              const isSunday = new Date(`${day.date}T12:00:00`).getDay() === 0;
              return (
                <button
                  key={day.date}
                  onClick={() => handleSelectDate(day.date)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#315CFF] to-[#813CFF] text-white border-[#813CFF]/60 shadow-lg shadow-[#813CFF]/40 scale-105'
                      : isSunday
                      ? 'bg-[#090817]/60 text-[#A1A1B5]/80 border-[#F5C451]/25 hover:text-white hover:bg-[#17102E]'
                      : 'bg-[#090817]/80 text-[#A1A1B5] border-white/10 hover:text-white hover:bg-[#17102E]'
                  }`}
                >
                  <span className="font-mono text-[11px] block text-left flex items-center justify-between gap-1.5">
                    <span>Day {day.dayNumber}</span>
                    {isSunday && (
                      <span className="text-[9px] text-[#F5C451] font-bold">Sun</span>
                    )}
                  </span>
                  <span className="text-xs font-space font-medium block text-left">
                    {day.date.startsWith('2026-11')
                      ? `Nov ${parseInt(day.date.split('-')[2])}`
                      : `Dec ${parseInt(day.date.split('-')[2])}`}
                    {isSunday && (
                      <span className="ml-1 text-[10px] text-[#F5C451] font-mono">Rest Day</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Calendar on Left (7 cols), Selected Day Events on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Calendar View (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#090817]/90 border border-[#813CFF]/30 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
            
            {/* Month Header & Switcher */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonthIndex(0)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-space transition-all border ${
                    currentMonthIndex === 0
                      ? 'bg-[#315CFF]/30 text-white border-[#315CFF]/60 shadow-md'
                      : 'bg-[#030308]/60 text-[#A1A1B5] border-white/5 hover:text-white'
                  }`}
                >
                  November 2026
                  <span className="ml-1.5 text-[10px] text-[#38bdf8] font-mono">
                    (Nov 23–30)
                  </span>
                </button>
                <button
                  onClick={() => setCurrentMonthIndex(1)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-space transition-all border ${
                    currentMonthIndex === 1
                      ? 'bg-[#813CFF]/30 text-white border-[#813CFF]/60 shadow-md'
                      : 'bg-[#030308]/60 text-[#A1A1B5] border-white/5 hover:text-white'
                  }`}
                >
                  December 2026
                  <span className="ml-1.5 text-[10px] text-[#F5C451] font-mono">
                    (Dec 1–5)
                  </span>
                </button>
              </div>

              {/* Month Next / Prev Toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentMonthIndex((prev) => (prev === 0 ? 1 : 0))}
                  className="p-2 rounded-lg bg-[#030308]/60 hover:bg-[#17102E] text-[#A1A1B5] hover:text-white border border-white/5 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentMonthIndex((prev) => (prev === 1 ? 0 : 1))}
                  className="p-2 rounded-lg bg-[#030308]/60 hover:bg-[#17102E] text-[#A1A1B5] hover:text-white border border-white/5 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className={`py-1 text-[11px] sm:text-xs font-mono uppercase font-semibold ${
                    w === 'Sun' ? 'text-[#F5C451]/80' : 'text-[#A1A1B5]'
                  }`}
                >
                  {w}
                  {w === 'Sun' && (
                    <span className="block text-[8px] font-mono tracking-tighter text-[#A1A1B5]/60 -mt-0.5">
                      Off
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Padding empty cells before month start */}
              {Array.from({ length: currentMonth.startDayOfWeek }).map((_, i) => (
                <div
                  key={`pad-${i}`}
                  className="h-14 sm:h-16 rounded-xl bg-transparent opacity-20 pointer-events-none"
                />
              ))}

              {/* Month day cells */}
              {Array.from({ length: currentMonth.totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = currentMonth.monthNumber.toString().padStart(2, '0');
                const dayStr = dayNum.toString().padStart(2, '0');
                const dateStr = `${currentMonth.year}-${monthStr}-${dayStr}`;

                const inFestival = isFestivalDate(dateStr);
                const isSelected = selectedDate === dateStr;
                const isSunday = (currentMonth.startDayOfWeek + i) % 7 === 6;
                const dayData = dayScheduleMap.get(dateStr);
                const eventCount = dayData ? dayData.events.length : 0;

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleSelectDate(dateStr)}
                    className={`relative h-14 sm:h-16 rounded-xl p-1 sm:p-1.5 flex flex-col justify-between text-left transition-all duration-200 border ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#315CFF]/40 via-[#813CFF]/50 to-[#090817] border-[#F5C451] ring-2 ring-[#F5C451]/50 shadow-lg shadow-[#813CFF]/50 scale-[1.03] z-10'
                        : inFestival
                        ? 'bg-[#17102E]/60 border-[#813CFF]/40 hover:border-[#813CFF]/80 hover:bg-[#17102E]/90 hover:scale-[1.02]'
                        : 'bg-[#030308]/40 border-white/5 opacity-35 hover:opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-space font-bold ${
                          isSelected
                            ? 'text-[#F5C451]'
                            : inFestival
                            ? 'text-white'
                            : 'text-[#A1A1B5]'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Festival Day Badge */}
                      {dayData && (
                        <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-[#813CFF]/30 text-[#38bdf8] border border-[#813CFF]/40">
                          D{dayData.dayNumber}
                        </span>
                      )}
                    </div>

                    {/* Bottom Status / Event Count Indicator */}
                    <div className="w-full">
                      {isSunday ? (
                        <span className="text-[9px] text-[#F5C451]/90 font-mono font-medium leading-none block truncate">
                          No Events
                        </span>
                      ) : inFestival ? (
                        <div className="flex items-center gap-1">
                          {eventCount > 0 ? (
                            <span className="text-[10px] text-[#A1A1B5] font-mono leading-none truncate">
                              {eventCount} {eventCount === 1 ? 'event' : 'events'}
                            </span>
                          ) : (
                            <span className="text-[9px] text-[#A1A1B5]/70 italic leading-none">
                              TBD
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="h-1 block" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A1A1B5]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#813CFF]/60 border border-[#813CFF]" />
                  NEXUS Festival Window (Nov 23 – Dec 5)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#315CFF] to-[#813CFF] border border-[#F5C451]" />
                  Selected Day
                </span>
              </div>
              <span className="text-[11px] text-[#F5C451] font-mono">
                13 Official Festival Days
              </span>
            </div>

          </div>

          {/* Right Column: Events On Selected Day (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#090817]/90 border border-[#813CFF]/30 p-5 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Selected Date Header */}
              {selectedDaySchedule ? (
                <div className="mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#813CFF]/20 text-[#38bdf8] border border-[#813CFF]/40">
                      DAY {selectedDaySchedule.dayNumber} OF 13
                    </span>
                    <span className="text-xs text-[#A1A1B5] font-mono">
                      {selectedDaySchedule.date}
                    </span>
                  </div>
                  <h3 className="font-space text-xl sm:text-2xl font-bold text-white">
                    {selectedDaySchedule.displayDate}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F5C451] font-medium mt-1">
                    {selectedDaySchedule.phaseTitle}
                  </p>
                </div>
              ) : (
                <div className="mb-6 pb-4 border-b border-white/10">
                  <span className="text-xs text-[#A1A1B5] font-mono block">
                    {selectedDate}
                  </span>
                  <h3 className="font-space text-lg font-bold text-white mt-1">
                    Outside Festival Window
                  </h3>
                  <p className="text-xs text-[#A1A1B5] mt-1">
                    NEXUS runs from 23 November to 5 December 2026. Select any date inside the highlighted period.
                  </p>
                </div>
              )}

              {/* Event Cards List */}
              {selectedDaySchedule && selectedDaySchedule.events.length > 0 ? (
                <div className="space-y-4">
                  {selectedDaySchedule.events.map((ev) => {
                    const getCategoryBadge = () => {
                      switch (ev.category) {
                        case 'technical':
                          return 'bg-[#315CFF]/15 text-[#38bdf8] border-[#315CFF]/30';
                        case 'non-technical':
                          return 'bg-[#813CFF]/15 text-[#c084fc] border-[#813CFF]/30';
                        case 'cultural':
                          return 'bg-[#F5C451]/15 text-[#F5C451] border-[#F5C451]/30';
                      }
                    };

                    const getCategoryBorder = () => {
                      switch (ev.category) {
                        case 'technical': return 'border-l-4 border-l-[#315CFF]';
                        case 'non-technical': return 'border-l-4 border-l-[#813CFF]';
                        case 'cultural': return 'border-l-4 border-l-[#F5C451]';
                      }
                    };

                    return (
                      <div
                        key={ev.id}
                        className={`p-4 sm:p-5 rounded-2xl bg-[#030308]/70 border border-white/5 ${getCategoryBorder()} hover:border-white/20 transition-all`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getCategoryBadge()}`}
                          >
                            {ev.category}
                          </span>
                          <span className="text-[11px] text-[#A1A1B5] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#38bdf8]" />
                            {ev.startTime}
                          </span>
                        </div>

                        <h4 className="font-space text-base sm:text-lg font-bold text-white mb-1.5">
                          {ev.eventName}
                        </h4>

                        {ev.description && (
                          <p className="text-xs text-[#A1A1B5] leading-relaxed mb-3">
                            {ev.description}
                          </p>
                        )}

                        {ev.poc && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1B5]/80 mb-2.5">
                            <Users className="w-3 h-3 text-[#38bdf8] shrink-0" />
                            <span className="truncate">POC: <span className="text-[#F8FAFC]">{ev.poc}</span></span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-[#A1A1B5]">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#813CFF] shrink-0" />
                            <span className="truncate">{ev.venue}</span>
                          </span>

                          <button
                            onClick={(e) => handleRegisterEvent(e, ev)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] to-[#813CFF] hover:opacity-90 transition-opacity shrink-0"
                          >
                            <span>Register</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isSelectedSunday ? (
                /* Dedicated Sunday Break Card */
                <div className="p-6 rounded-2xl bg-[#030308]/60 border border-[#F5C451]/30 text-center flex flex-col items-center justify-center my-4">
                  <div className="w-12 h-12 rounded-xl bg-[#17102E] border border-[#F5C451]/40 flex items-center justify-center mb-3 text-[#F5C451]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-space text-base sm:text-lg font-bold text-white mb-1">
                    Sunday — No Events Scheduled
                  </h4>
                  <p className="text-xs text-[#A1A1B5] max-w-xs leading-relaxed mb-5">
                    There are no festival events, competitions, or sessions scheduled on Sundays during NEXUS. All festival activities resume on Monday.
                  </p>
                  <button
                    onClick={() => handleSelectDate('2026-11-30')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#315CFF] to-[#813CFF] hover:opacity-90 transition-opacity shadow-md"
                  >
                    <span>View Monday&apos;s Lineup (Nov 30)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : selectedDaySchedule ? (
                /* Placeholder for dates where user will add info later */
                <div className="p-6 rounded-2xl bg-[#030308]/60 border border-[#813CFF]/20 text-center flex flex-col items-center justify-center my-4">
                  <div className="w-12 h-12 rounded-xl bg-[#17102E] border border-[#813CFF]/30 flex items-center justify-center mb-3 text-[#F5C451]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-space text-base font-bold text-white mb-1">
                    Schedule Details Coming Soon
                  </h4>
                  <p className="text-xs text-[#A1A1B5] max-w-xs leading-relaxed mb-4">
                    The detailed session lineup, competitive brackets, and stage timings for Day {selectedDaySchedule.dayNumber} ({selectedDaySchedule.displayDate}) are being finalized by the organizing committee.
                  </p>
                  <a
                    href="#events"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#17102E] hover:bg-[#813CFF]/30 border border-[#813CFF]/40 transition-colors"
                  >
                    <span>Browse All Festival Events</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#030308]/60 border border-white/10 text-center flex flex-col items-center justify-center my-4">
                  <p className="text-xs text-[#A1A1B5] mb-3">
                    Please click on any highlighted date between Nov 23 and Dec 5 on the calendar.
                  </p>
                  <button
                    onClick={() => handleSelectDate('2026-11-23')}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#315CFF] to-[#813CFF]"
                  >
                    Jump to Day 1 (23 November)
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Help Notice */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A1A1B5]">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#F5C451]" />
                <span>Timings updated as released.</span>
              </div>
              <a
                href="#faq"
                className="font-medium text-white hover:text-[#38bdf8] flex items-center gap-1 transition-colors"
              >
                <Compass className="w-3 h-3" />
                Schedule FAQ
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
