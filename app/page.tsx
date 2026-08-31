'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { figmaImages } from '@/lib/images';
import { MapPin, Calendar, Mic, Users, Clock, Utensils, TrendingUp, Compass, ArrowRight, Ticket } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { EventCountdown } from '@/components/EventCountdown';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';
import { EventLocationsSection } from '@/components/EventLocationsSection';
import { useTicketModal } from '@/components/TicketModal';

// Exact Figma Image Fills
const FOUNDER_BG_VECTOR = '/images/meet_founder_bg.png';
const HERO_BG = '/images/homepage_hero_image.png';
const WAVE_OVERLAY = figmaImages['927fa453e7029d1a4a5a716e698d71902bfb4c10'] || '/images/927fa453e7029d1a4a5a716e698d71902bfb4c10.png';
const BEIGE_WAVE_BG = figmaImages['e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae'] || '/images/e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae.png';
const UPCOMING_ROOM_BG = figmaImages['e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae'] || '/images/e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae.png';
const UPCOMING_SECTION_BG = '/images/Group_1000002628.png';
const UPCOMING_OVERLAY_BG = '/images/upcoming_overlay.png';
const IPHONE_MOCKUP = '/images/iphone_mockup.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';
const FARMHOUSE_LIONS_PHOTO = '/images/farmhouse_lions.png';
const P2G_LOGO = '/images/p2g_logo.png';
const HIGHFIELD_LOGO = '/images/highfield_logo.png';

// Founder Photos
const SAFARAZ_ALI_PHOTO = '/images/sarfazali.png';
const ABID_KHAN_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';

// Bento Photos
const bentoPhoto1 = figmaImages['d069ee62920d8783d8947d86ae64a1b5daf23d3d'];
const bentoPhoto2 = figmaImages['d429b23081ff07fc437228a978c52d1cf30c0da3'];
const bentoPhoto3 = figmaImages['e0ca65afea9a013b8233495d9de0eec17623019c'];
const bentoPhoto4 = figmaImages['fcc749b80afff0d9e4ca95f6811f6ee1f953834f'];
const bentoPhoto5 = figmaImages['b592777c93b636b181a4ebb8bc13754deb4a1146'];
const bentoPhoto6 = figmaImages['186fd82678e286331e2fa3055b1903f2344dfa00'];
const bentoPhoto7 = figmaImages['5522375eecad2c0e2788bd42ed30de094fb88e5e'];
const bentoPhoto8 = figmaImages['4b82baeb51ae2263efe59b0c7fea9610c8f15187'];

export default function HomePage() {
  const { openModal } = useTicketModal();

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dark background with ambient light & spiral wave overlay) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[820px] lg:h-[860px] pt-28 pb-12 flex flex-col justify-between bg-[#1e1e1e] z-10 overflow-hidden">
        {/* Base Photo Background with Ambient Lighting Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Chutney & Chat Networking"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-100 contrast-[1.02]"
            priority
          />

          {/* Lighter Soft Dark Overlay Gradient so background photo is clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />
        </div>

        {/* Hero Main Header & Subtitle Grid */}
        <div className="relative z-20 max-w-[1340px] w-full mx-auto px-6 pt-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-5 py-2 rounded-full bg-[#834217]/75 border border-white/25 text-white font-light text-sm sm:text-base backdrop-blur-md shadow-md">
                  Informal | Educational | Connection
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                Chutney &amp; Chat
              </h1>

              <div className="space-y-1 text-white/90 text-base sm:text-lg font-light">
                <p>Next Event: Wednesday 9th September 2026</p>
                <p>at The Farmhouse Coventry</p>
                <p>6:30pm - 9:30pm</p>
              </div>

              {/* Live Countdown Timer */}
              <EventCountdown targetDate="2026-09-09T18:30:00" />

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      title: 'Wednesday 9th September 2026 - The Farmhouse Coventry',
                      price: '£40.00',
                      eventSlug: 'summer-business-bbq',
                    })
                  }
                  className="inline-flex items-center justify-center h-[44px] px-8 rounded-md bg-white text-[#2d2d2d] font-bold text-[15px] hover:bg-neutral-100 transition-all shadow-md hover:scale-105 cursor-pointer"
                >
                  Buy Tickets
                </button>
              </div>
            </div>

            {/* Right Column Description */}
            <div className="lg:col-span-5 lg:text-right">
              <p className="text-white/95 text-base sm:text-[17px] leading-relaxed max-w-[500px] lg:ml-auto font-light drop-shadow-sm">
                Our events are about social, business, and of course, the Balti, with a delicious 3-course meal served throughout the evening.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO STATISTICS BAR — Inside bottom of Hero image section with gradient border */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full max-w-[1340px] mx-auto px-6 mt-12 mb-4">
          <div className="bg-black/50 backdrop-blur-md border-[1.5px] border-[#D87D38]/80 rounded-[20px] py-6 px-6 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(216,125,56,0.15)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-white/20">
              {/* Stat 1: 3 Event Locations */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  {/* Top Left Pin */}
                  <path d="M7 2a3 3 0 0 0-3 3c0 2.5 3 6.5 3 6.5s3-4 3-6.5A3 3 0 0 0 7 2z" />
                  <circle cx="7" cy="5" r="1" />
                  {/* Bottom Right Pin */}
                  <path d="M17 10a3 3 0 0 0-3 3c0 2.5 3 6.5 3 6.5s3-4 3-6.5A3 3 0 0 0 17 10z" />
                  <circle cx="17" cy="13" r="1" />
                  {/* Dashed Route Path */}
                  <path d="M7 11.5v3.5a3 3 0 0 0 3 3h3.5" strokeDasharray="2 2" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">3</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Event Location</span>
                </div>
              </div>

              {/* Stat 2: 1 Event Per Month (Drama Masks Icon) */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  {/* Front Mask (Comedy) */}
                  <path d="M2 13c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7-7-3.13-7-7z" />
                  <circle cx="6.5" cy="11" r="0.75" fill="white" />
                  <circle cx="11.5" cy="11" r="0.75" fill="white" />
                  <path d="M6.5 15c1 1.2 4 1.2 5 0" />
                  {/* Back Mask (Tragedy) */}
                  <path d="M13.5 6C15.8 4.7 18.5 5 20.2 6.7c2.1 2.1 2.1 5.5 0 7.6-1.2 1.2-2.8 1.8-4.4 1.7" />
                  <circle cx="17.5" cy="9" r="0.75" fill="white" />
                  <path d="M16 12c1-.8 2.5-.8 3.5 0" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">1</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Event Per Month</span>
                </div>
              </div>

              {/* Stat 3: 16 Great Speakers */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">16</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Great Speakers</span>
                </div>
              </div>

              {/* Stat 4: 3000+ Attendees Over 6 years */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">3000+</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Attendees Over 6 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. FROM CHUTNEY TO CHAT SECTION — Left-aligned White Card with Orange Accent Border */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
          <div className="bg-white border-2 border-[#FF5500]/80 rounded-[24px] p-8 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.06)] space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] tracking-tight leading-tight">
              From Chutney to Chat,<br /> Where Conversations Get Spicy!
            </h2>

            <p className="text-[#555555] text-base sm:text-[16px] leading-[1.8] font-normal max-w-[1100px]">
              A 'no pressure' and relaxed environment with networking engagement and conversation between friends. On the other hand, you may just want to listen to the speakers; we carefully select our keynote speakers to ensure we deliver value every time. Join us, be part of the family Chutney and Chat – Award-winning Business Networking at its Best! See you there.
            </p>

            <p className="text-[#2d2d2d] font-extrabold text-base sm:text-[17px] pt-1">
              Abid Khan | Co-founder of Chutney &amp; Chat.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center justify-center h-[44px] px-8 rounded-md bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-[15px] transition-all shadow-[0px_6px_20px_rgba(255,102,0,0.3)] hover:scale-105"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WRAPPER: Vector wave BG spanning bento → founders → events */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-white overflow-hidden">
        {/* Vector wave background — Figma: X:-573 Y:1339 W:2071 H:868 — behind Meet the Founders */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute"
            style={{
              width: '105%',
              left: '-5%',
              top: '32%',
              transform: 'translateY(-25%)',
            }}
          >
            <Image
              src={FOUNDER_BG_VECTOR}
              alt=""
              width={2071}
              height={868}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* 3. MOSAIC PHOTO & ICON BENTO GRID SECTION (Figma Group 1000002581) */}
        <section className="relative z-10 py-10 lg:py-14">
          <div className="max-w-[1170px] mx-auto px-4">

            {/* Desktop / Tablet Exact Figma Group 1000002581 Layout (1166px x 389px) */}
            <div className="relative w-full hidden sm:block" style={{ aspectRatio: '1166 / 389' }}>

              {/* Row 1 */}
              {/* Item 1: Food Balti photo [0,0] 285x122 */}
              <div className="absolute left-[0%] top-[0%] w-[24.44%] h-[31.36%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/d069ee62920d8783d8947d86ae64a1b5daf23d3d.png"
                  alt="Balti Food Dish"
                  fill
                sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Item 2: Calendar Icon Card [295,0] 282x122 */}
              <div className="absolute left-[25.30%] top-[0%] w-[24.18%] h-[31.36%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-6 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-12 h-12">
                  <Image src="/images/icon_4039_18485.svg" alt="Calendar Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>

              {/* Item 3: 3 Men Talking [587,0] 137x123 */}
              <div className="absolute left-[50.34%] top-[0%] w-[11.75%] h-[31.62%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/e0ca65afea9a013b8233495d9de0eec17623019c.png"
                  alt="Networking Guests"
                  fill
                sizes="(max-width: 768px) 50vw, 256px"
                  className="object-cover object-top"
                />
              </div>

              {/* Item 4: Party Popper Icon Card [734,0] 137x122 */}
              <div className="absolute left-[62.95%] top-[0%] w-[11.75%] h-[31.36%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-2 sm:p-2.5 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-full h-full max-w-[80px] max-h-[85px]">
                  <Image src="/images/icon_popper.svg" alt="Party Popper Icon" fill
                sizes="128px" className="object-contain" />
                </div>
              </div>

              {/* Item 5: 4 Men Cutting Cake [881,0] 138x123 */}
              <div className="absolute left-[75.55%] top-[0%] w-[11.83%] h-[31.62%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/b592777c93b636b181a4ebb8bc13754deb4a1146.png"
                  alt="Cake Cutting"
                  fill
                sizes="(max-width: 768px) 50vw, 256px"
                  className="object-cover object-top"
                />
              </div>

              {/* Item 6: Rocket/Chart Icon Card (Tall Spanning 2 Rows) [1029,0] 137x254 */}
              <div className="absolute left-[88.25%] top-[0%] w-[11.75%] h-[65.30%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-6 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-12 h-16">
                  <Image src="/images/icon_4039_18501.svg" alt="Growth Rocket Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>

              {/* Row 2 */}
              {/* Item 7: Location Pin Icon Card [0,132] 284x123 */}
              <div className="absolute left-[0%] top-[33.93%] w-[24.35%] h-[31.62%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-6 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-12 h-12">
                  <Image src="/images/icon_4039_18481.svg" alt="Location Pin Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>

              {/* Item 8: Speaker Presentation [294,132] 283x122 */}
              <div className="absolute left-[25.21%] top-[33.93%] w-[24.27%] h-[31.36%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/d429b23081ff07fc437228a978c52d1cf30c0da3.png"
                  alt="Stage Presentation"
                  fill
                sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />
              </div>

              {/* Item 9: Abid Khan Keynote Stage [587,132] 432x123 */}
              <div className="absolute left-[50.34%] top-[33.93%] w-[37.05%] h-[31.62%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/fcc749b80afff0d9e4ca95f6811f6ee1f953834f.png"
                  alt="Abid Khan Keynote"
                  fill
                sizes="(max-width: 768px) 50vw, 640px"
                  className="object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />
              </div>

              {/* Row 3 */}
              {/* Item 10: 3 Ladies Photo [0,266] 138x123 */}
              <div className="absolute left-[0%] top-[68.38%] w-[11.83%] h-[31.62%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/186fd82678e286331e2fa3055b1903f2344dfa00.png"
                  alt="Guests 3 Ladies"
                  fill
                sizes="(max-width: 768px) 50vw, 256px"
                  className="object-cover object-top"
                />
              </div>

              {/* Item 11: Speaker Mic Photo [148,266] 137x122 */}
              <div className="absolute left-[12.69%] top-[68.38%] w-[11.75%] h-[31.36%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/5522375eecad2c0e2788bd42ed30de094fb88e5e.png"
                  alt="Speaker Mic"
                  fill
                sizes="(max-width: 768px) 50vw, 256px"
                  className="object-cover object-top"
                />
              </div>

              {/* Item 12: Clock Icon Card [295,265] 429x122 */}
              <div className="absolute left-[25.30%] top-[68.12%] w-[36.79%] h-[31.36%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-6 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-12 h-12">
                  <Image src="/images/icon_4039_18498.svg" alt="Clock Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>

              {/* Item 13: Abid Khan Smiling Photo [734,266] 137x122 */}
              <div className="absolute left-[62.95%] top-[68.38%] w-[11.75%] h-[31.36%] rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/4b82baeb51ae2263efe59b0c7fea9610c8f15187.png"
                  alt="Abid Khan Host"
                  fill
                sizes="(max-width: 768px) 50vw, 256px"
                  className="object-cover object-top"
                />
              </div>

              {/* Item 14: Cutlery/Heart Icon Card [884,266] 282x122 */}
              <div className="absolute left-[75.81%] top-[68.38%] w-[24.18%] h-[31.36%] bg-[#F6F6F6] rounded-[20px] flex items-center justify-center p-6 border border-[#EAEAEA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300">
                <div className="relative w-12 h-12">
                  <Image src="/images/icon_4039_18504.svg" alt="Cutlery Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>

            </div>

            {/* Mobile Fallback Layout (2-Column Grid) */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              <div className="h-[120px] relative rounded-[20px] overflow-hidden shadow-sm">
                <Image src="/images/d069ee62920d8783d8947d86ae64a1b5daf23d3d.png" alt="Food" fill
                sizes="(max-width: 768px) 50vw, 320px" className="object-cover object-center" />
              </div>
              <div className="h-[120px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[20px] flex items-center justify-center p-4">
                <div className="relative w-10 h-10">
                  <Image src="/images/icon_4039_18485.svg" alt="Calendar Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>
              <div className="h-[120px] relative rounded-[20px] overflow-hidden shadow-sm">
                <Image src="/images/d429b23081ff07fc437228a978c52d1cf30c0da3.png" alt="Speaker Presentation" fill
                sizes="(max-width: 768px) 50vw, 320px" className="object-cover" style={{ objectPosition: 'center 25%' }} />
              </div>
              <div className="h-[120px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[20px] flex items-center justify-center p-4">
                <div className="relative w-10 h-10">
                  <Image src="/images/icon_4039_18481.svg" alt="Location Pin" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>
              <div className="col-span-2 h-[130px] relative rounded-[20px] overflow-hidden shadow-sm">
                <Image src="/images/fcc749b80afff0d9e4ca95f6811f6ee1f953834f.png" alt="Abid Khan Keynote" fill
                sizes="(max-width: 768px) 50vw, 320px" className="object-cover" style={{ objectPosition: 'center 25%' }} />
              </div>
              <div className="h-[120px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[20px] flex items-center justify-center p-4">
                <div className="relative w-10 h-10">
                  <Image src="/images/icon_4039_18498.svg" alt="Clock Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>
              <div className="h-[120px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[20px] flex items-center justify-center p-4">
                <div className="relative w-10 h-10">
                  <Image src="/images/icon_4039_18504.svg" alt="Cutlery Icon" fill
                sizes="64px" className="object-contain" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MEET THE FOUNDERS SECTION — Mobile & Desktop Responsive Design */}
        {/* ========================================================================= */}
        <div className="relative w-full pt-16 pb-8 lg:pt-24 lg:pb-12">

          <section className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 mb-16 lg:mb-24">
            
            {/* ------------------------------------------------------------- */}
            {/* MOBILE LAYOUT (Clean, paired cards with Safaraz Ali first)     */}
            {/* ------------------------------------------------------------- */}
            {/* MOBILE / TABLET LAYOUT (Abid Khan above Safaraz Ali)          */}
            {/* ------------------------------------------------------------- */}
            <div className="block lg:hidden space-y-10 text-center">
              {/* Header */}
              <div className="space-y-3 max-w-[480px] mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] leading-tight tracking-tight">
                  Meet the founders
                </h2>
                <p className="text-[#555555] text-xs sm:text-sm leading-relaxed font-normal">
                  Get to know the passionate team dedicated to creating unforgettable networking experiences, bringing people together over business, Balti, and conversation
                </p>
              </div>

              {/* Founder 1 (Mobile top): Abid Khan */}
              <div className="space-y-4 max-w-[360px] mx-auto text-left">
                <Link href="/speakers/abid-khan" className="relative block h-[380px] sm:h-[440px] rounded-[24px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] group">
                  <Image
                    src={ABID_KHAN_PHOTO}
                    alt="Abid Khan"
                    fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </Link>
                <div className="pt-2">
                  <div className="border-b-[1.5px] border-[#2d2d2d] pb-1.5 mb-2 inline-block">
                    <h3 className="text-xl font-bold text-[#2d2d2d] leading-none">
                      Abid Khan
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#666666]">
                    Chutney &amp; Chat Co-Founder
                  </p>
                  <Link href="/speakers/abid-khan" className="text-xs font-bold text-[#2d2d2d] hover:text-black mt-3 block">
                    Read More
                  </Link>
                </div>
              </div>

              {/* Founder 2 (Mobile under): Safaraz Ali */}
              <div className="space-y-4 max-w-[360px] mx-auto text-left">
                <Link href="/speakers/safaraz-ali" className="relative block h-[380px] sm:h-[440px] rounded-[24px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] group">
                  <Image
                    src={SAFARAZ_ALI_PHOTO}
                    alt="Safaraz Ali"
                    fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </Link>
                <div className="pt-2">
                  <div className="border-b-[1.5px] border-[#2d2d2d] pb-1.5 mb-2 inline-block">
                    <h3 className="text-xl font-bold text-[#2d2d2d] leading-none">
                      Safaraz Ali
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#666666]">
                    Chutney &amp; Chat Co-Founder
                  </p>
                  <Link href="/speakers/safaraz-ali" className="text-xs font-bold text-[#2d2d2d] hover:text-black mt-3 block">
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* DESKTOP LAYOUT (Exact 3-Column Grid)                           */}
            {/* ------------------------------------------------------------- */}
            <div className="hidden lg:grid grid-cols-[300px_1fr_300px] xl:grid-cols-[340px_1fr_340px] items-stretch gap-6 lg:gap-10">

              {/* LEFT: Abid Khan — photo card */}
              <Link href="/speakers/abid-khan" className="relative block h-full min-h-[480px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] group">
                <Image
                  src={ABID_KHAN_PHOTO}
                  alt="Abid Khan"
                  fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
              </Link>

              {/* CENTER: Heading, Description, and Founder Names at bottom */}
              <div className="flex flex-col items-center justify-center text-center px-0 py-6 lg:py-10">
                {/* Heading */}
                <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#2d2d2d] leading-tight tracking-tight mb-3 sm:mb-5">
                  Meet the founders
                </h2>
                {/* Description */}
                <p className="text-[#555555] text-xs sm:text-[15px] leading-relaxed font-normal max-w-[480px]">
                  Get to know the passionate team dedicated to creating unforgettable networking experiences, bringing people together over business, Balti, and conversation
                </p>

                {/* Bottom Row: Abid Khan name (left) — Safaraz Ali name (right) */}
                <div className="w-full flex items-start justify-between mt-auto pt-8 sm:pt-16 lg:pt-20 gap-6 sm:gap-8">
                  
                  {/* Abid Khan - Left aligned block */}
                  <div className="text-left flex flex-col items-start">
                    <div className="border-b-[1.5px] border-[#2d2d2d] pb-1.5 mb-2.5">
                      <h3 className="text-base sm:text-[22px] font-bold text-[#2d2d2d] leading-none">
                        Abid Khan
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[14px] font-normal text-[#666666]">
                      Chutney &amp; Chat Co-Founder
                    </p>
                    <Link href="/speakers/abid-khan" className="text-xs sm:text-[14px] font-bold text-[#2d2d2d] hover:text-black mt-3 sm:mt-6 inline-block">
                      Read More
                    </Link>
                  </div>

                  {/* Safaraz Ali - Right aligned block */}
                  <div className="text-right flex flex-col items-end">
                    <div className="border-b-[1.5px] border-[#2d2d2d] pb-1.5 mb-2.5 inline-block">
                      <h3 className="text-base sm:text-[22px] font-bold text-[#2d2d2d] leading-none">
                        Safaraz Ali
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[14px] font-normal text-[#666666]">
                      Chutney &amp; Chat Co-Founder
                    </p>
                    <Link href="/speakers/safaraz-ali" className="text-xs sm:text-[14px] font-bold text-[#2d2d2d] hover:text-black mt-3 inline-block">
                      Read More
                    </Link>
                  </div>

                </div>
              </div>

              {/* RIGHT: Safaraz Ali — photo card */}
              <Link href="/speakers/safaraz-ali" className="relative block h-full min-h-[480px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] group">
                <Image
                  src={SAFARAZ_ALI_PHOTO}
                  alt="Safaraz Ali"
                  fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
              </Link>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* 5. UPCOMING EVENTS SECTION — New 2-Card Grid Design */}
          {/* ========================================================================= */}
          <UpcomingEventsSection />

          {/* ========================================================================= */}
          {/* 5B. EVENT LOCATIONS SECTION */}
          {/* ========================================================================= */}
          <EventLocationsSection />
        </div>
      </div>{/* END: Vector wave BG wrapper */}

      {/* ========================================================================= */}
      {/* 6. REGISTRATION CTA BANNER & DARK FOOTER SECTION */}
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

          {/* Bottom Copyright & Legal Links */}
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
