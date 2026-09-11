'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';
import { Calendar, MapPin, Ticket, Mic, ChevronRight, ChevronLeft } from 'lucide-react';
import { figmaImages } from '@/lib/images';

import { useTicketModal } from '@/components/TicketModal';

const HOST_ABID_PHOTO = figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png';
const SPEAKER_SOHAIL_PHOTO = '/images/sohail_ali.png';

const slides = [
  {
    id: 1,
    title: 'Business Networking Evening',
    eventTitle: 'Tuesday 29th September 2026 - Tipu Sultan Leicester',
    price: '£35.00',
    eventSlug: 'business-networking-evening',
    bg: '/images/business_networking_event_slider_image.png',
    pill: 'Informal | Educational | Connection',
    cards: [
      {
        type: 'date',
        icon: <Calendar className="w-6 h-6 sm:w-7 sm:h-7 opacity-50" />,
        color: 'bg-gradient-to-br from-[#9c5812] to-[#7a420b]',
        content: (
          <div>
            <div className="text-2xl sm:text-[28px] font-bold leading-none mb-1">29th</div>
            <div className="text-xs sm:text-[13px] font-medium leading-snug">September, Tuesday</div>
            <div className="text-[11px] sm:text-xs text-white/80 mt-0.5">6:30pm – 10:30pm</div>
          </div>
        )
      },
      {
        type: 'location',
        icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7 opacity-50" />,
        color: 'bg-gradient-to-br from-[#A6221D] to-[#79120E]',
        content: (
          <div className="text-xs sm:text-[13px] font-bold leading-snug">
            Tipu Sultan<br />
            <span className="font-normal opacity-90">18 The Parade, Oadby,<br />Leicester LE2 5BF</span>
          </div>
        )
      },
      {
        type: 'ticket',
        icon: <Ticket className="w-6 h-6 sm:w-7 sm:h-7 opacity-50 transform -rotate-45" />,
        color: 'bg-gradient-to-br from-[#9c5812] to-[#7a420b]',
        content: (
          <div>
            <div className="text-[11px] sm:text-xs text-white/80 mb-0.5">Ticket Price</div>
            <div className="text-xl sm:text-[22px] font-bold leading-none">£35.00</div>
          </div>
        )
      },
      {
        type: 'host',
        icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />,
        color: 'bg-black/40 backdrop-blur-xl border border-white/5',
        content: (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#FF6600] shrink-0">
              <Image src={HOST_ABID_PHOTO} alt="Abid Khan" fill
                sizes="64px" className="object-cover" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] text-white/70">Hosted by</div>
              <div className="text-sm sm:text-[14px] font-bold">Abid Khan</div>
            </div>
          </div>
        )
      },
      {
        type: 'speaker',
        icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />,
        color: 'bg-black/40 backdrop-blur-xl border border-white/5',
        content: (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
              <Image src={SPEAKER_SOHAIL_PHOTO} alt="Sohail Ali" fill
                sizes="64px" className="object-cover" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] text-white/70 whitespace-nowrap">Keynote Speaker</div>
              <div className="text-sm sm:text-[14px] font-bold">Sohail Ali</div>
            </div>
          </div>
        )
      }
    ]
  }
];

export default function BuyTicketPage() {
  const [current, setCurrent] = useState(0);
  const { openModal } = useTicketModal();

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* 1. HERO SLIDER SECTION */}
      {/* On mobile the cards stack vertically and need more room than the
          viewport, so the height is content-driven there (min-h + pb) and only
          becomes a fixed frame from sm: up, where the cards sit in a row. */}
      <section className="relative w-full min-h-[100vh] sm:h-[800px] lg:h-[900px] overflow-hidden bg-[#121212] flex flex-col text-white pt-24 pb-14 sm:pb-0">
        {/* Background Crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={slide.bg}
              alt={slide.title}
              fill
                sizes="100vw"
              className="object-cover object-center brightness-75 contrast-100"
              priority
            />
            {/* Subtle vignette gradient so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Main Content Overlay */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-10 lg:px-20 max-w-[1600px] mx-auto w-full pt-16">
          
          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-1 sm:left-10 top-[190px] sm:top-1/2 sm:-translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:scale-110 transition-all z-20"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-1 sm:right-10 top-[190px] sm:top-1/2 sm:-translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:scale-110 transition-all z-20"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          {/* Text Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center w-full mb-8 sm:mb-12"
            >
              <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF6600]/30 bg-[#FF6600]/10 backdrop-blur-md text-[#FF8533] text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-4 shadow-[0_0_15px_rgba(255,102,0,0.2)]">
                {slide.pill}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold drop-shadow-lg tracking-tight">
                {slide.title}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Cards Row Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cards-${slide.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-7xl mx-auto w-full"
            >
              {slide.cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => {
                    if (card.type === 'ticket') {
                      openModal({
                        title: slide.eventTitle,
                        price: slide.price,
                        eventSlug: slide.eventSlug,
                      });
                    }
                  }}
                  className={`relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 w-[calc(50%-6px)] max-w-[220px] sm:w-[220px] h-[132px] sm:h-[160px] flex flex-col justify-between shadow-2xl transition-transform hover:-translate-y-1 ${card.color} ${card.type === 'ticket' ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
                >
                  {/* Top Right Icon */}
                  <div className="absolute top-5 right-5 text-white">
                    {card.icon}
                  </div>

                  {/* Bottom Left Content */}
                  <div className="mt-auto z-10 w-full text-white">
                    {card.content}
                  </div>

                  {/* Shine effect overlay for glass cards */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          {slides.length > 1 && (
            <div className="mt-10 flex justify-center gap-3 z-20 sm:mt-0 sm:absolute sm:bottom-8 sm:left-0 sm:right-0">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. UPCOMING EVENTS SECTION (Original Buy Ticket Cards) */}
      <UpcomingEventsSection />

      {/* 3. SITE-WIDE FOOTER SECTION */}
      <footer className="relative w-full text-white pt-12 sm:pt-16 lg:pt-20 pb-10 overflow-hidden bg-[#0A0B0E]">
        {/* Footer Background from assets/footer bg.png */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/footer_bg.png" alt="" fill
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
                <Image src={figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png'} alt="Chutney & Chat" fill
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
