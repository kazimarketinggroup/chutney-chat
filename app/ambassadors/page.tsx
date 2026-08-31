'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';

// Exact Figma Image Fills from node 8:2934
const HERO_BG = figmaImages['13da9e8fece01fc41d051b554a03e86e757697c5'] || '/images/13da9e8fece01fc41d051b554a03e86e757697c5.png';
const WAVE_OVERLAY = figmaImages['927fa453e7029d1a4a5a716e698d71902bfb4c10'] || '/images/927fa453e7029d1a4a5a716e698d71902bfb4c10.png';
const BEIGE_ARCH_BG = figmaImages['e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae'] || '/images/e6d9ba5bd9c0835d35ae6c5c50fb1c8faf76c0ae.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

const AMER_AWAN_PHOTO = '/images/amer_awan_ambasdr_image.png';
const ZOE_BENNET_PHOTO = figmaImages['b9eea72035672193c4888e0830c8cded261c080a'] || '/images/b9eea72035672193c4888e0830c8cded261c080a.png';
const NAZIR_AWAN_PHOTO = '/images/nazir_ambasdr.png';

export default function AmbassadorsPage() {
  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Skyscraper reflection background with centered text) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] pt-32 pb-16 flex items-center justify-center bg-[#141414] z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Chutney & Chat Ambassadors"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-95 contrast-[1.05]"
            priority
          />
          {/* Subtle Dark Ambient Overlay for readable white text */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        </div>

        {/* Hero Content matching exact reference image */}
        <div className="relative z-20 max-w-[850px] mx-auto px-6 text-center text-white space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Our Ambassadors
          </h1>
          <p className="text-white/90 text-sm sm:text-base lg:text-[17px] font-light max-w-[720px] mx-auto leading-relaxed">
            We are honoured to introduce our Chutney &amp; Chat Ambassadors, successful individuals who go &apos;above and beyond&apos; to promote good business and Chutney &amp; Chat.
          </p>
          <div className="pt-2">
            <a
              href="#ambassadors-list"
              className="inline-flex items-center justify-center bg-[#FF6600] text-white font-bold text-sm sm:text-[15px] px-8 py-3.5 rounded-lg hover:bg-[#e55c00] transition-colors shadow-md"
            >
              Explore Now
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR AMBASSADORS CONTENT */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 pb-20 bg-[#FAFAFA] text-center overflow-hidden">

        {/* 3 Large Ambassador Cards Container */}
        <div id="ambassadors-list" className="relative max-w-[1170px] mx-auto px-4 min-h-[600px] flex items-center justify-center">

          {/* 3 Featured Ambassador Cards Stack */}
          <div className="relative z-10 space-y-12 w-full max-w-[1060px] mx-auto py-8">
            
            {/* Ambassador Card 1: Amer Awan (Photo Left | Text Right) */}
            <div className="bg-white rounded-[24px] border border-[#F5EBE1] shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 hover:-translate-y-1 transition-transform duration-300">
              {/* Photo Left */}
              <div className="w-full md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] relative rounded-[20px] overflow-hidden shadow-sm shrink-0">
                <Image
                  src={AMER_AWAN_PHOTO}
                  alt="Amer Awan"
                  fill
                sizes="400px"
                  className="object-cover object-top"
                />
              </div>

              {/* Text Right */}
              <div className="flex-1 text-left space-y-3.5">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] leading-snug">
                    Amer Awan
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#555555]">
                    Awan International Nazir Awan International Foundation
                  </p>
                </div>

                <div className="space-y-3 text-[#555555] text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal">
                  <p>
                    Raised in the City of Birmingham Amer took on the family business after completing his studies. Being involved in the day to day running of the business Amer saw opportunities for growth and began dialogue with blue chips such as Amazon, Robert Dyas and Tesco which later translated into fruitful business relationships. Today &apos;Awan International&apos; is a leading name in high end and branded consumer electronics wholesale.
                  </p>
                  <p>
                    He has a strong passion for the local community and has been involved in various initiatives and organisations trying to make the community a better place. In particular his work with the less privileged and the youth has been exemplary, going above and beyond to provide support and guidance for those that need it the most.
                  </p>
                  <p>
                    In 2021 he launched the &lsquo;Nazir Awan Foundation&rsquo;. This was set up in his father&apos;s name who was tragically lost to Covid in April 2020. The charity is supporting various causes and is working both nationally and internationally helping underprivileged communities.
                  </p>
                  <p className="pt-1 text-[#333333] font-medium">
                    We are honoured to have AMER as an ambassador of ChutneyandChat
                  </p>
                </div>
              </div>
            </div>

            {/* Ambassador Card 2: Zoe Bennet (Text Left | Photo Right) */}
            <div className="bg-white rounded-[24px] border border-[#F5EBE1] shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 sm:p-10 flex flex-col md:flex-row-reverse items-center justify-between gap-8 lg:gap-12 hover:-translate-y-1 transition-transform duration-300">
              {/* Photo Right */}
              <div className="w-full md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] relative rounded-[20px] overflow-hidden shadow-sm shrink-0">
                <Image
                  src={ZOE_BENNET_PHOTO}
                  alt="Zoe Bennet"
                  fill
                sizes="400px"
                  className="object-cover object-top"
                />
              </div>

              {/* Text Left */}
              <div className="flex-1 text-left space-y-3.5">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] leading-snug">
                    Zoe Bennet
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#555555]">
                    &quot;Motivational Queen&quot;
                  </p>
                </div>

                <div className="space-y-3 text-[#555555] text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal">
                  <p>
                    A dedicated personal development &amp;mindset trainer running her business &lsquo;Training Personified&rsquo; providing Personal Development workshops and one to one mentoring sessions as well as providing team building to Corporate Organisations. Drawing from personal experiences Zoe had to overcome many challenges in her life inspiring her to succeed and develop a passion for not allowing others to go through what she had gone through.
                  </p>
                  <p>
                    A fully accomplished entrepreneur and a serial networker Zoe is also a best-selling author of &lsquo;Networking Personified&rsquo; a book that articulates her passion for business networking.
                  </p>
                  <p>
                    We are honoured to have Zoe as an ambassador of chutneyandchat. You get the best out of your employees when you treat them fairly and provide them with the on going training tools to carry out the task at hand. A happy, informed and satisfied workforce is a more productive workforce.
                  </p>
                </div>
              </div>
            </div>

            {/* Ambassador Card 3: Nazir Awan (Late) (Photo Left | Text Right) */}
            <div className="bg-white rounded-[24px] border border-[#F5EBE1] shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 hover:-translate-y-1 transition-transform duration-300">
              {/* Photo Left */}
              <div className="w-full md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] relative rounded-[20px] overflow-hidden shadow-sm shrink-0">
                <Image
                  src={NAZIR_AWAN_PHOTO}
                  alt="Nazir Awan (Late)"
                  fill
                sizes="400px"
                  className="object-cover object-top"
                />
              </div>

              {/* Text Right */}
              <div className="flex-1 text-left space-y-3.5">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] leading-snug">
                    Nazir Awan (Late)
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#555555]">
                    View our tribute to a truly Great man here.
                  </p>
                </div>

                <div className="space-y-3 text-[#555555] text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal">
                  <p>
                    Nazir Awan was a driving force behind the success of Chutney &amp; Chat. A West Midlands based businessman who came to the UK in the 1960&apos;s. As well as helping establish the family business he was a beacon of support for businesses in the 80&apos;s and 90&apos;s and was instrumental in setting up the foundations of the Asian Chamber of Commerce (ABCC) part of the greater Birmingham Chamber of Commerce. His life was spent supporting businesses and community and when Chutneyandchat was founded in 2015 he again was instrumental in its forming and continued growth. Sadly he became victim to Covid19 and departed in April 2020
                  </p>
                  <p>
                    Sorley missed today, Nazir Awan (Late) will always be remembered for his wisdom, guidance, support and encouragement.
                  </p>
                  <p className="pt-1 text-[#333333] font-medium">
                    We honour his legacy by making him an Ambassador
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REGISTRATION CTA BANNER & DARK FOOTER SECTION */}
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
