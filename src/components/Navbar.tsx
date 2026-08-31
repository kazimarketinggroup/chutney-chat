'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { figmaImages } from '@/lib/images';

const LOGO_REF = 'c302ccd7d7909e70a9f99958bd6d760971083375';
const logoSrc = figmaImages[LOGO_REF] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Ambassador', href: '/ambassadors' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#121212] border-b border-white/10 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-3.5 sm:py-6'
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-[130px] h-[36px] xs:w-[160px] xs:h-[44px] sm:w-[210px] sm:h-[54px] transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src={logoSrc}
                alt="Chutney & Chat Logo"
                fill
                sizes="256px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Center Desktop Navigation Links (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm lg:text-base font-semibold transition-colors ${
                  pathname === link.href ? 'text-[#FF6600] font-bold' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right CTA Action: Buy Tickets button & Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/buy-ticket"
              className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-lg bg-white text-[#2d2d2d] text-xs sm:text-[15px] font-bold hover:bg-neutral-100 hover:scale-[1.03] transition-all shadow-md active:scale-95 shrink-0"
            >
              Buy Tickets
            </Link>

            {/* Mobile Only Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-[#FF6600] transition-colors focus:outline-none flex items-center justify-center rounded-lg hover:bg-white/10 shrink-0"
              aria-label="Open Menu Drawer"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Mobile Drawer (Rendered at top z-index) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[99999] bg-[#121212] text-white flex flex-col p-6 sm:p-8 overflow-hidden">
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 w-full shrink-0">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative w-[150px] h-[40px] sm:w-[190px] sm:h-[50px]">
                <Image src={logoSrc} alt="Chutney & Chat" fill
                sizes="256px" className="object-contain object-left" priority />
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF6600] transition-all focus:outline-none shrink-0"
              aria-label="Close Menu Drawer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav Links Container */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 w-full overflow-y-auto py-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-3xl sm:text-4xl font-extrabold transition-colors ${
                pathname === '/' ? 'text-[#FF6600]' : 'text-white hover:text-[#FF6600]'
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl sm:text-4xl font-extrabold transition-colors ${
                  pathname === link.href ? 'text-[#FF6600]' : 'text-white hover:text-[#FF6600]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Drawer Bottom Action */}
          <div className="w-full max-w-[280px] mx-auto text-center shrink-0 pt-4 pb-2">
            <Link
              href="/buy-ticket"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-4 rounded-xl bg-[#FF6600] hover:bg-[#e55c00] text-white font-extrabold text-[17px] shadow-xl transition-all active:scale-95"
            >
              Buy Tickets
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
