'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';
import { EventCountdown } from '@/components/EventCountdown';
import { Calendar, MapPin, Lightbulb, LayoutGrid, TrendingUp } from 'lucide-react';

// Exact Figma Image Fills from node 8:2268
const HERO_BG = figmaImages['a1be0c17f00602b7c2e25ecbce07a1bd15b1b842'] || '/images/a1be0c17f00602b7c2e25ecbce07a1bd15b1b842.png';
const WAVE_OVERLAY = figmaImages['927fa453e7029d1a4a5a716e698d71902bfb4c10'] || '/images/927fa453e7029d1a4a5a716e698d71902bfb4c10.png';
const BEIGE_ARCH_BG = '/images/vector_1_arch.svg';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';
const IPHONE_MOCKUP = figmaImages['9d7ee15c8b4d9604fc2888a15c3392332cf5eeff'] || '/images/9d7ee15c8b4d9604fc2888a15c3392332cf5eeff.png';
const RED_PLAY_ICON = figmaImages['2487459838dbd7705ddd0f4c1913e506058e8c78'] || '/images/2487459838dbd7705ddd0f4c1913e506058e8c78.png';

// Photos for testimonial video cards
const VIDEO_PHOTO_1 = '/images/video_1.png';
const VIDEO_PHOTO_2 = '/images/video_2.png';
const UPCOMING_ROOM_BG = figmaImages['e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae'] || '/images/e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae.png';
const UPCOMING_SECTION_BG = '/images/Group 1000002628.png';
const FARMHOUSE_LIONS_PHOTO = '/images/farmhouse_lions.png';
const P2G_LOGO = '/images/p2g_logo.png';
const HIGHFIELD_LOGO = '/images/highfield_logo.png';
const ABID_KHAN_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';

export default function AboutPage() {
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dark background with photo & ambient wave overlay) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[820px] lg:h-[860px] pt-28 pb-12 flex flex-col justify-between bg-[#1e1e1e] z-10 overflow-hidden">
        {/* Base Photo Background with Ambient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="About Chutney & Chat"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-100 contrast-[1.02]"
            priority
          />
          {/* Wave Overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none z-10">
            <Image
              src={WAVE_OVERLAY}
              alt=""
              fill
                sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />
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
                Social, Business &amp; Balti.
              </h1>

              <div className="space-y-1 text-white/90 text-base sm:text-lg font-light">
                <p>Next Event: Wednesday 9th September 2026</p>
                <p>at The Farmhouse Coventry</p>
                <p>6:30pm - 9:30pm</p>
              </div>

              {/* Live Countdown Timer */}
              <EventCountdown targetDate="2026-09-09T18:30:00" />

              <div className="pt-2">
                <Link
                  href="/buy-ticket"
                  className="inline-flex items-center justify-center h-[44px] px-8 rounded-md bg-white text-[#2d2d2d] font-bold text-[15px] hover:bg-neutral-100 transition-all shadow-md hover:scale-105"
                >
                  Buy Tickets
                </Link>
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
        {/* HERO STATISTICS BAR — Inside bottom of Hero image section with golden border */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full max-w-[1340px] mx-auto px-6 mt-12 mb-4">
          <div className="bg-black/50 backdrop-blur-md border-[1.5px] border-[#D87D38]/80 rounded-[20px] py-6 px-6 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(216,125,56,0.15)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-white/20">
              {/* Stat 1 */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                  <circle cx="12" cy="9" r="2.5"></circle>
                  <path strokeDasharray="2 2" d="M3 20h6"></path>
                  <path strokeDasharray="2 2" d="M15 20h6"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">3</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Event Location</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <circle cx="9" cy="11" r="1.5"></circle>
                  <circle cx="15" cy="11" r="1.5"></circle>
                  <path d="M9 16c1.5 1.5 4.5 1.5 6 0"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">1</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Event Per Month</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">16</span>
                  <span className="text-xs sm:text-sm text-white/85 font-medium leading-tight mt-1">Great Speakers</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center justify-start sm:justify-center gap-3.5 p-2 sm:p-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="shrink-0 w-7 h-7 sm:w-9 sm:h-9">
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
      {/* 2. NO PRESSURE BUSINESS NETWORKING & FIGMA GROUP 1000002596 PROCESS FLOW */}
      {/* ========================================================================= */}
      <section className="relative pt-16 sm:pt-24 pb-20 bg-[#FAFAFA] text-center overflow-hidden">
        {/* Main Title */}
        <div className="max-w-[940px] mx-auto px-6 mb-12 sm:mb-16 relative z-10">
          <h2 className="text-3xl sm:text-[40px] font-extrabold text-[#2b2b2b] tracking-tight">
            No Pressure Business Networking.
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* TOP PART: 3 CONNECTED PROCESS STEPS (Figma Group 1000002596) */}
        {/* ========================================================================= */}
        <div className="relative max-w-[1040px] mx-auto px-6 mb-20">
          {/* Horizontal Connecting Line (hidden on small mobile screens) */}
          <div className="hidden md:block absolute top-[28px] left-[18%] right-[18%] h-[2px] bg-[#FFE1CD] z-0" />

          {/* 3 Process Step Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
            {/* Step 1: Founded in 2015 */}
            <div className="flex flex-col items-center">
              {/* Icon Container with glowing orange border */}
              <div className="w-14 h-14 rounded-[16px] bg-[#FFF3EA] border border-[#FFE3D1] text-[#FF7D01] flex items-center justify-center shadow-[0_4px_15px_rgba(255,125,1,0.15)] z-10 relative">
                <Lightbulb className="w-7 h-7 stroke-[1.75]" />
              </div>
              {/* Vertical Connector Stem Line */}
              <div className="w-[2px] h-6 bg-[#FF7D01]/50 my-1" />
              {/* Content Card Box */}
              <div className="w-full bg-[#FFF8F3] border border-[#FFE7D6] rounded-[20px] p-6 text-center shadow-[0_6px_20px_rgba(255,125,1,0.03)] hover:-translate-y-1 transition-all duration-300 min-h-[140px] flex flex-col justify-center">
                <h3 className="font-extrabold text-[#2d2d2d] text-base sm:text-[17px] mb-1.5 leading-snug">
                  Founded in 2015
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal">
                  Born from Pathway2Grow’s vision to connect business minds.
                </p>
              </div>
            </div>

            {/* Step 2: No Pressure Networking */}
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-[16px] bg-[#FFF3EA] border border-[#FFE3D1] text-[#FF7D01] flex items-center justify-center shadow-[0_4px_15px_rgba(255,125,1,0.15)] z-10 relative">
                <LayoutGrid className="w-7 h-7 stroke-[1.75]" />
              </div>
              {/* Vertical Connector Stem Line */}
              <div className="w-[2px] h-6 bg-[#FF7D01]/50 my-1" />
              {/* Content Card Box */}
              <div className="w-full bg-[#FFF8F3] border border-[#FFE7D6] rounded-[20px] p-6 text-center shadow-[0_6px_20px_rgba(255,125,1,0.03)] hover:-translate-y-1 transition-all duration-300 min-h-[140px] flex flex-col justify-center">
                <h3 className="font-extrabold text-[#2d2d2d] text-base sm:text-[17px] mb-1.5 leading-snug">
                  No Pressure Networking
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal">
                  A relaxed space to build relationships naturally.
                </p>
              </div>
            </div>

            {/* Step 3: Grow Your Business */}
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-[16px] bg-[#FFF3EA] border border-[#FFE3D1] text-[#FF7D01] flex items-center justify-center shadow-[0_4px_15px_rgba(255,125,1,0.15)] z-10 relative">
                <TrendingUp className="w-7 h-7 stroke-[1.75]" />
              </div>
              {/* Vertical Connector Stem Line */}
              <div className="w-[2px] h-6 bg-[#FF7D01]/50 my-1" />
              {/* Content Card Box */}
              <div className="w-full bg-[#FFF8F3] border border-[#FFE7D6] rounded-[20px] p-6 text-center shadow-[0_6px_20px_rgba(255,125,1,0.03)] hover:-translate-y-1 transition-all duration-300 min-h-[140px] flex flex-col justify-center">
                <h3 className="font-extrabold text-[#2d2d2d] text-base sm:text-[17px] mb-1.5 leading-snug">
                  Grow Your Business
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-normal">
                  Expand your network, gain knowledge, and thrive together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM PART: 3 ASCENDING STEPPED FEATURE CARDS OVER FIGMA VECTOR 1 CURVED ARCH */}
        {/* ========================================================================= */}
        <div className="relative max-w-[1170px] mx-auto px-4 min-h-[460px] sm:min-h-[520px] flex items-center justify-center pt-6">
          {/* Background Cream Vector 1 Curved Arch Graphic */}
          <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none pb-2">
            <div className="relative w-full max-w-[1100px] h-[360px] sm:h-[420px]">
              <Image
                src={BEIGE_ARCH_BG}
                alt="Vector 1 Arch"
                fill
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-contain object-bottom opacity-95"
                priority
              />
            </div>
          </div>

          {/* 3 Ascending Feature Cards Grid — Following exact Figma ascending wave pattern */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-[1040px] mx-auto items-center pt-4 pb-12">
            
            {/* Card 1 (Left - Positioned LOW down on the left curve) */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-6 sm:p-7 text-left shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#F5EBE1] hover:-translate-y-1 transition-all duration-300 min-h-[230px] flex flex-col justify-between md:translate-y-14 lg:translate-y-18">
              <div>
                {/* 5 Indicator Dots (3 Filled Orange, 2 Light Peach) */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2d2d2d] mb-2 leading-snug">
                  No Pressure<br />Networking
                </h3>
              </div>
              <p className="text-[#666666] text-xs sm:text-sm leading-relaxed font-normal mt-3">
                Connect in a relaxed, friendly environment.
              </p>
            </div>

            {/* Card 2 (Middle - Positioned MEDIUM height in center) */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-6 sm:p-7 text-left shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#F5EBE1] hover:-translate-y-1 transition-all duration-300 min-h-[230px] flex flex-col justify-between md:translate-y-0">
              <div>
                {/* 5 Indicator Dots (3 Filled Orange, 2 Light Peach) */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2d2d2d] mb-2 leading-snug">
                  Learn, Share<br />&amp; Grow
                </h3>
              </div>
              <p className="text-[#666666] text-xs sm:text-sm leading-relaxed font-normal mt-3">
                Inspiration from top keynote speakers.
              </p>
            </div>

            {/* Card 3 (Right - Positioned HIGH up on the right curve) */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-6 sm:p-7 text-left shadow-[0_25px_60px_rgba(0,0,0,0.1)] border border-[#F5EBE1] hover:-translate-y-1 transition-all duration-300 min-h-[230px] flex flex-col justify-between md:-translate-y-14 lg:-translate-y-18">
              <div>
                {/* 5 Indicator Dots (3 Filled Orange, 2 Light Peach) */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF7D01]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE3D1]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2d2d2d] mb-2 leading-snug">
                  Food, Friendship<br />&amp; Business
                </h3>
              </div>
              <p className="text-[#666666] text-xs sm:text-sm leading-relaxed font-normal mt-3">
                Where great conversations meet great curries.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RICH ABOUT DESCRIPTION PARAGRAPH BLOCK */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1120px] mx-auto px-6 space-y-8 text-left">
          <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#2b2b2b] leading-tight tracking-tight">
            We want you to network, meet new friends and get more business.
          </h2>

          <div className="space-y-6 text-[#555555] text-base sm:text-[17px] leading-[1.8] font-normal">
            <p>
              The events are about social, business, and of course, Balti, with a delicious 3-course meal served throughout the evening. Our events offer a ‘no pressure’ and relaxed environment. We encourage networking engagement and conversation between delegates. Should you wish to do so, you will have an opportunity to have meaningful conversations with the many businesses that attend. On the other hand, you may just want to listen to the speakers; we carefully select our keynote speakers to ensure we deliver value every time.
            </p>
            <p>
              We are an event for non-traditional networkers as well as seasoned event-goers. Being one of the pioneers of building online communities back in 2016, we’ve developed and grown over time and now boast an online community of over 1000 members across all our platforms, ensuring great opportunities to connect with like-minded and seasoned business owners. Join us, be part of the family ChutneyandChat – Award-winning Business Networking at its Best!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TESTIMONIAL VIDEO CARDS — Exact Figma Image 2 Parity */}
      {/* ========================================================================= */}
      <section className="py-12 pb-24 bg-[#FAFAFA]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          
          {/* Card 1: Text Left | Interactive Video Player Right */}
          <div className="bg-[#FFF8F3] rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 lg:p-12 shadow-[0_12px_35px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Text Content */}
            <div className="flex-1 space-y-4 text-left">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#2d2d2d] leading-snug">
                The Best Decision I Made This Year!
              </h3>
              <p className="text-[#555555] text-sm sm:text-base leading-relaxed font-normal italic">
                &ldquo;It has got to be the best decision I have made this year, I have met some incredible people,there has been a lot of networking most of all we have all learned something. &ldquo;
              </p>
              <p className="text-[#2d2d2d] font-bold text-xs sm:text-sm pt-2">
                Tuyyabah Amjid. &ndash; Lawyer and network marketer.
              </p>
            </div>

            {/* Right Video Container (Rounded 24px with interactive YouTube player) */}
            <div className="w-full lg:w-[460px] h-[240px] sm:h-[270px] relative rounded-[24px] overflow-hidden shadow-md group shrink-0 bg-black">
              {playingVideo === 'B7aPv5doguo' ? (
                <iframe
                  src="https://www.youtube.com/embed/B7aPv5doguo?autoplay=1"
                  title="The Best Decision I Made This Year Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-[24px] border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingVideo('B7aPv5doguo')}
                  className="w-full h-full relative cursor-pointer block text-left group focus:outline-none"
                  aria-label="Play video: The Best Decision I Made This Year"
                >
                  <Image
                    src={VIDEO_PHOTO_1}
                    alt="Video Testimonial Tuyyabah Amjid"
                    fill
                sizes="100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  {/* YouTube Red Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={RED_PLAY_ICON}
                        alt="Play Video"
                        fill
                sizes="128px"
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Interactive Video Player Left | Text Right */}
          <div className="bg-[#FFF8F3] rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 lg:p-12 shadow-[0_12px_35px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row-reverse items-center justify-between gap-8 lg:gap-12">
            {/* Right Text Content */}
            <div className="flex-1 space-y-4 text-left">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#2d2d2d] leading-snug">
                A Buzzing Room and a Thriving Community!
              </h3>
              <p className="text-[#555555] text-sm sm:text-base leading-relaxed font-normal italic">
                &ldquo;A full-on buzzing room full of people networking, the reason why I come to Chutney &amp; Chat is quite simple, we are a community, we are business owners, we are here to learn from each other, network. Today one of the highlights was listening to Amar Nawan talk about his journey. You must come to Chutney and Chat it really is the only place you need to be!&rdquo;
              </p>
              <p className="text-[#2d2d2d] font-bold text-xs sm:text-sm pt-2">
                Damini Sharma.
              </p>
            </div>

            {/* Left Video Container (Rounded 24px with interactive YouTube player) */}
            <div className="w-full lg:w-[460px] h-[240px] sm:h-[270px] relative rounded-[24px] overflow-hidden shadow-md group shrink-0 bg-black">
              {playingVideo === 'rhv18ii0-sk' ? (
                <iframe
                  src="https://www.youtube.com/embed/rhv18ii0-sk?autoplay=1"
                  title="A Buzzing Room and a Thriving Community Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-[24px] border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingVideo('rhv18ii0-sk')}
                  className="w-full h-full relative cursor-pointer block text-left group focus:outline-none"
                  aria-label="Play video: A Buzzing Room and a Thriving Community"
                >
                  <Image
                    src={VIDEO_PHOTO_2}
                    alt="Video Testimonial Damini Sharma"
                    fill
                sizes="100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  {/* YouTube Red Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={RED_PLAY_ICON}
                        alt="Play Video"
                        fill
                sizes="128px"
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. UPCOMING EVENTS SECTION — New 2-Card Grid Design */}
      {/* ========================================================================= */}
      <UpcomingEventsSection />

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

            {/* Nav Links — Exact Figma Image 1 match */}
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
