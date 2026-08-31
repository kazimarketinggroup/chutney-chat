'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';
import { figmaImages } from '@/lib/images';

// Image Assets
const ABID_KHAN_HERO_BG = '/images/abid_khan_hero_bg.png';
const ABID_KHAN_PAGE_PHOTO = '/images/abid_khan_page_photo.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

// Upcoming Events Section Assets
const UPCOMING_SECTION_BG = '/images/Group_1000002628.png';
const FARMHOUSE_LIONS_PHOTO = '/images/farmhouse_lions.png';
const P2G_LOGO = '/images/p2g_logo.png';
const HIGHFIELD_LOGO = '/images/highfield_logo.png';
const ABID_KHAN_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';

export default function AbidKhanPage() {
  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Abid Khan stage background with overlay text) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] pt-28 sm:pt-36 pb-14 sm:pb-18 lg:pb-20 flex flex-col justify-end bg-[#141414] z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={ABID_KHAN_HERO_BG}
            alt="Abid Khan - Chutney &amp; Chat"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-95 contrast-[1.05]"
            priority
          />
          {/* Subtle Ambient Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80 z-10" />
        </div>

        {/* Hero Bottom-Left Header Content */}
        <div className="relative z-20 max-w-[1170px] mx-auto px-6 w-full text-left space-y-2 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Abid Khan
          </h1>
          <p className="text-xl sm:text-2xl font-light text-white/90 tracking-wide">
            Chutney &amp; Chat Co-Founder
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROFILE DETAILS CARD SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 bg-white text-left z-20">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6">
          
          {/* Dark Plum Card matching reference */}
          <div className="bg-[#291726] text-white rounded-[24px] sm:rounded-[28px] p-5 xs:p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8 lg:gap-12">
            
            {/* Left Photo */}
            <div className="w-full md:w-[320px] lg:w-[360px] h-[300px] xs:h-[360px] sm:h-[440px] md:h-[480px] relative rounded-[18px] sm:rounded-[20px] overflow-hidden shadow-lg shrink-0">
              <Image
                src={ABID_KHAN_PAGE_PHOTO}
                alt="Abid Khan Speaking"
                fill
                sizes="400px"
                className="object-cover object-top"
              />
            </div>

            {/* Right Biography Column */}
            <div className="flex-1 text-left space-y-4 text-white/90 text-xs sm:text-[13.5px] leading-[1.7] font-normal pt-1">
              <p>
                One of the UK’s most highly driven people connector and serial Entrepreneur Abid Khan, the Co-Founder of ‘Riverdale Insurance’ a national commercial insurance business and the honoured Co-Founder of UK’s award-winning Business Networking platform Chutney and Chat.
              </p>

              <p>
                Known for his passion and drive for growth and helping people reach places they have never imagined; people know him as ‘The People connector’. Ever since launching the Business Networking platform in 2015, Chutney and Chat has over 1000 members all to whom are reputable business leaders, owners, and professionals. Abid Khan’s core purpose and passion lies within evolving and the growth of business and individuals. Abid has helped many businesses grow and succeed the success of Chutney and Chat is testament to this. Going from the shy kid who stuttered in school to delivering talks on world stages along with hosting and keynoting at nationwide events and universities. Abid will be overheard saying &ldquo;Your network is your net-worth&rdquo;.
              </p>

              <p>
                He is the biggest advocate of learning from others and networking with others. In addition, he is a firm believer in learning from people and live by the mantra &ldquo;You are always learning, from some you learn HOW TO and from some you learn How Not To&rdquo;.
              </p>

              {/* Social Media Circular Buttons Row */}
              <div className="flex items-center gap-3.5 pt-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/SP55DEE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white text-[#291726] flex items-center justify-center hover:bg-[#FF6600] hover:text-white transition-all shadow-md"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com/abidinspires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white text-[#291726] flex items-center justify-center hover:bg-[#FF6600] hover:text-white transition-all shadow-md"
                  aria-label="Twitter"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/abid_inspires/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white text-[#291726] flex items-center justify-center hover:bg-[#FF6600] hover:text-white transition-all shadow-md"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/abidkhan75/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white text-[#291726] flex items-center justify-center hover:bg-[#FF6600] hover:text-white transition-all shadow-md"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                    <line x1="8" y1="11" x2="8" y2="16" />
                    <line x1="8" y1="8" x2="8.01" y2="8" />
                    <path d="M12 16v-5h2.5a2 2 0 0 1 2 2v3" />
                  </svg>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. UPCOMING EVENTS SECTION — New 2-Card Grid Design */}
      {/* ========================================================================= */}
      <UpcomingEventsSection />

      {/* ========================================================================= */}
      {/* 4. SITE-WIDE FOOTER SECTION */}
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
              <Link href="#" className="hover:text-[#FF6600] transition-colors">Terms &amp; Conditions</Link>
              <Link href="#" className="hover:text-[#FF6600] transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
