'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Ticket, Mic, Sparkles, Award } from 'lucide-react';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';
import { AddToCalendarButton } from '@/components/AddToCalendarButton';
import { useTicketModal } from '@/components/TicketModal';

// Image Assets matching Figma node 4173:3167
const AWARDS_HERO_BG = '/images/buy_ticket_hero_bg.png';
const HOST_ABID_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

export default function AnnualDinnerAwardsPage() {
  const { openModal } = useTicketModal();

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Annual Dinner & Awards Header with 4 Feature Cards) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[660px] lg:min-h-[740px] pt-32 pb-16 flex flex-col justify-end bg-[#141414] z-10 text-left">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={AWARDS_HERO_BG}
            alt="Annual Dinner & Awards"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-75 contrast-[1.05]"
            priority
          />
          {/* Ambient Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-black/55 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85 z-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 w-full text-center space-y-6 text-white">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7B3C10]/80 border border-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
            <Award className="w-3.5 h-3.5 text-[#FF6600]" />
            <span>11 Years of Award Winning Business Network</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Annual Dinner &amp; Awards
            </h1>
            <p className="text-white/85 text-base sm:text-lg font-light max-w-2xl mx-auto">
              Celebrating 11 Years of Award Winning Business Network
            </p>
          </div>

          {/* 4 Feature Cards Row matching Figma */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-2 text-left">
            
            {/* Card 1: Date & Time (Golden Amber Brown) */}
            <div className="relative bg-gradient-to-b from-[#944D12] to-[#783908] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10">
              <Calendar className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div className="space-y-0.5">
                <h3 className="text-2xl font-bold text-white leading-none mb-1">9th</h3>
                <p className="text-sm font-semibold text-white/95 leading-tight">December, Wednesday</p>
                <p className="text-xs font-normal text-white/85 mt-1">6:30pm – 9:30pm</p>
              </div>
            </div>

            {/* Card 2: Location (Rich Crimson Red) */}
            <div className="relative bg-gradient-to-b from-[#8C1B1B] to-[#6E0F0F] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10">
              <MapPin className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div>
                <p className="text-xs font-medium text-white/80 mb-0.5">Location</p>
                <h3 className="text-sm font-bold text-white leading-snug">
                  Quaid-E-Azam<br />
                  <span className="font-normal opacity-90 text-xs">Birmingham</span>
                </h3>
              </div>
            </div>

            {/* Card 3: Ticket Price (Dark Golden Amber) */}
            <div
              onClick={() =>
                openModal({
                  title: 'Wednesday 9th December 2026 - Annual Dinner & Awards',
                  price: 'TBC',
                  eventSlug: 'annual-dinner-awards',
                })
              }
              className="relative bg-gradient-to-b from-[#864309] to-[#6B3204] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <Ticket className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5] -rotate-45" />
              <div>
                <p className="text-xs font-medium text-white/90 mb-0.5">Ticket Price</p>
                <h3 className="text-2xl font-extrabold text-white">TBC</h3>
              </div>
            </div>

            {/* Card 4: Host (Dark Glass with Abid Khan Avatar) */}
            <div className="relative bg-black/75 backdrop-blur-md rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/15">
              <Mic className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#FF6600]">
                  <Image
                    src={HOST_ABID_PHOTO}
                    alt="Abid Khan"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-white/70">Hosted by</p>
                  <h4 className="text-sm font-bold text-white leading-tight">Abid Khan</h4>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN DETAILS SECTION (2 Column Card Layout matching Figma design) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-white text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            
            {/* LEFT CARD: Event Flyer & Quick Action Buttons */}
            <div className="bg-[#FFF9F5] rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 border border-[#FDEEE3] shadow-sm flex flex-col justify-between space-y-6">
              
              {/* Event Poster Image (uniform aspect 271/376 matching design) */}
              <div className="relative w-full aspect-[271/376] rounded-[18px] overflow-hidden shadow-sm bg-neutral-900">
                <Image
                  src="/images/chutney_chat_11th_anniversary_gala.png"
                  alt="Annual Dinner & Awards"
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
                  Annual Dinner &amp; Awards
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-[13px] text-[#666666] font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>9th December</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>6:30 pm - 9:30 pm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>Quaid-E-Azam, Birmingham</span>
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      title: 'Wednesday 9th December 2026 - Annual Dinner & Awards',
                      price: 'TBC',
                      eventSlug: 'annual-dinner-awards',
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center h-[46px] rounded-[10px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-sm text-center shadow-[0px_4px_14px_rgba(255,102,0,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Buy Tickets
                </button>
                <AddToCalendarButton
                  title="Annual Dinner & Awards - Chutney & Chat"
                  description="Celebrating 11 Years of Award Winning Business Network! Hosted by Abid Khan at Chutney & Chat Annual Dinner & Awards."
                  location="Quaid-E-Azam, Birmingham"
                  startDate="2026-12-09T18:30:00"
                  endDate="2026-12-09T21:30:00"
                />
              </div>

            </div>

            {/* RIGHT CARD: Detailed Information Box matching Figma design */}
            <div className="bg-[#F8F8F9] rounded-[24px] sm:rounded-[28px] p-6 sm:p-9 border border-[#EBEBEB] shadow-sm flex flex-col justify-between space-y-8">
              
              <div className="space-y-7">
                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <span className="inline-block bg-[#FF6600] text-white font-bold text-xs px-7 py-2.5 rounded-[8px] shadow-sm">
                      Details
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-[28px] font-bold text-[#1f1f1f] leading-snug">
                    Annual Dinner &amp; Awards
                  </h2>

                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal">
                    Celebrating 11 Years of Award Winning Business Network
                  </p>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#666666] font-medium">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#888888] shrink-0" />
                      <span>9th December 2026</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#888888] shrink-0" />
                      <span>6:30 pm - 9:30 pm</span>
                    </div>
                  </div>
                </div>

                {/* Organiser Section */}
                <div className="space-y-3">
                  <div>
                    <span className="inline-block bg-[#FF6600] text-white font-bold text-xs px-7 py-2.5 rounded-[8px] shadow-sm">
                      Organiser
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#444444] pt-0.5">
                    Abid Khan
                  </p>
                </div>

                {/* Venue Section */}
                <div className="space-y-3">
                  <div>
                    <span className="inline-block bg-[#FF6600] text-white font-bold text-xs px-7 py-2.5 rounded-[8px] shadow-sm">
                      Venue
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal space-y-0.5">
                    <p className="font-semibold text-[#1f1f1f]">Quaid-E-Azam</p>
                    <p>Birmingham</p>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="space-y-2.5 pt-4 text-xs sm:text-sm font-medium">
                <div>
                  <a
                    href="https://maps.google.com/?q=Quaid-E-Azam+Birmingham"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6600] underline hover:text-[#e55c00] transition-colors"
                  >
                    Google Map
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-[#666666] underline hover:text-black transition-colors"
                  >
                    View Venue Website
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative w-full text-white pt-12 sm:pt-16 pb-10 overflow-hidden bg-[#0A0B0E]">
        <div className="absolute inset-0 z-0">
          <Image src={FOOTER_WAVE_BG} alt="" fill sizes="100vw" className="object-cover object-center" />
        </div>

        <div className="relative z-10 max-w-[1170px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Book into an event Today.
            </h2>
            <p className="text-white/80 text-xs sm:text-[15px] font-light leading-relaxed">
              Unfortunately we have a limited number of seats at our events so have to work on a &apos;first come-first served&apos; basis.
            </p>
            <div>
              <Link
                href="/buy-ticket"
                className="inline-flex items-center justify-center h-[46px] px-8 rounded-md bg-[#EE6422] hover:bg-[#d65316] text-white font-bold text-sm sm:text-base transition-all shadow-[0px_4px_25px_rgba(238,100,34,0.6)] hover:scale-105"
              >
                Buy Tickets
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/">
              <div className="relative w-[180px] h-[48px]">
                <Image src={LOGO_REF} alt="Chutney & Chat" fill sizes="256px" className="object-contain object-left" />
              </div>
            </Link>

            <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/90">
              <Link href="/about" className="hover:text-[#FF6600] transition-colors">About</Link>
              <Link href="/events" className="hover:text-[#FF6600] transition-colors">Events</Link>
              <Link href="/speakers" className="hover:text-[#FF6600] transition-colors">Speakers</Link>
              <Link href="/ambassadors" className="hover:text-[#FF6600] transition-colors">Ambassador</Link>
              <Link href="/contact" className="hover:text-[#FF6600] transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
            <p>Copyright © Chutney&amp;Chat | All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
