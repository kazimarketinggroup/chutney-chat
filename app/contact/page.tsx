'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { figmaImages } from '@/lib/images';
import { Navbar } from '@/components/Navbar';

// Exact Figma Image Fills from node 8:2670
// Hero image asset
const HERO_BG = '/images/contactushero_image.png';
const WAVE_OVERLAY = figmaImages['927fa453e7029d1a4a5a716e698d71902bfb4c10'] || '/images/927fa453e7029d1a4a5a716e698d71902bfb4c10.png';
const TOPO_LINES_BG = figmaImages['3fc97f0aaa7b6b782de34d7a1b1ddadef14335a2'] || '/images/3fc97f0aaa7b6b782de34d7a1b1ddadef14335a2.png';
const FOOTER_WAVE_BG = '/images/footer_bg.png';
const LOGO_REF = figmaImages['c302ccd7d7909e70a9f99958bd6d760971083375'] || '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'enquiry' | 'speaker'>('enquiry');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '',
    role: '',
    linkedIn: '',
    talkTopic: '',
    speakingExperience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: activeTab,
          ...formData
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Optional: clear form
        setFormData({
          name: '', email: '', phone: '', message: '', company: '', role: '', linkedIn: '', talkTopic: '', speakingExperience: ''
        });
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Taller Hero area with clear background photo visibility) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] pt-32 pb-16 flex items-center justify-center bg-[#141414] z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Chutney & Chat Contact Us"
            fill
                sizes="100vw"
            className="object-cover object-center brightness-95 contrast-[1.02]"
            priority
          />
          {/* Subtle Dark Ambient Overlay for readable text and visible photo details */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />
        </div>

        {/* Hero Content matching exact reference image */}
        <div className="relative z-20 max-w-[850px] mx-auto px-6 text-center text-white space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Connect With Us,<br />
            Your Way
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-light max-w-[680px] mx-auto leading-relaxed">
            Whether you have a question, want to speak at our events, or secure your tickets, choose the option that&apos;s right for you and get started instantly.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CONTACT CONTENT SECTION (New Design with Event Locations & Dual Tabs) */}
      {/* ========================================================================= */}
      <section className="relative py-12 sm:py-20 bg-white text-left overflow-hidden">
        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Event Locations & Buy Tickets Cards */}
            <div className="space-y-6">
              
              {/* Card 1: Event Locations */}
              <div className="bg-[#F8F8F9] rounded-[20px] p-6 sm:p-7 space-y-6 border border-[#EBEBEB]">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
                  Event Locations
                </h2>

                <div className="space-y-5">
                  {/* Birmingham */}
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1f1f1f] mb-1">
                      Birmingham
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#555555] leading-snug font-normal">
                      The Tipu Sultan, 43 Alcester Rd,<br />Birmingham B13 8AA
                    </p>
                  </div>

                  {/* Coventry */}
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1f1f1f] mb-1">
                      Coventry
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#555555] leading-snug font-normal">
                      At The Farmhouse, Coventry<br />CV5 6HB
                    </p>
                  </div>

                  {/* Leicester */}
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1f1f1f] mb-1">
                      Leicester
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#555555] leading-snug font-normal">
                      The Tipu Sultan, 18 The Parade,<br />Oadby, Leicester LE2 5BF
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Buy Upcoming Event Tickets */}
              <div className="bg-[#FFF2E8] rounded-[20px] p-6 sm:p-7 space-y-4 border border-[#FDE5D4]">
                <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] leading-snug">
                  Buy Upcoming Event Tickets
                </h3>
                <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed font-normal">
                  We run first-come, first-served book early to avoid missing out.
                </p>
                <div>
                  <Link
                    href="/buy-ticket"
                    className="inline-flex items-center justify-center h-[42px] px-6 rounded-[10px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
                  >
                    Buy Tickets
                  </Link>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Tab Switcher & Dynamic Form */}
            <div className="space-y-6">
              
              {/* Tab Switcher (General Enquiry vs Become a Speaker) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tab 1: General Enquiry */}
                <button
                  type="button"
                  onClick={() => { setActiveTab('enquiry'); setSubmitted(false); }}
                  className={`p-5 sm:p-6 rounded-[16px] text-left transition-all cursor-pointer ${
                    activeTab === 'enquiry'
                      ? 'bg-[#FF6600] text-white shadow-md'
                      : 'bg-[#FFF2E8] hover:bg-[#FFE7D6] text-[#1f1f1f] border border-[#FDE5D4]'
                  }`}
                >
                  <h3 className={`text-base sm:text-lg font-bold mb-1 ${activeTab === 'enquiry' ? 'text-white' : 'text-[#1f1f1f]'}`}>
                    General Enquiry
                  </h3>
                  <p className={`text-xs sm:text-[13px] ${activeTab === 'enquiry' ? 'text-white/90 font-light' : 'text-[#666666] font-normal'}`}>
                    Reach out to our team for any questions or support
                  </p>
                </button>

                {/* Tab 2: Become a Speaker */}
                <button
                  type="button"
                  onClick={() => { setActiveTab('speaker'); setSubmitted(false); }}
                  className={`p-5 sm:p-6 rounded-[16px] text-left transition-all cursor-pointer ${
                    activeTab === 'speaker'
                      ? 'bg-[#FF6600] text-white shadow-md'
                      : 'bg-[#FFF2E8] hover:bg-[#FFE7D6] text-[#1f1f1f] border border-[#FDE5D4]'
                  }`}
                >
                  <h3 className={`text-base sm:text-lg font-bold mb-1 ${activeTab === 'speaker' ? 'text-white' : 'text-[#1f1f1f]'}`}>
                    Become a Speaker
                  </h3>
                  <p className={`text-xs sm:text-[13px] ${activeTab === 'speaker' ? 'text-white/90 font-light' : 'text-[#666666] font-normal'}`}>
                    Apply to speak at our events &amp; share your expertise.
                  </p>
                </button>

              </div>

              {/* Dynamic Form Area */}
              <div className="bg-white pt-2">
                {submitted ? (
                  <div className="bg-[#FFF9F5] border border-[#FDEEE3] rounded-[20px] p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FF6600]/15 text-[#FF6600] flex items-center justify-center mx-auto text-xl font-bold">
                      ✓
                    </div>
                    <h4 className="text-lg font-bold text-[#1f1f1f]">
                      {activeTab === 'enquiry' ? 'Message Sent!' : 'Pitch Submitted!'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#666666]">
                      Thank you for getting in touch. Our team will review your submission and reach out shortly.
                    </p>
                  </div>
                ) : activeTab === 'enquiry' ? (
                  /* Form 1: General Enquiry */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1: Name * */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                      />
                    </div>

                    {/* Row 2: Phone & Email * */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 3: Message / Question */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                        Message / Question
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      {submitError && (
                        <p className="text-red-500 text-xs sm:text-sm font-bold mb-3">
                          Failed to send message. Please try again.
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[46px] px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Form 2: Become a Speaker */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1: Name * & Email * */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Company & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 3: LinkedIn Profile URL & Proposed Talk Topic / Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={formData.linkedIn}
                          onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                          Proposed Talk Topic / Title
                        </label>
                        <input
                          type="text"
                          value={formData.talkTopic}
                          onChange={(e) => setFormData({ ...formData, talkTopic: e.target.value })}
                          className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 4: Past Speaking Experience / Video Link (optional) */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#2d2d2d] mb-2">
                        Past Speaking Experience / Video Link (optional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.speakingExperience}
                        onChange={(e) => setFormData({ ...formData, speakingExperience: e.target.value })}
                        className="w-full bg-[#F6F6F6] rounded-[8px] px-4 py-3.5 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      {submitError && (
                        <p className="text-red-500 text-xs sm:text-sm font-bold mb-3">
                          Failed to submit pitch. Please try again.
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[46px] px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Submit Pitch'}
                      </button>
                    </div>
                  </form>
                )}
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
