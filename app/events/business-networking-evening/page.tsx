'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Ticket, Mic } from 'lucide-react';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';
import { AddToCalendarButton } from '@/components/AddToCalendarButton';
import { useTicketModal } from '@/components/TicketModal';

// Image Assets
const LEICESTER_HERO_BG = '/images/Upcimign_event_bg.png';
const LEICESTER_POSTER = '/images/rectangle_1889.png';
const HOST_ABID_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';
const SPEAKER_SOHAIL_PHOTO = '/images/sohail_ali.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

export default function BusinessNetworkingEveningPage() {
  const { openModal } = useTicketModal();
  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Tipu Sultan Leicester background with 5 feature cards) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[640px] lg:min-h-[720px] pt-32 pb-16 flex flex-col justify-end bg-[#141414] z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={LEICESTER_HERO_BG}
            alt="Business Networking Evening"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-90 contrast-[1.05]"
            priority
          />
          {/* Ambient Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-black/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80 z-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 w-full text-center space-y-6 text-white">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7B3C10]/80 border border-white/15 backdrop-blur-md text-white text-xs font-light">
            <span>Informal</span>
            <span>|</span>
            <span>Educational</span>
            <span>|</span>
            <span>Connection</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Business Networking Evening
          </h1>

          {/* 5 Feature Cards Row matching exact design screenshot 2 & 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-2 text-left">
            
            {/* Card 1: Date & Time (Golden Amber Brown) */}
            <div className="relative bg-gradient-to-b from-[#944D12] to-[#783908] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10">
              <Calendar className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div className="space-y-0.5">
                <h3 className="text-2xl font-bold text-white leading-none mb-1">29th</h3>
                <p className="text-sm font-semibold text-white/95 leading-tight">September, Tuesday</p>
                <p className="text-xs font-normal text-white/85 mt-1">6:30pm – 10:30pm</p>
              </div>
            </div>

            {/* Card 2: Location (Rich Crimson Red) */}
            <div className="relative bg-gradient-to-b from-[#8C1B1B] to-[#6E0F0F] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10">
              <MapPin className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  Tipu Sultan<br />18 The Parade, Oadby,<br />Leicester LE2 5BF
                </h3>
              </div>
            </div>

            {/* Card 3: Ticket Price (Dark Golden Amber) */}
            <div className="relative bg-gradient-to-b from-[#864309] to-[#6B3204] rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/10">
              <Ticket className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5] -rotate-45" />
              <div>
                <p className="text-xs font-medium text-white/90 mb-0.5">Ticket Price</p>
                <h3 className="text-xl font-extrabold text-white">£35.00</h3>
              </div>
            </div>

            {/* Card 4: Host (Dark Glass with Abid Khan Avatar) */}
            <div className="relative bg-black/75 backdrop-blur-md rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/15">
              <Mic className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/25">
                  <Image
                    src={HOST_ABID_PHOTO}
                    alt="Abid Khan"
                    fill
                sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-white/70 font-normal">Hosted by</p>
                  <h3 className="text-sm font-bold text-white">Abid Khan</h3>
                </div>
              </div>
            </div>

            {/* Card 5: Keynote Speaker (Dark Glass with Sohail Ali Avatar) */}
            <div className="relative bg-black/75 backdrop-blur-md rounded-[24px] p-5 min-h-[160px] flex flex-col justify-end shadow-xl border border-white/15">
              <Mic className="absolute top-5 right-5 w-6 h-6 text-white/80 stroke-[1.5]" />
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/25">
                  <Image
                    src={SPEAKER_SOHAIL_PHOTO}
                    alt="Sohail Ali"
                    fill
                sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-white/70 font-normal">Keynote Speaker</p>
                  <h3 className="text-sm font-bold text-white">Sohail Ali</h3>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN DETAILS SECTION (2 Column Card Layout matching screenshots 2 & 3) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-white text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            
            {/* LEFT CARD: Event Flyer & Quick Action Buttons */}
            <div className="bg-[#FFF9F5] rounded-[24px] p-6 sm:p-8 border border-[#FDEEE3] shadow-sm flex flex-col justify-between space-y-6">
              
              {/* Event Poster Image */}
              <div className="relative w-full aspect-[418/532] rounded-[18px] overflow-hidden shadow-sm">
                <Image
                  src={LEICESTER_POSTER}
                  alt="Business Networking Evening"
                  fill
                sizes="100vw"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
                  Business Networking Evening
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-[13px] text-[#666666] font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>29th September</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>6:30 pm - 10:30 pm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#888888] shrink-0" />
                    <span>Tipu Sultan</span>
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      title: 'Tuesday 29th September 2026 - Tipu Sultan Leicester',
                      price: '£35.00',
                      eventSlug: 'business-networking-evening',
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center h-[46px] rounded-[10px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-sm transition-all shadow-sm text-center cursor-pointer"
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

            {/* RIGHT CARD: Detailed Information Box matching Image 2 reference design */}
            <div className="bg-[#F8F8F9] rounded-[24px] sm:rounded-[28px] p-6 sm:p-9 border border-[#EBEBEB] shadow-sm flex flex-col space-y-8">
              
              <div className="space-y-7">
                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <span className="inline-block bg-[#FF6600] text-white font-bold text-xs px-7 py-2.5 rounded-[8px] shadow-sm">
                      Details
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-[28px] font-bold text-[#1f1f1f] leading-snug">
                    Business Networking Evening
                  </h2>

                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal">
                    Chutney and Chat evening event at the <br className="hidden sm:block" />
                    Tipu Sultan, Leicester.
                  </p>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#666666] font-medium">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#888888] shrink-0" />
                      <span>Tuesday 29th September 2026</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#888888] shrink-0" />
                      <span>6:30 pm - 10:30 pm</span>
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

                {/* Venue Section matching user screenshot exact text */}
                <div className="space-y-3">
                  <div>
                    <span className="inline-block bg-[#FF6600] text-white font-bold text-xs px-7 py-2.5 rounded-[8px] shadow-sm">
                      Venue
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal space-y-0.5">
                    <p>The Farmhouse, Coventry CV5 6HB215</p>
                    <p>Beechwood Avenue</p>
                    <p>Coventry, West Midlands CV5 6HB United</p>
                    <p>Kingdom</p>
                  </div>
                </div>
              </div>

              {/* External Links matching Image 2 */}
              <div className="space-y-2.5 pt-4 text-xs sm:text-sm font-medium">
                <div>
                  <a
                    href="https://maps.google.com/?q=Tipu+Sultan+18+The+Parade+Oadby+Leicester+LE2+5BF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6600] underline hover:text-[#e55c00] transition-colors"
                  >
                    Google Map
                  </a>
                </div>
                <div>
                  <a
                    href="https://tipu-sultan.com"
                    target="_blank"
                    rel="noopener noreferrer"
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
      {/* 3. SITE-WIDE FOOTER SECTION */}
      {/* ========================================================================= */}
      <footer className="relative w-full text-white pt-12 sm:pt-16 lg:pt-20 pb-10 overflow-hidden bg-[#0A0B0E]">
        {/* Footer Background from assets/footer bg.png */}
        <div className="absolute inset-0 z-0">
          <Image src={FOOTER_WAVE_BG} alt="" fill
                sizes="100vw" className="object-cover object-center" />
        </div>

        <div className="relative z-10 max-w-[1170px] mx-auto px-6 space-y-16">
          {/* Top Registration CTA Box */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-tight">
              Book into an event Today.
            </h2>
            <p className="text-white/80 text-xs sm:text-[15px] leading-relaxed font-light">
              Unfortunately we have a limited number of seats at our events so have to work on a &apos;first come-first served&apos; basis. So book in as early as you can!
            </p>
            <div>
              <Link
                href="/buy-ticket"
                className="inline-flex items-center justify-center h-[46px] px-8 rounded-md bg-[#EE6422] hover:bg-[#d65316] text-white font-bold text-sm sm:text-base transition-all shadow-[0px_4px_25px_rgba(238,100,34,0.6)] hover:shadow-[0px_4px_35px_rgba(238,100,34,0.8)] hover:scale-105"
              >
                Buy Tickets
              </Link>
            </div>
          </div>

          {/* Footer Navigation Bar */}
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/">
              <div className="relative w-[180px] h-[48px]">
                <Image src={LOGO_REF} alt="Chutney & Chat" fill
                sizes="256px" className="object-contain object-left" />
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm font-medium text-white/90">
              <Link href="/about" className="hover:text-[#FF6600] transition-colors">About</Link>
              <Link href="/events" className="hover:text-[#FF6600] transition-colors">Events</Link>
              <Link href="/speakers" className="hover:text-[#FF6600] transition-colors">Speakers</Link>
              <Link href="/ambassadors" className="hover:text-[#FF6600] transition-colors">Ambassador</Link>
              <Link href="/contact" className="hover:text-[#FF6600] transition-colors">Contact</Link>
            </nav>

            {/* Social Icons — Clean uniform dark circles with orange highlight only on hover */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/groups/891724367615699"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e]/60 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Facebook Group"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/groups/8243224/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e]/60 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="LinkedIn Group"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/pathway2grow/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e]/60 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Pathway2Grow"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e]/60 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="YouTube"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Flickr */}
              <a
                href="https://www.flickr.com/photos/pathway2grow/albums/with/72177720329935642"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e]/60 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Flickr Albums"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="7" cy="12" r="5" />
                  <circle cx="17" cy="12" r="5" className="opacity-80" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Copyright */}
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
