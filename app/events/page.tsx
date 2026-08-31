'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';
import { Calendar, Clock, MapPin, Mic, Share2, Ticket } from 'lucide-react';
import { useTicketModal } from '@/components/TicketModal';

// Exact Figma Image Fills from node 8:2417
const HERO_BG = figmaImages['24f07613d611bfa61b6c09f1c3ace6e8c2a3d42f'] || '/images/24f07613d611bfa61b6c09f1c3ace6e8c2a3d42f.png';
const WAVE_OVERLAY = figmaImages['927fa453e7029d1a4a5a716e698d71902bfb4c10'] || '/images/927fa453e7029d1a4a5a716e698d71902bfb4c10.png';
const BEIGE_ARCH_BG = figmaImages['e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae'] || '/images/e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';
const RED_PLAY_ICON = figmaImages['2487459838dbd7705ddd0f4c1913e506058e8c78'] || '/images/2487459838dbd7705ddd0f4c1913e506058e8c78.png';
const LINKEDIN_ICON = figmaImages['276d23f82a22209b705ddb3ecb32d0c678fe2575'] || '/images/276d23f82a22209b705ddb3ecb32d0c678fe2575.png';
const SUMMER_BBQ_PHOTO = figmaImages['d429b23081ff07fc437228a978c52d1cf30c0da3'] || '/images/d429b23081ff07fc437228a978c52d1cf30c0da3.png';
const VIDEO_HIGHLIGHT_PHOTO = figmaImages['e0ca65afea9a013b8233495d9de0eec17623019c'] || '/images/e0ca65afea9a013b8233495d9de0eec17623019c.png';
const IN_CASE_YOU_MISSED_PHOTO = '/images/in_case_you_missed.png';

// 14 Event Speakers mapping exact Figma photos, titles & LinkedIn links
const eventSpeakers = [
  {
    name: 'Abid Khan',
    title: 'Chutney & Chat Co Founder',
    image: figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Andy Wilkinson',
    title: 'Institute of Directors Chair - Birmingham',
    image: figmaImages['81acde3ab332d0c080cb8f58ed2c3b4980a543c4'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Amer Awan',
    title: 'Nazir Awan International Foundation',
    image: figmaImages['b634095d071f30c99a0dbc77843dd540702fd0f4'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Asad Ansari',
    title: 'Mayfair IT Consultancy',
    image: figmaImages['3fcff57573c6b62f97ac0832d35f08a6f2d59019'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Aslam Cheval',
    title: 'The Mind Architect',
    image: figmaImages['27cb070937dd331cf1b41e80da191eaf8ec642f8'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Bally Heer',
    title: 'Regional Homes',
    image: figmaImages['7a228026987d9e81c5066276c81cf785c42eb05d'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Inez Brown',
    title: 'Chair, IoD West Midlands',
    image: figmaImages['af058095224512675e75d0a35f40dcbf4673f438'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Jimi Shabir',
    title: 'Bootcamp Media',
    image: figmaImages['2cef3e50778acec77cef9b5ab8838c531a4966a1'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Kal Sangra',
    title: 'Shonki Brothers',
    image: figmaImages['7405b55ab596dff3355c0e58b051f24593258068'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Lisa Storey',
    title: 'EZ Hampers',
    image: figmaImages['a8eb9985adc937bc4a7caa25d6ed1aa86bd27af1'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Luke Murfitt',
    title: 'UK Entrepreneur of the Year',
    image: figmaImages['050b00e57fbc47db4cce62ec5f212b2d4694cbe4'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Rohini Makwana',
    title: 'Rohini Photography',
    image: figmaImages['da0c353f900f5322d6dff3a761c89129fd33becf'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Rafique Patel',
    title: 'Bond Adams Solicitors',
    image: figmaImages['212e452724e32e88223aff956414bad7df68a84d'],
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'Muhammed Ahmed',
    title: 'Pinnacle Finance',
    image: figmaImages['c3019397c4961a001b37f3fe533af906ca5eb221'],
    linkedin: 'https://www.linkedin.com/',
  },
];

export default function EventsPage() {
  const [isPlayingMissed, setIsPlayingMissed] = React.useState(false);
  const { openModal } = useTicketModal();

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dark ambient background with photo & wave overlay) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] pt-32 pb-16 flex items-center justify-center bg-[#1e1e1e] z-10">
        {/* Base Photo Background with Ambient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Chutney & Chat Events"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-100 contrast-[1.02]"
            priority
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-[900px] w-full mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <div className="space-y-6 text-center max-w-[780px] mx-auto flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md">
              Education, Networking<br className="hidden sm:inline" /> &amp; excellent food
            </h1>

            <p className="text-white/90 text-sm sm:text-base lg:text-[17px] font-light leading-relaxed max-w-[640px] mx-auto">
              What more could you possibly need? Meet new people, expand your network and grow your business. We are now taking bookings for our Next Event ;, we look forward to seeing you there!
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  openModal({
                    title: 'Tuesday 29th September 2026 - Tipu Sultan Leicester',
                    price: '£35.00',
                    eventSlug: 'business-networking-evening',
                  })
                }
                className="inline-flex items-center justify-center h-[46px] px-8 rounded-md bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-sm sm:text-base transition-all shadow-[0px_4px_25px_rgba(255,102,0,0.5)] hover:shadow-[0px_4px_35px_rgba(255,102,0,0.8)] hover:scale-105 cursor-pointer"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UPCOMING EVENTS SECTION — New 2-Card Grid Design */}
      {/* ========================================================================= */}
      <UpcomingEventsSection />

      {/* ========================================================================= */}
      {/* 2.5. VIDEO EXPERIENCE & TASTE OF CHUTNEY SECTION (Figma Match) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white text-left">
        <div className="max-w-[1170px] mx-auto px-6 space-y-20">
          
          {/* Top Row: Main Video Embed + Experience Copy */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            
            {/* Left: YouTube Video Card (https://www.youtube.com/watch?v=Ri6g2aoEA5Q) */}
            <div className="w-full lg:w-1/2 aspect-video rounded-[20px] overflow-hidden shadow-2xl border border-neutral-200 bg-black relative group shrink-0">
              <iframe
                src="https://www.youtube.com/embed/Ri6g2aoEA5Q"
                title="Pathway2Grow Chutney & Chat Business Networking in Birmingham"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-[20px]"
              />
            </div>

            {/* Right: Copy Text */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1f1f1f] leading-snug tracking-tight">
                To really experience Chutney &amp; Chat, you need to be here!
              </h2>

              <div className="space-y-4 text-[#555555] text-sm sm:text-base leading-relaxed font-normal">
                <p>
                  But if you haven&apos;t been to a Chutney &amp; Chat event, you are missing out, but don&apos;t worry, we have a selection of videos for you to give a flavour of the events &amp; also some experiences from those who attended.
                </p>
                <p>
                  The room is always buzzing with some of the regions leading entrepreneurs and business people, so if you are looking to get more business, expand your network or just get out there for the evening, Chutney and Chat is here for you.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Row: "A Taste of what we have in store for you." 6-Video Grid */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] tracking-tight">
                A Taste of what we have in store for you.
              </h3>
              <a
                href="https://www.youtube.com/@Pathway2Grow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF0000] text-white font-bold text-xs sm:text-sm hover:bg-[#cc0000] transition-all shadow-md shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Visit Pathway2Grow YouTube</span>
              </a>
            </div>

            {/* 6 Real Pathway2Grow Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { id: 'Ri6g2aoEA5Q', title: 'Pathway2Grow Chutney & Chat - Abid Khan' },
                { id: 'rhv18ii0-sk', title: 'Pathway2Grow Networking Highlights' },
                { id: 'B7aPv5doguo', title: 'Pathway2Grow Community & Events' },
                { id: 'Ri6g2aoEA5Q', title: 'Chutney & Chat Keynote Speaker' },
                { id: 'rhv18ii0-sk', title: 'Sajid Rashid BEM Testimonial' },
                { id: 'B7aPv5doguo', title: 'Pathway2Grow Business Networking' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-[20px] overflow-hidden relative shadow-md group border border-neutral-200 bg-black hover:shadow-xl transition-shadow"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${item.id}`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-[20px]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTRODUCING OUR EVENT SPEAKERS GRID (14 Speakers + 1 Apply Box) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white text-left">
        <div className="max-w-[1170px] mx-auto px-6 space-y-10">
          
          {/* Left-Aligned Header */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1f1f1f] tracking-tight">
              Introducing our event Speakers..
            </h2>
            <p className="text-[#555555] text-sm sm:text-base leading-relaxed font-normal max-w-[1050px]">
              Some of the regions leading experts in their fields, our speakers are carefully chosen taking into account reputation, expertise and added value of the subjects to our business community. Like to be a speaker? Get in touch with us and we can have a conversation.
            </p>
          </div>

          {/* 5-Column Matrix Speaker Grid with Subtle Orange Dashed Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-dashed border-[#F3C49B]/70 rounded-xl overflow-hidden">
            {eventSpeakers.map((speaker, index) => (
              <div
                key={index}
                className="p-3.5 xs:p-5 sm:p-7 border-r border-b border-dashed border-[#F3C49B]/70 flex flex-col items-center justify-start sm:justify-between text-center min-h-[210px] xs:min-h-[270px] sm:min-h-[310px] group hover:bg-[#FFF9F5]/40 transition-colors"
              >
                {/* Square Rounded Photo Frame matching design */}
                <div className="relative w-22 h-22 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-xl xs:rounded-2xl overflow-hidden shadow-sm shrink-0">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                sizes="128px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Speaker Info */}
                <div className="space-y-0.5 sm:space-y-1 mt-2.5 sm:my-2">
                  <h3 className="text-base sm:text-[18px] font-bold text-[#1f1f1f] leading-snug group-hover:text-[#FF6600] transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#666666] leading-tight font-normal max-w-[170px] mx-auto min-h-0 sm:min-h-[34px] flex items-center justify-center">
                    {speaker.title}
                  </p>
                </div>
              </div>
            ))}

            {/* 15th Cell: Apply to Speak CTA Card */}
            <div className="p-5 sm:p-7 border-r border-b border-dashed border-[#F3C49B]/70 flex flex-col items-center justify-center text-center min-h-[300px] space-y-4">
              <div className="text-[#F5A059] mb-1">
                <svg width="40" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-12">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#1f1f1f] leading-tight max-w-[150px] mx-auto">
                Are you the next voice to inspire our audience?
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-[40px] px-5 rounded-md bg-[#FF6600] hover:bg-[#e55c00] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm hover:scale-105"
              >
                APPLY TO SPEAK
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. IN CASE YOU MISSED OUR LAST EVENTS (VIDEO EMBED / HIGHLIGHT) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FAFAFA] text-center">
        <div className="max-w-[1120px] mx-auto px-6 space-y-10">
          {/* Header */}
          <div className="max-w-[880px] mx-auto space-y-4">
            <h2 className="text-3xl sm:text-[38px] font-extrabold text-[#2b2b2b] tracking-tight">
              In case you missed our last events
            </h2>
            <p className="text-[#595959] text-base sm:text-[17px] leading-[1.7] font-normal max-w-[850px] mx-auto">
              Don&apos;t worry! You can watch past events on our YouTube channel, showcasing highlights of the keynote speakers, the buzzing atmosphere of business networking, delegates meeting new friends, and growing their business networks.
            </p>
          </div>

          {/* Large Video Frame with Red Play Button / YouTube Embed */}
          <div className="w-full max-w-[960px] h-[360px] sm:h-[480px] lg:h-[540px] mx-auto relative rounded-[28px] overflow-hidden shadow-2xl group border border-[#E8DEC8] bg-black">
            {isPlayingMissed ? (
              <iframe
                src="https://www.youtube.com/embed/Ri6g2aoEA5Q?autoplay=1"
                title="In case you missed our last events"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-[28px]"
              />
            ) : (
              <div
                onClick={() => setIsPlayingMissed(true)}
                className="relative w-full h-full cursor-pointer group"
              >
                <Image
                  src={IN_CASE_YOU_MISSED_PHOTO}
                  alt="In case you missed our last events"
                  fill
                sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                
                {/* YouTube Red Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={RED_PLAY_ICON}
                      alt="Play Video"
                      fill
                sizes="128px"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. REGISTRATION CTA BANNER & DARK FOOTER SECTION */}
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
