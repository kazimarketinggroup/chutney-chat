'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink, Download } from 'lucide-react';

interface EventCalendarProps {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO date string e.g. "2026-09-09T18:30:00"
  endDate: string;   // ISO date string e.g. "2026-09-09T21:30:00"
  buttonClassName?: string;
}

export function AddToCalendarButton({
  title,
  description,
  location,
  startDate,
  endDate,
  buttonClassName,
}: EventCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date to YYYYMMDDTHHmmssZ format required by Google Calendar URL template
  const formatForGoogle = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const googleStart = formatForGoogle(startDate);
  const googleEnd = formatForGoogle(endDate);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${googleStart}/${googleEnd}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Chutney and Chat//Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${googleStart}`,
      `DTEND:${googleEnd}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left flex-1" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          "w-full inline-flex items-center justify-center gap-1.5 h-[42px] sm:h-[46px] rounded-[10px] sm:rounded-[12px] bg-white border border-[#EBEBEB] text-[#2d2d2d] font-bold text-xs xs:text-sm sm:text-[15px] hover:bg-neutral-50 hover:border-[#FF6600]/40 transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
        }
      >
        <span>Add to Calendar</span>
        <ChevronDown className={`w-4 h-4 text-[#777] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-56 rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-[#FFF9F5] text-left transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center shrink-0 group-hover:bg-[#4285F4] group-hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-15V8.25h15v11.25zm-15-12.75V4.5h3V6h1.5V4.5h6V6h1.5V4.5h3v2.25h-15z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-[#1f1f1f] group-hover:text-[#FF6600] flex items-center gap-1">
                <span>Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </div>
              <p className="text-[10px] text-[#777]">Set date &amp; location auto</p>
            </div>
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-[#FFF9F5] text-left transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF6600]/10 text-[#FF6600] flex items-center justify-center shrink-0 group-hover:bg-[#FF6600] group-hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1f1f1f] group-hover:text-[#FF6600]">
                Apple / Outlook (.ics)
              </div>
              <p className="text-[10px] text-[#777]">Download calendar file</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
