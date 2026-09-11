'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import { AddToCalendarButton } from './AddToCalendarButton';
import { useTicketModal } from './TicketModal';

const RECTANGLE_1889 = '/images/rectangle_1889.png';

export function UpcomingEventsSection() {
  const [copiedCard, setCopiedCard] = useState<number | null>(null);
  const { openModal } = useTicketModal();

  const handleShare = (cardIndex: number, slug: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/events/${slug}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedCard(cardIndex);
        setTimeout(() => setCopiedCard(null), 2500);
      });
    }
  };

  return (
    <section className="relative z-10 w-full py-8 sm:py-12 lg:py-14 bg-white overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6">
        
        {/* Header: Title & Subtitle */}
        <div className="relative z-20 text-center max-w-2xl mx-auto space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#2d2d2d] tracking-tight leading-tight">
            Upcoming Events
          </h2>
          <p className="text-[#555555] text-xs xs:text-sm sm:text-[15px] leading-relaxed font-normal max-w-[620px] mx-auto px-2">
            Join us for our upcoming gatherings where business meets community. Enjoy inspiring talks, meaningful connections, and a delightful 3-course Balti meal.
          </p>
        </div>

        {/* Upcoming Event Card: Business Networking Evening */}
        <div className="max-w-[480px] mx-auto w-full">
          <div className="bg-[#FFF9F5] rounded-[24px] sm:rounded-[28px] p-4 xs:p-5 sm:p-6 border border-[#FDEEE3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group">
            <div>
              {/* Clickable Event Poster Image */}
              <Link href="/events/business-networking-evening" className="block relative w-full aspect-[418/532] rounded-[16px] sm:rounded-[20px] overflow-hidden mb-4 sm:mb-5 shadow-sm group-hover:opacity-95 transition-opacity">
                <Image
                  src={RECTANGLE_1889}
                  alt="Business Networking Evening"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Floating Blue Clock Badge matching design */}
                <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0092FF] flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </Link>

              {/* Clickable Event Title */}
              <Link href="/events/business-networking-evening" className="block">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-[#1f1f1f] text-left mb-2 sm:mb-2.5 group-hover:text-[#FF6600] transition-colors">
                  Business Networking Evening
                </h3>
              </Link>

              {/* Meta details row */}
              <div className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-2 text-[11px] xs:text-xs sm:text-[13px] text-[#666666] mb-4 sm:mb-5 text-left font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                  <span>29th September</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                  <span>6:30 pm - 10:30 pm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                  <span>Tipu Sultan, Leicester</span>
                </div>
              </div>
            </div>

            {/* Actions: Buy Now & Add to Calendar */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() =>
                  openModal({
                    title: 'Tuesday 29th September 2026 - Tipu Sultan Leicester',
                    price: '£35.00',
                    eventSlug: 'business-networking-evening',
                  })
                }
                className="flex-1 inline-flex items-center justify-center h-[42px] sm:h-[46px] rounded-[10px] sm:rounded-[12px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-xs xs:text-sm sm:text-[15px] transition-all shadow-[0_4px_14px_rgba(255,102,0,0.25)] hover:scale-[1.02] whitespace-nowrap cursor-pointer"
              >
                Buy Now
              </button>
              <AddToCalendarButton
                title="Business Networking Evening - Chutney & Chat"
                description="Join us for the Chutney & Chat Business Networking Evening! Meet new entrepreneurs, expand your professional network, and enjoy a 3-course Balti meal at Tipu Sultan, Leicester. Keynote Speaker: Sohail Ali. Hosted by Abid Khan."
                location="Tipu Sultan, 18 The Parade, Oadby, Leicester LE2 5BF, United Kingdom"
                startDate="2026-09-29T18:30:00"
                endDate="2026-09-29T22:30:00"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
