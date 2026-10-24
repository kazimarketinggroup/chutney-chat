'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Share2, Check } from 'lucide-react';
import { AddToCalendarButton } from './AddToCalendarButton';
import { useTicketModal } from './TicketModal';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  dateDisplay: string;
  timeDisplay: string;
  venueDisplay: string;
  image: string;
  price: string;
  isSoldOut: boolean;
  aspectClass?: string;
  calendarData?: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
  };
}

const EVENTS: EventItem[] = [
  {
    id: 'bbq',
    slug: 'summer-business-bbq',
    title: 'Summer Business BBQ',
    dateDisplay: '9th September',
    timeDisplay: '6:30 pm - 10:30 pm',
    venueDisplay: 'The Farmhouse, Coventry',
    image: '/images/a9ad7b22ed3d4d370a0f00944e7eb34f1ceeca4c.png',
    price: '£40.00',
    isSoldOut: true,
  },
  {
    id: 'bne',
    slug: 'business-networking-evening',
    title: 'Business Networking Evening',
    dateDisplay: '29th September',
    timeDisplay: '6:30 pm - 10:30 pm',
    venueDisplay: 'Tipu Sultan, Leicester',
    image: '/images/e9179f966d2c35cdda4b95a0de7b932885d891f8.png',
    price: '£35.00',
    isSoldOut: true,
  },
  {
    id: 'awards',
    slug: 'annual-dinner-awards',
    title: 'Annual Dinner & Awards',
    dateDisplay: '9th December',
    timeDisplay: '6:30 pm - 9:30 pm',
    venueDisplay: 'Quaid-E-Azam, Birmingham / TBC',
    image: '/images/annual_dinner_poster_uniform.png',
    price: '£35.00',
    isSoldOut: false,
    calendarData: {
      title: 'Annual Dinner & Awards - Chutney & Chat',
      description: 'Celebrating 11 Years of Award Winning Business Network! Hosted by Abid Khan at Chutney & Chat Annual Dinner & Awards.',
      location: 'Quaid-E-Azam, Birmingham / TBC',
      startDate: '2026-12-09T18:30:00',
      endDate: '2026-12-09T21:30:00',
    },
  },
];

const SOLD_OUT_STAMP = '/images/7b286d6c49c2260ff71f513265849b7a36c05f72.png';

export function UpcomingEventsSection() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const { openModal } = useTicketModal();

  const handleShare = (slug: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/events/${slug}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2500);
      });
    }
  };

  return (
    <section className="relative z-10 w-full py-12 sm:py-16 lg:py-20 bg-white overflow-hidden text-left">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Header: Title & Subtitle */}
        <div className="relative z-20 text-center max-w-2xl mx-auto space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#2d2d2d] tracking-tight leading-tight">
            Our Events
          </h2>
          <p className="text-[#555555] text-xs xs:text-sm sm:text-[15px] leading-relaxed font-normal max-w-[640px] mx-auto px-2">
            Join us for our upcoming gatherings where business meets community. Enjoy inspiring talks, meaningful connections, and a delightful 3-course Balti meal.
          </p>
        </div>

        {/* 3-Card Responsive Grid with identical poster heights & aspect ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#FFF9F5] rounded-[24px] sm:rounded-[28px] p-4 xs:p-5 sm:p-5.5 border border-[#FDEEE3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                {/* Clickable Event Poster Image with Sold Out Stamp (uniform aspect-[271/376]) */}
                <Link
                  href={`/events/${evt.slug}`}
                  className="block relative w-full aspect-[271/376] rounded-[18px] sm:rounded-[22px] overflow-hidden mb-4 sm:mb-5 shadow-sm group-hover:opacity-95 transition-opacity bg-neutral-900"
                >
                  <Image
                    src={evt.image}
                    alt={evt.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority={!evt.isSoldOut}
                  />

                  {/* Sold Out Stamp Overlay */}
                  {evt.isSoldOut && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
                      <div className="relative w-44 sm:w-52 aspect-[332/276] transform -rotate-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300">
                        <Image
                          src={SOLD_OUT_STAMP}
                          alt="Sold Out"
                          fill
                          sizes="240px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </Link>

                {/* Clickable Event Title */}
                <Link href={`/events/${evt.slug}`} className="block">
                  <h3 className="text-lg xs:text-xl font-bold text-[#1f1f1f] text-left mb-2 group-hover:text-[#FF6600] transition-colors leading-snug">
                    {evt.title}
                  </h3>
                </Link>

                {/* Meta details row */}
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs sm:text-[13px] text-[#666666] mb-4 text-left font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                    <span>{evt.dateDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                    <span>{evt.timeDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                    <span className="truncate max-w-[200px]">{evt.venueDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Actions Row */}
              <div className="space-y-2.5 pt-2 border-t border-[#F5E6DC]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#73685E]">
                    Ticket Price: <strong className="text-[#1F1F1F] font-bold">{evt.price}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleShare(evt.slug)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7E72] hover:text-[#FF6600] transition-colors cursor-pointer"
                    title="Share this event"
                  >
                    {copiedSlug === evt.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#22A06B]" />
                        <span className="text-[#22A06B]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 w-full">
                  {evt.isSoldOut ? (
                    <button
                      type="button"
                      disabled
                      className="flex-1 inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[10px] sm:rounded-[12px] bg-[#E8DDD2] text-[#8C7E72] font-bold text-xs sm:text-sm cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          openModal({
                            title: `Wednesday 9th December 2026 - ${evt.title}`,
                            price: evt.price,
                            eventSlug: evt.slug,
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[10px] sm:rounded-[12px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-xs sm:text-sm transition-all shadow-[0_4px_14px_rgba(255,102,0,0.25)] hover:scale-[1.02] cursor-pointer"
                      >
                        Buy Tickets
                      </button>
                      {evt.calendarData && (
                        <AddToCalendarButton
                          title={evt.calendarData.title}
                          description={evt.calendarData.description}
                          location={evt.calendarData.location}
                          startDate={evt.calendarData.startDate}
                          endDate={evt.calendarData.endDate}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
