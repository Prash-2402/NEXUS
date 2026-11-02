import { useState, useEffect } from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  formattedString: string;
}

export function useCountdown(targetDateIso: string, endDateIso?: string): CountdownTime {
  const calculateTime = (): CountdownTime => {
    const now = new Date().getTime();
    const target = new Date(targetDateIso).getTime();
    const end = endDateIso ? new Date(endDateIso).getTime() : target + (12 * 24 * 60 * 60 * 1000);

    if (now >= end) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: 'completed',
        formattedString: 'NEXUS Has Concluded',
      };
    }

    if (now >= target && now < end) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: 'in-progress',
        formattedString: 'NEXUS Is Live Now!',
      };
    }

    const difference = target - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      status: 'upcoming',
      formattedString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    };
  };

  const [time, setTime] = useState<CountdownTime>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateIso, endDateIso]);

  return time;
}

