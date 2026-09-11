'use client';

import React, { useState, useEffect } from 'react';

interface EventCountdownProps {
  targetDate?: string;
}

// Default target: Tuesday 29th September 2026 at 6:30pm UK Time (BST: UTC+1)
const DEFAULT_UK_TARGET = '2026-09-29T18:30:00+01:00';

function getTimeRemaining(targetDateStr: string) {
  try {
    // If simple date string without timezone offset is passed, default to UK BST (+01:00)
    let dateInput = targetDateStr || DEFAULT_UK_TARGET;
    if (dateInput.endsWith(':00') && !dateInput.includes('+') && !dateInput.includes('Z')) {
      dateInput += '+01:00';
    }

    const target = new Date(dateInput).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
  } catch {
    // Fallback
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

export function EventCountdown({ targetDate = DEFAULT_UK_TARGET }: EventCountdownProps) {
  // Start as null so the server HTML and the first client render match exactly.
  // The real countdown only starts once mounted on the client.
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeRemaining> | null>(null);

  useEffect(() => {
    // Immediate calculation on mount
    setTimeLeft(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (value: number | undefined) =>
    timeLeft ? String(value).padStart(2, '0') : '--';

  return (
    <div className="flex items-center gap-2.5 pt-3">
      {/* Days */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-3.5 py-2 text-center min-w-[62px] sm:min-w-[70px] shadow-lg">
        <span className="text-xl sm:text-2xl font-extrabold text-white block leading-none">
          {timeLeft ? timeLeft.days : '--'}
        </span>
        <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold block mt-1">Days</span>
      </div>

      <span className="text-white/60 font-bold text-lg">-</span>

      {/* Hours */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-3.5 py-2 text-center min-w-[62px] sm:min-w-[70px] shadow-lg">
        <span className="text-xl sm:text-2xl font-extrabold text-white block leading-none">
          {pad(timeLeft?.hours)}
        </span>
        <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold block mt-1">Hours</span>
      </div>

      <span className="text-white/60 font-bold text-lg">:</span>

      {/* Minutes */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-3.5 py-2 text-center min-w-[62px] sm:min-w-[70px] shadow-lg">
        <span className="text-xl sm:text-2xl font-extrabold text-white block leading-none">
          {pad(timeLeft?.minutes)}
        </span>
        <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold block mt-1">Mins</span>
      </div>

      <span className="text-white/60 font-bold text-lg">:</span>

      {/* Seconds */}
      <div className="bg-[#FF6600] backdrop-blur-md border border-white/30 rounded-xl px-3 sm:px-3.5 py-2 text-center min-w-[62px] sm:min-w-[70px] shadow-lg">
        <span className="text-xl sm:text-2xl font-extrabold text-white block leading-none">
          {pad(timeLeft?.seconds)}
        </span>
        <span className="text-[10px] text-white/90 uppercase tracking-wider font-semibold block mt-1">Secs</span>
      </div>
    </div>
  );
}
