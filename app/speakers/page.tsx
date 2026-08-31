'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection';

// Image constants
const HERO_BG = figmaImages['b5b5e05a3ea79f01ba202fbdd225989a4aa8f04a'] || '/images/b5b5e05a3ea79f01ba202fbdd225989a4aa8f04a.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

// 14 Speakers Data with square photo, title & detailed bio
const speakersList = [
  {
    id: 'abid-khan',
    name: 'Abid Khan',
    title: 'Chutney & Chat Co Founder',
    image: figmaImages['4cb96fcaa9271871b093df6c3635457faaebe957'] || '/images/4cb96fcaa9271871b093df6c3635457faaebe957.png',
    bio: 'As National Director at Pathway Group and founder of Chutney and Chat, I’m known to clients as ‘Mr Chutney’. Since launching in December 2015, this award-winning business networking forum has grown to nearly 1,000 members nationwide. I’m passionate about supporting business growth, building trusted professional communities, and creating opportunities for long-term connections through events, keynote speakers, and local business promotion.'
  },
  {
    id: 'andy-wilkinson',
    name: 'Andy Wilkinson',
    title: 'Institute of Directors Chair - Birmingham',
    image: figmaImages['81acde3ab332d0c080cb8f58ed2c3b4980a543c4'] || '/images/81acde3ab332d0c080cb8f58ed2c3b4980a543c4.png',
    bio: 'Founder and partner of OWB, a full-service digital marketing agency based in Birmingham, Andy has extensive experience both agency- and client-side, in the UK and internationally. As Chair of the Institute of Directors – Birmingham, he supports members through #BetterBusinessBrum. Andy is also passionate about mentoring, guest lecturing, and giving back through board roles such as St Giles Hospice.'
  },
  {
    id: 'amer-awan',
    name: 'Amer Awan',
    title: 'Nazir Awan International Foundation',
    image: figmaImages['b634095d071f30c99a0dbc77843dd540702fd0f4'] || '/images/b634095d071f30c99a0dbc77843dd540702fd0f4.png',
    bio: 'Entrepreneur, philanthropist, and community leader, Amer Awan is the Chairman of Birmingham Youth Sports Academy (BYSA), Owner of Awan Corp.UK, and Director of Awan International, a leading consumer electronics distributor. He is also the Founder of The Nazir Awan Foundation, a charity supporting the less fortunate in the UK and abroad, continuing his late father’s legacy of giving.'
  },
  {
    id: 'asad-ansari',
    name: 'Asad Ansari',
    title: 'Mayfair IT Consultancy',
    image: figmaImages['3fcff57573c6b62f97ac0832d35f08a6f2d59019'] || '/images/3fcff57573c6b62f97ac0832d35f08a6f2d59019.png',
    bio: 'A highly skilled professional with 7 years’ experience in programme and project management, data transformation, change management, and technology implementation. Asad combines Agile and Waterfall expertise with entrepreneurial flair, delivering structure, pace, and trusted leadership in fast-paced environments while engaging stakeholders and guiding teams to success.'
  },
  {
    id: 'aslam-cheval',
    name: 'Aslam Cheval',
    title: 'The Mind Architect',
    image: figmaImages['27cb070937dd331cf1b41e80da191eaf8ec642f8'] || '/images/27cb070937dd331cf1b41e80da191eaf8ec642f8.png',
    bio: 'Known as The Mind Architect, Aslam works with investors and executives to overcome challenges and achieve greater success. Using his E-T.E.A.R. method, he helps clients reduce stress, improve decision-making, and boost performance. Passionate about mindset and growth, Aslam shares his knowledge to help others evolve personally and professionally.'
  },
  {
    id: 'bally-heer',
    name: 'Bally Heer',
    title: 'Regional Homes',
    image: figmaImages['7a228026987d9e81c5066276c81cf785c42eb05d'] || '/images/7a228026987d9e81c5066276c81cf785c42eb05d.png',
    bio: 'Bally Heer is a multi-award-winning estate agent, published author, and public speaker. Recognised for her integrity, hard work, and determination, she inspires others to achieve their ambitions and realise their potential, sharing her journey of success through speaking engagements and mentorship.'
  },
  {
    id: 'inez-brown',
    name: 'Inez Brown',
    title: 'Chair, IoD West Midlands',
    image: figmaImages['af058095224512675e75d0a35f40dcbf4673f438'] || '/images/af058095224512675e75d0a35f40dcbf4673f438.png',
    bio: 'Past President of Birmingham Law Society, representing 5000+ lawyers, trainee solicitors, paralegals, University Law Schools and law students. Promoting the Law Society as an Ambassador within the Birmingham legal and Business Community.'
  },
  {
    id: 'jimi-shabir',
    name: 'Jimi Shabir',
    title: 'Bootcamp Media',
    image: figmaImages['2cef3e50778acec77cef9b5ab8838c531a4966a1'] || '/images/2cef3e50778acec77cef9b5ab8838c531a4966a1.png',
    bio: 'Jimi Shabir is a multi-award-winning digital marketing and web design expert. With decades of experience in search marketing, web design, and business development, he helps clients achieve online success and grow their businesses, combining ambition, expertise, and a results-driven approach.'
  },
  {
    id: 'kal-sangra',
    name: 'Kal Sangra',
    title: 'Shonki Brothers',
    image: figmaImages['7405b55ab596dff3355c0e58b051f24593258068'] || '/images/7405b55ab596dff3355c0e58b051f24593258068.png',
    bio: 'A seasoned property expert with experience since 1984, Kal Sangra is a Chartered Surveyor and Fellow of NAVA (Propertymark). He has extensive expertise in residential, commercial, and investment properties and regularly conducts property auctions, helping clients achieve optimal results through his deep industry knowledge and trusted guidance.'
  },
  {
    id: 'lisa-storey',
    name: 'Lisa Storey',
    title: 'EZ Hampers',
    image: figmaImages['a8eb9985adc937bc4a7caa25d6ed1aa86bd27af1'] || '/images/a8eb9985adc937bc4a7caa25d6ed1aa86bd27af1.png',
    bio: 'Lisa Storey creates bespoke, affordable, and environmentally friendly gift hampers for all occasions. Drawing on her family’s background in nursing, she ensures each gift is personalised with care, from handwritten cards to curated selections of candles, soaps, and bath products, helping clients show thoughtfulness and appreciation.'
  },
  {
    id: 'luke-murfitt',
    name: 'Luke Murfitt',
    title: 'UK Entrepreneur of the Year',
    image: figmaImages['050b00e57fbc47db4cce62ec5f212b2d4694cbe4'] || '/images/050b00e57fbc47db4cce62ec5f212b2d4694cbe4.png',
    bio: 'Luke Murfitt is a multi-award-winning entrepreneur, UK Entrepreneur of the Year, and Global Ambassador for Awards International. He is also a keynote speaker and international bestselling author, sharing his journey and insights, including his inspiring story of Winning with Parkinson’s Disease.'
  },
  {
    id: 'rohini-makwana',
    name: 'Rohini Makwana',
    title: 'Rohini Photography',
    image: figmaImages['da0c353f900f5322d6dff3a761c89129fd33becf'] || '/images/da0c353f900f5322d6dff3a761c89129fd33becf.png',
    bio: 'We create all types of video content as well as video marketing services for websites and social media. Our goal is to help you reach your business goals sooner using videos.'
  },
  {
    id: 'rafique-patel',
    name: 'Rafique Patel',
    title: 'Bond Adams Solicitors',
    image: figmaImages['212e452724e32e88223aff956414bad7df68a84d'] || '/images/212e452724e32e88223aff956414bad7df68a84d.png',
    bio: 'Former partner and Head of Regulatory & Trading at Harvey Ingram LLP Solicitors, Rafique Patel holds an LLM in Advanced Litigation and Dispute Resolution. He regularly speaks to accountants, property investors, and professionals, sharing expert insights on legal matters.'
  },
  {
    id: 'muhammed-ahmed',
    name: 'Muhammed Ahmed',
    title: 'Pinnacle Finance',
    image: figmaImages['c3019397c4961a001b37f3fe533af906ca5eb221'] || '/images/c3019397c4961a001b37f3fe533af906ca5eb221.png',
    bio: 'Experienced Business & Financial Consultant with a demonstrated history of working for large Corporate organisations. Skilled in Negotiation, Sales, Management, Contract Management, and Interviewing. Strong consulting professional with a keen desire in helping clients with arranging various types of finance.'
  }
];

export default function SpeakersPage() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<typeof speakersList[0] | null>(null);

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Microphone photo background with dark ambient overlay) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] pt-32 pb-16 flex items-center justify-center bg-[#141414] z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Meet Our Speakers"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-95 contrast-[1.05]"
            priority
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        </div>

        {/* Hero Content matching exact reference image */}
        <div className="relative z-20 max-w-[850px] mx-auto px-6 text-center text-white space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Meet Our Speakers
          </h1>
          <p className="text-white/90 text-sm sm:text-base lg:text-[17px] font-light max-w-[760px] mx-auto leading-relaxed">
            Gain invaluable insights from accomplished business leaders, entrepreneurs, and industry experts. Our speakers share real-world experiences, actionable tips, and personal stories designed to inspire, educate, and empower you to grow your business and professional network.
          </p>
          <div className="pt-2">
            <a
              href="#speakers-matrix"
              className="inline-flex items-center justify-center bg-[#FF6600] text-white font-bold text-sm sm:text-[15px] px-8 py-3.5 rounded-lg hover:bg-[#e55c00] transition-colors shadow-md"
            >
              Explore Now
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 5-COLUMN MATRIX SPEAKERS GRID (Top red box in reference image) */}
      {/* ========================================================================= */}
      <section id="speakers-matrix" className="py-16 sm:py-24 bg-white text-left">
        <div className="max-w-[1170px] mx-auto px-6">
          
          {/* 5-Column Matrix Speaker Grid with Subtle Orange Dashed Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-dashed border-[#F3C49B]/70 rounded-xl overflow-hidden">
            {speakersList.map((speaker, index) => (
              <div
                key={index}
                className="p-3.5 xs:p-5 sm:p-7 border-r border-b border-dashed border-[#F3C49B]/70 flex flex-col items-center justify-start sm:justify-between text-center min-h-[210px] xs:min-h-[270px] sm:min-h-[310px] group hover:bg-[#FFF9F5]/40 transition-colors"
              >
                {/* Square Rounded Photo Frame matching reference image */}
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
                <div className="space-y-0.5 sm:space-y-1 mt-2.5 sm:my-3">
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
            <div className="p-5 sm:p-7 border-r border-b border-dashed border-[#F3C49B]/70 flex flex-col items-center justify-center text-center min-h-[310px] space-y-4 bg-[#FFF9F5]/30">
              <div className="text-[#F5A059] mb-1">
                <svg width="42" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-12">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#1f1f1f] leading-tight max-w-[160px] mx-auto">
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

      {/* Speaker Bio Modal Popup */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-[550px] w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={selectedSpeaker.image}
                  alt={selectedSpeaker.name}
                  fill
                sizes="128px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f]">{selectedSpeaker.name}</h3>
                <p className="text-xs text-[#666666] font-medium">{selectedSpeaker.title}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-[#444444] leading-relaxed font-normal">
                {selectedSpeaker.bio}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="px-6 py-2.5 bg-[#FF6600] text-white text-xs font-bold rounded-lg hover:bg-[#e55c00] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
              <Link href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
