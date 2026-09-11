'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { figmaImages } from '@/lib/images';
import { Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const LOGO_REF = 'c302ccd7d7909e70a9f99958bd6d760971083375';
const logoSrc = figmaImages[LOGO_REF] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

export const Footer = () => {
  return (
    <footer className="relative bg-[#0e0e0e] text-white pt-20 pb-10 border-t border-white/10 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#EE6422]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#EE6422]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10">
        {/* Top Section: CTA Banner */}
        <div className="bg-gradient-to-r from-[#1c1c1c] via-[#242424] to-[#1c1c1c] border border-white/10 rounded-3xl p-8 lg:p-12 mb-16 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Book into an event Today.
            </h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              Unfortunately we have a limited number of seats at our events so have to work on a &apos;first come-first served&apos; basis. So book in as early as you can!
            </p>
          </div>
          <Link
            href="/buy-ticket"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#EE6422] hover:bg-[#d65316] text-white text-base font-bold transition-all duration-300 shadow-xl shadow-[#EE6422]/25 hover:scale-105 shrink-0"
          >
            Buy Tickets
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <div className="relative w-[220px] h-[55px]">
                <Image
                  src={logoSrc}
                  alt="Chutney & Chat Logo"
                  fill
                sizes="256px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Join us for our upcoming gatherings where business meets community. Enjoy inspiring talks, meaningful connections, and a delightful 3-course Balti meal.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="https://www.facebook.com/groups/891724367615699"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Facebook Group"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.linkedin.com/groups/8243224/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="LinkedIn Group"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/pathway2grow/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@Pathway2Grow"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.flickr.com/photos/pathway2grow/albums/with/72177720329935642"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[#FF6600] hover:border-[#FF6600] hover:text-white transition-all shadow-sm"
                aria-label="Flickr Albums"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="7" cy="12" r="5" />
                  <circle cx="17" cy="12" r="5" className="opacity-80" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Events', href: '/events' },
                { name: 'Speakers', href: '/speakers' },
                { name: 'Ambassadors', href: '/ambassadors' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#EE6422] text-base transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-2 inline-block">
              Event Details
            </h4>
            <div className="space-y-4 text-white/70 text-base">
              <p>
                <strong className="text-white font-medium block">Next Gathering:</strong>
                Tuesday 29th September 2026 (6:30pm – 10:30pm)
              </p>
              <p>
                <strong className="text-white font-medium block">Location:</strong>
                Tipu Sultan, Leicester
              </p>
              <p>
                <strong className="text-white font-medium block">Ticket Price:</strong>
                £35.00 (Includes 3-Course Balti Meal)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Chutney &amp; Chat. All rights reserved.</p>
          <p>Designed &amp; Developed with High Precision</p>
        </div>
      </div>
    </footer>
  );
};
