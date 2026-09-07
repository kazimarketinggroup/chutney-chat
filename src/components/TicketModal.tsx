'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Download,
  Ticket,
  ShieldCheck,
  Sparkles,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Check,
  CreditCard,
  Receipt,
  Users,
  ChevronDown,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { TicketCard, useTicketNumber, calendarUrl, type TicketData } from './TicketCard';
import { generateETicketHTML } from '../lib/generateETicketHTML';
import { downloadTicketPDF } from '../lib/downloadTicketPDF';

export interface TicketEventDetails {
  /** Matches events.slug in Supabase — this is what the server prices. */
  eventSlug: string;
  title: string;
  /** Display only. The real amount charged always comes from the database. */
  price: string;
}

interface TicketModalContextType {
  isOpen: boolean;
  eventDetails: TicketEventDetails;
  openModal: (details?: Partial<TicketEventDetails>) => void;
  closeModal: () => void;
}

const defaultEventDetails: TicketEventDetails = {
  eventSlug: 'business-networking-evening',
  title: 'Tuesday 29th September 2026 - Tipu Sultan Leicester',
  price: '£35.00',
};

const TicketModalContext = createContext<TicketModalContextType>({
  isOpen: false,
  eventDetails: defaultEventDetails,
  openModal: () => {},
  closeModal: () => {},
});

export const useTicketModal = () => useContext(TicketModalContext);

/**
 * Loaded once at module scope, as Stripe recommends — calling loadStripe on
 * every render would refetch their script each time.
 */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export function TicketModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<TicketEventDetails>(defaultEventDetails);

  const openModal = (details?: Partial<TicketEventDetails>) => {
    setEventDetails({
      eventSlug: details?.eventSlug || defaultEventDetails.eventSlug,
      title: details?.title || defaultEventDetails.title,
      price: details?.price || defaultEventDetails.price,
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <TicketModalContext.Provider value={{ isOpen, eventDetails, openModal, closeModal }}>
      {children}
      <TicketModal />
    </TicketModalContext.Provider>
  );
}

type Step = 'details' | 'payment' | 'done';

interface PaymentSession {
  clientSecret: string;
  bookingId: string;
  amountPence: number;
  currency: string;
}

interface GuestState {
  name: string;
  email: string;
  company: string;
  role: string;
}

const EMPTY_FORM = { name: '', phone: '', email: '', company: '', role: '', quantity: 1 };

export function TicketModal() {
  const { isOpen, eventDetails, closeModal } = useTicketModal();

  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [guests, setGuests] = useState<GuestState[]>([]);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set once payment succeeds; the ticket view polls this for the real number.
  const [paidIntentId, setPaidIntentId] = useState<string | null>(null);
  const [fallbackTicketNumber, setFallbackTicketNumber] = useState('');

  // Sync guests array when quantity or primary buyer changes
  useEffect(() => {
    setGuests((prev) => {
      const targetLength = formData.quantity;
      const next: GuestState[] = [];
      for (let i = 0; i < targetLength; i++) {
        if (i === 0) {
          next.push({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            role: formData.role,
          });
        } else if (prev[i]) {
          next.push(prev[i]);
        } else {
          next.push({ name: '', email: '', company: '', role: '' });
        }
      }
      return next;
    });
  }, [formData.quantity, formData.name, formData.email, formData.company, formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleGuestChange = (index: number, field: keyof GuestState, value: string) => {
    setGuests((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const resetAll = () => {
    setStep('details');
    setFormData(EMPTY_FORM);
    setGuests([]);
    setSession(null);
    setSubmitting(false);
    setError(null);
    setPaidIntentId(null);
    setFallbackTicketNumber('');
  };

  const handleClose = () => {
    if (submitting) return; // never close mid-payment
    closeModal();
    // Let the exit animation finish before wiping the contents.
    setTimeout(resetAll, 250);
  };

  // Safe pricing calculation for real-time order summary display
  const unitPrice = useMemo(() => {
    const match = eventDetails.price.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 35.0;
  }, [eventDetails.price]);

  const currencySymbol = useMemo(() => {
    const match = eventDetails.price.match(/^[^\d]+/);
    return match ? match[0].trim() : '£';
  }, [eventDetails.price]);

  const calculatedSubtotal = useMemo(() => {
    return (unitPrice * formData.quantity).toFixed(2);
  }, [unitPrice, formData.quantity]);

  // Parse title into date and venue if separated by hyphen for premium badges
  const parsedEvent = useMemo(() => {
    const parts = eventDetails.title.split(' - ');
    if (parts.length >= 2) {
      return {
        date: parts[0].trim(),
        venue: parts.slice(1).join(' - ').trim(),
        title: eventDetails.title,
      };
    }
    return {
      date: null,
      venue: null,
      title: eventDetails.title,
    };
  }, [eventDetails.title]);

  /** Step 1 → create the booking + PaymentIntent, then show the card form. */
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: eventDetails.eventSlug,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          role: formData.role,
          quantity: formData.quantity,
          guests,
        }),
      });

      let json: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        throw new Error('Unable to start checkout right now. Please try again.');
      }

      if (!res.ok || !json?.clientSecret) {
        throw new Error(json?.error || 'Could not start checkout. Please try again.');
      }

      setSession(json);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaid = (intentId: string | null, fallback: string) => {
    setPaidIntentId(intentId);
    setFallbackTicketNumber(fallback);
    setStep('done');
  };

  // Stripe Elements themed to match the modal's warm cream & brand orange palette.
  const elementsOptions = useMemo(
    () =>
      session
        ? {
            clientSecret: session.clientSecret,
            appearance: {
              theme: 'flat' as const,
              variables: {
                colorPrimary: '#FF6600',
                colorBackground: '#FFFDFB',
                colorText: '#1F1F1F',
                colorDanger: '#DC2626',
                fontFamily: 'inherit',
                borderRadius: '12px',
                spacingUnit: '4.5px',
              },
              rules: {
                '.Input': {
                  border: '1.5px solid #E8DDD2',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  padding: '13px 16px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '15px',
                },
                '.Input:focus': {
                  border: '1.5px solid #FF6600',
                  boxShadow: '0 0 0 3px rgba(255,102,0,0.18)',
                  backgroundColor: '#ffffff',
                },
                '.Label': {
                  fontWeight: '600',
                  color: '#403934',
                  fontSize: '13px',
                  marginBottom: '6px',
                },
                '.Tab': {
                  border: '1.5px solid #E8DDD2',
                  boxShadow: 'none',
                  backgroundColor: '#FFF8F2',
                },
                '.Tab--selected': {
                  border: '1.5px solid #FF6600',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(255,102,0,0.12)',
                },
              },
            },
          }
        : null,
    [session]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Ambient Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-[980px] max-h-[94vh] overflow-y-auto modal-smooth-scroll bg-[#FAF3EC] border border-[#EADBCC] rounded-[22px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] text-left my-auto"
          >
            {/* Elegant Close Button */}
            <button
              onClick={handleClose}
              type="button"
              disabled={submitting}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555555] hover:text-[#111] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* ---------- STEP 3: SUCCESS — the ticket ---------- */}
            {step === 'done' ? (
              <SuccessStep
                paymentIntentId={paidIntentId}
                fallbackNumber={fallbackTicketNumber}
                formData={formData}
                guests={guests}
                eventTitle={eventDetails.title}
                amountPence={session?.amountPence}
                currency={session?.currency}
                onClose={handleClose}
              />
            ) : (
              <>
                {/* ---------- COMPACT TOP HEADER & BRANDING ---------- */}
                <div className="mb-3.5 sm:mb-4 pr-10">
                  {/* Category Pill & Venue Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE8D6] border border-[#FFD0B0] text-[#D94F00] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#FF6600]" />
                      Official Event Pass
                    </span>
                    {parsedEvent.date && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7F0] border border-[#EEDBCA] text-[#63574D] text-[10px] sm:text-[11px] font-medium">
                        <Calendar className="w-3 h-3 text-[#FF6600]" />
                        {parsedEvent.date}
                      </span>
                    )}
                    {parsedEvent.venue && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7F0] border border-[#EEDBCA] text-[#63574D] text-[10px] sm:text-[11px] font-medium">
                        <MapPin className="w-3 h-3 text-[#FF6600]" />
                        {parsedEvent.venue}
                      </span>
                    )}
                  </div>

                  {/* Main Event Title */}
                  <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1a1a1a] tracking-tight leading-snug">
                    {parsedEvent.title}
                  </h2>

                  {/* Compact Stepper */}
                  <div className="mt-2.5">
                    <CheckoutStepper step={step} />
                  </div>
                </div>

                {/* ---------- STEP 1: DETAILS ---------- */}
                {step === 'details' && (
                  <form onSubmit={handleDetailsSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                      {/* Left Column: Form Cards (7 cols on lg) */}
                      <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
                        
                        {/* 1. Ticket Quantity Bar */}
                        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-[14px] bg-[#FFFDFB] border border-[#E8DCD0] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#FFF0E2] text-[#FF6600] flex items-center justify-center shrink-0">
                              <Ticket className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-[#1F1F1F] leading-tight">
                                Standard Admission • {eventDetails.price}
                              </div>
                              <div className="text-[10px] sm:text-[11px] text-[#73685E]">
                                3-Course Balti Meal & Networking Included
                              </div>
                            </div>
                          </div>

                          <div className="relative w-32 sm:w-36 shrink-0">
                            <select
                              id="modal-quantity"
                              name="quantity"
                              disabled={submitting}
                              value={formData.quantity}
                              onChange={handleChange}
                              className="w-full h-8 sm:h-9 px-2.5 pr-8 appearance-none rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] text-xs font-semibold focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 cursor-pointer disabled:opacity-60"
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'ticket' : 'tickets'} ({currencySymbol}
                                  {(unitPrice * n).toFixed(0)})
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#73685E]">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* 2. Primary Attendee (Ticket #1) Card */}
                        <div className="p-3 sm:p-3.5 rounded-[16px] bg-[#FFFDFB] border border-[#E8DCD0] shadow-[0_1px_4px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#F2E7DC]">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#FF6600] text-white text-[10px] font-bold uppercase tracking-wider">
                                Ticket #1
                              </span>
                              <h3 className="text-xs sm:text-sm font-bold text-[#1F1F1F]">
                                Lead Attendee & Contact
                              </h3>
                            </div>
                            <span className="text-[10px] font-medium text-[#8C7E72] hidden sm:inline">
                              Tickets sent to this email
                            </span>
                          </div>

                          {/* Row 1: Name & Email */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label htmlFor="modal-name" className="block text-[11px] font-semibold text-[#403934] mb-1">
                                Full Name <span className="text-[#FF6600]">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80] pointer-events-none">
                                  <User className="w-3.5 h-3.5" />
                                </div>
                                <input
                                  id="modal-name"
                                  type="text"
                                  name="name"
                                  required
                                  autoComplete="name"
                                  placeholder="Alex Morgan"
                                  disabled={submitting}
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full h-9 sm:h-9.5 pl-8 pr-3 rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs sm:text-sm font-medium focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="modal-email" className="block text-[11px] font-semibold text-[#403934] mb-1">
                                Email Address <span className="text-[#FF6600]">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80] pointer-events-none">
                                  <Mail className="w-3.5 h-3.5" />
                                </div>
                                <input
                                  id="modal-email"
                                  type="email"
                                  name="email"
                                  required
                                  autoComplete="email"
                                  placeholder="alex@company.com"
                                  disabled={submitting}
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="w-full h-9 sm:h-9.5 pl-8 pr-3 rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs sm:text-sm font-medium focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Phone, Company, Role */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label htmlFor="modal-phone" className="block text-[11px] font-semibold text-[#403934] mb-1">
                                Phone <span className="text-[#8C7E72] font-normal">(Optional)</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80] pointer-events-none">
                                  <Phone className="w-3.5 h-3.5" />
                                </div>
                                <input
                                  id="modal-phone"
                                  type="tel"
                                  name="phone"
                                  autoComplete="tel"
                                  placeholder="+44 7123 456789"
                                  disabled={submitting}
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="w-full h-9 sm:h-9.5 pl-8 pr-3 rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs sm:text-sm font-medium focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="modal-company" className="block text-[11px] font-semibold text-[#403934] mb-1">
                                Company <span className="text-[#8C7E72] font-normal">(Optional)</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80] pointer-events-none">
                                  <Building2 className="w-3.5 h-3.5" />
                                </div>
                                <input
                                  id="modal-company"
                                  type="text"
                                  name="company"
                                  autoComplete="organization"
                                  placeholder="Acme Ltd"
                                  disabled={submitting}
                                  value={formData.company}
                                  onChange={handleChange}
                                  className="w-full h-9 sm:h-9.5 pl-8 pr-3 rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs sm:text-sm font-medium focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="modal-role" className="block text-[11px] font-semibold text-[#403934] mb-1">
                                Job Role <span className="text-[#8C7E72] font-normal">(Optional)</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8D80] pointer-events-none">
                                  <Briefcase className="w-3.5 h-3.5" />
                                </div>
                                <input
                                  id="modal-role"
                                  type="text"
                                  name="role"
                                  autoComplete="organization-title"
                                  placeholder="Director"
                                  disabled={submitting}
                                  value={formData.role}
                                  onChange={handleChange}
                                  className="w-full h-9 sm:h-9.5 pl-8 pr-3 rounded-[9px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs sm:text-sm font-medium focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Dynamic Guest Recipients Section */}
                        {formData.quantity > 1 && (
                          <div className="space-y-2.5 pt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#FF6600]" />
                                <h3 className="text-xs sm:text-sm font-bold text-[#1F1F1F]">
                                  Additional Guest Passes ({formData.quantity - 1})
                                </h3>
                              </div>
                              <span className="text-[10px] text-[#8C7E72]">
                                Emails optional (defaults to lead booker)
                              </span>
                            </div>

                            <div className="space-y-2">
                              {Array.from({ length: formData.quantity - 1 }).map((_, idx) => {
                                const guestIndex = idx + 1;
                                const currentGuest =
                                  guests[guestIndex] || { name: '', email: '', company: '', role: '' };
                                return (
                                  <motion.div
                                    key={guestIndex}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="p-2.5 sm:p-3 rounded-[14px] bg-[#FFFDFB] border border-[#E8DCD0] shadow-[0_1px_4px_rgba(0,0,0,0.02)] space-y-2"
                                  >
                                    <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 rounded bg-[#FFF0E2] text-[#FF6600] font-bold text-[10px] tracking-wide uppercase">
                                          Guest #{guestIndex + 1}
                                        </span>
                                        <span className="text-[11px] font-semibold text-[#403934]">
                                          Attendee Details
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-[#8C7E72]">
                                        Ticket #{guestIndex + 1}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <div>
                                        <label
                                          htmlFor={`guest-name-${guestIndex}`}
                                          className="block text-[10px] font-semibold text-[#403934] mb-0.5"
                                        >
                                          Guest Name <span className="text-[#FF6600]">*</span>
                                        </label>
                                        <input
                                          id={`guest-name-${guestIndex}`}
                                          type="text"
                                          required
                                          disabled={submitting}
                                          placeholder="Full name"
                                          value={currentGuest.name}
                                          onChange={(e) =>
                                            handleGuestChange(guestIndex, 'name', e.target.value)
                                          }
                                          className="w-full h-8 sm:h-8.5 px-2.5 rounded-[8px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                        />
                                      </div>

                                      <div>
                                        <label
                                          htmlFor={`guest-email-${guestIndex}`}
                                          className="block text-[10px] font-semibold text-[#403934] mb-0.5"
                                        >
                                          Guest Email <span className="text-[#8C7E72] font-normal">(Optional)</span>
                                        </label>
                                        <input
                                          id={`guest-email-${guestIndex}`}
                                          type="email"
                                          disabled={submitting}
                                          placeholder="Direct ticket delivery"
                                          value={currentGuest.email}
                                          onChange={(e) =>
                                            handleGuestChange(guestIndex, 'email', e.target.value)
                                          }
                                          className="w-full h-8 sm:h-8.5 px-2.5 rounded-[8px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                        />
                                      </div>

                                      <div>
                                        <label
                                          htmlFor={`guest-role-${guestIndex}`}
                                          className="block text-[10px] font-semibold text-[#403934] mb-0.5"
                                        >
                                          Role / Company <span className="text-[#8C7E72] font-normal">(Optional)</span>
                                        </label>
                                        <input
                                          id={`guest-role-${guestIndex}`}
                                          type="text"
                                          disabled={submitting}
                                          placeholder="e.g. Partner"
                                          value={currentGuest.role}
                                          onChange={(e) =>
                                            handleGuestChange(guestIndex, 'role', e.target.value)
                                          }
                                          className="w-full h-8 sm:h-8.5 px-2.5 rounded-[8px] bg-white border border-[#DDD0C2] text-[#1F1F1F] placeholder:text-[#A89A8A] text-xs focus:border-[#FF6600] outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 disabled:opacity-60"
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {error && <ErrorBox message={error} />}
                      </div>

                      {/* Right Column: Order Summary & Checkout Action (5 cols on lg) */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="rounded-[18px] bg-[#FFFDFB] border border-[#E8DCD0] p-4 sm:p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3.5">
                          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2E7DC]">
                            <div className="flex items-center gap-1.5">
                              <Receipt className="w-3.5 h-3.5 text-[#FF6600]" />
                              <h3 className="text-sm sm:text-base font-bold text-[#1F1F1F]">
                                Order Summary
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#22A06B] bg-[#EAF7EE] px-2 py-0.5 rounded-full">
                              Instant Delivery
                            </span>
                          </div>

                          {/* Itemized Breakdown */}
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-[#403934]">
                              <span>Standard Ticket × {formData.quantity}</span>
                              <span className="font-semibold text-[#1F1F1F]">
                                {currencySymbol}{calculatedSubtotal}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[#403934]">
                              <span>3-Course Balti Meal</span>
                              <span className="text-[#22A06B] font-medium">Included</span>
                            </div>

                            <div className="flex items-center justify-between text-[#403934]">
                              <span>Booking & Service Fee</span>
                              <span className="text-[#22A06B] font-medium">Free</span>
                            </div>

                            <div className="flex items-center justify-between text-[#403934]">
                              <span>Taxes (VAT)</span>
                              <span className="text-[#666]">Included</span>
                            </div>

                            {/* Total Line */}
                            <div className="pt-2.5 border-t border-[#F2E7DC] flex items-baseline justify-between">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73685E] block">
                                  Total Due
                                </span>
                                <span className="text-[10px] text-[#8C7E72]">
                                  {formData.quantity} {formData.quantity === 1 ? 'attendee pass' : 'attendee passes'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xl sm:text-2xl font-extrabold text-[#FF6600] tracking-tight">
                                  {currencySymbol}{calculatedSubtotal}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="pt-1">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[11px] bg-gradient-to-r from-[#FF6600] to-[#F25A00] hover:from-[#E55C00] hover:to-[#DE4F00] text-white font-bold text-sm transition-all shadow-[0_3px_12px_rgba(255,102,0,0.3)] hover:shadow-[0_5px_18px_rgba(255,102,0,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Securing booking…</span>
                                </>
                              ) : (
                                <>
                                  <span>Continue to payment</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>

                          {/* Trust Badges */}
                          <div className="pt-1.5 border-t border-[#F2E7DC] space-y-1 text-[10px] text-[#73685E]">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#22A06B] shrink-0" />
                              <span>256-bit SSL encrypted & secure checkout</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                              <span>Official Stripe verified payment gateway</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* ---------- STEP 2: PAYMENT ---------- */}
                {step === 'payment' && session && elementsOptions && (
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <PaymentStep
                      session={session}
                      eventTitle={eventDetails.title}
                      quantity={formData.quantity}
                      buyerName={formData.name}
                      buyerEmail={formData.email}
                      onPaid={handlePaid}
                      onBack={() => {
                        setError(null);
                        setStep('details');
                      }}
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                    />
                  </Elements>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Checkout Stepper Component:
 * Clean dual-step breadcrumb progress bar showing 01 Your Details → 02 Payment.
 */
function CheckoutStepper({ step }: { step: Step }) {
  const isDetails = step === 'details';
  const isPayment = step === 'payment';
  const isDone = step === 'done';

  return (
    <div className="flex items-center gap-2 sm:gap-3 py-1 border-b border-[#EADBCC] mb-3">
      {/* Step 1 */}
      <div className={`flex items-center gap-2 transition-all ${isDetails ? 'opacity-100' : 'opacity-85'}`}>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-xs ${
            isDetails
              ? 'bg-[#FF6600] text-white ring-3 ring-[#FF6600]/15'
              : 'bg-[#22A06B] text-white'
          }`}
        >
          {isDetails ? '1' : <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
        <div>
          <span className="text-xs sm:text-sm font-bold text-[#1F1F1F] block leading-tight">
            1. Your Details
          </span>
        </div>
      </div>

      {/* Progress Connector */}
      <div className="flex-1 max-w-[40px] sm:max-w-[60px] h-[2px] rounded-full bg-[#DDD0C2] relative overflow-hidden mx-1">
        <div
          className={`h-full bg-[#FF6600] transition-all duration-300 ${
            isPayment || isDone ? 'w-full' : 'w-0'
          }`}
        />
      </div>

      {/* Step 2 */}
      <div
        className={`flex items-center gap-2 transition-all ${
          isPayment ? 'opacity-100' : isDone ? 'opacity-85' : 'opacity-55'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-xs ${
            isPayment
              ? 'bg-[#FF6600] text-white ring-3 ring-[#FF6600]/15'
              : isDone
              ? 'bg-[#22A06B] text-white'
              : 'bg-[#DDD0C2] text-[#7A6A5A]'
          }`}
        >
          {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '2'}
        </div>
        <div>
          <span className="text-xs sm:text-sm font-bold text-[#1F1F1F] block leading-tight">
            2. Payment
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Post-payment view: the ticket itself.
 *
 * Kept as its own component so the polling hook mounts only once payment has
 * actually succeeded, rather than running for the whole life of the modal.
 */
function SuccessStep({
  paymentIntentId,
  fallbackNumber,
  formData,
  guests,
  eventTitle,
  amountPence,
  currency,
  onClose,
}: {
  paymentIntentId: string | null;
  fallbackNumber: string;
  formData: typeof EMPTY_FORM;
  guests?: Array<{ name: string; email: string; company: string; role: string }>;
  eventTitle: string;
  amountPence?: number;
  currency?: string;
  onClose: () => void;
}) {
  const { ticketNumber, resolved, settled } = useTicketNumber(paymentIntentId, fallbackNumber);
  const [details, setDetails] = useState<TicketData['event']>(null);

  // Pull the venue/date off the booking record so the on-screen ticket shows
  // the same information as the emailed one.
  useEffect(() => {
    if (!paymentIntentId) return;
    let cancelled = false;
    fetch(`/api/booking-status?payment_intent=${encodeURIComponent(paymentIntentId)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.event) setDetails(j.event);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [paymentIntentId]);

  const ticketData: TicketData = {
    ticketNumber,
    quantity: formData.quantity,
    total: formatPence(amountPence, currency),
    name: formData.name,
    email: formData.email,
    event: details || { title: eventTitle, venue: null, startsAt: '' },
  };

  const calUrl = details ? calendarUrl(ticketData, ticketNumber) : null;
  const [downloading, setDownloading] = useState(false);

  const handleDownloadTicket = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const dayText = details?.startsAt
        ? new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/London',
          }).format(new Date(details.startsAt))
        : 'Wednesday 9th September 2026';

      const timeText = details?.startsAt ? '6:30pm – 9:30pm' : '6:30pm – 9:30pm';

      const guestList =
        guests && guests.length > 0
          ? guests
          : [{ name: formData.name, email: formData.email, company: formData.company, role: formData.role }];

      await downloadTicketPDF({
        ticketNumber,
        eventTitle: details?.title || eventTitle,
        venue: details?.venue || 'The Farmhouse, Coventry',
        date: dayText,
        time: timeText,
        total: formatPence(amountPence, currency),
        primaryBuyer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          role: formData.role,
        },
        guests: guestList,
        paymentRef: paymentIntentId || undefined,
      });
    } catch (err) {
      console.error('Failed to generate ticket PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 260 }}
        >
          <CheckCircle2 className="w-14 h-14 text-[#22a06b] mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#1f1f1f] mb-2 tracking-tight">
          You&apos;re booked in!
        </h2>
        <p className="text-[#555] text-sm sm:text-base">
          Thanks {formData.name.split(' ')[0] || 'there'} — your ticket is below and a copy is on
          its way to <span className="font-semibold text-[#1f1f1f]">{formData.email}</span>.
        </p>
      </div>

      <TicketCard data={ticketData} ticketNumber={ticketNumber} resolving={!resolved && !settled} />

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleDownloadTicket}
          disabled={downloading}
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-[12px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 text-[#FF6600] animate-spin" />
              <span>Downloading PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#FF6600]" />
              <span>Download ticket</span>
            </>
          )}
        </button>
        {calUrl && (
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-[12px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to calendar
          </a>
        )}
        <button
          onClick={onClose}
          className="flex-1 h-11 sm:h-12 px-6 rounded-[12px] bg-gradient-to-r from-[#FF6600] to-[#F25A00] hover:from-[#E55C00] hover:to-[#DE4F00] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/** The card form itself — must live inside <Elements> to use the Stripe hooks. */
function PaymentStep({
  session,
  eventTitle,
  quantity,
  buyerName,
  buyerEmail,
  onPaid,
  onBack,
  submitting,
  setSubmitting,
}: {
  session: PaymentSession;
  eventTitle: string;
  quantity: number;
  buyerName: string;
  buyerEmail: string;
  onPaid: (intentId: string | null, fallback: string) => void;
  onBack: () => void;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setError(null);

    // redirect: 'if_required' keeps the user in the modal for normal cards and
    // only leaves the page when the bank demands a full 3-D Secure redirect.
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/buy-ticket/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Your payment could not be completed.');
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      // 'processing' is rare for cards; the webhook still confirms and emails.
      // The real ticket number is assigned by the database when the webhook
      // lands, so hand over the intent id and let the ticket view poll for it.
      onPaid(paymentIntent.id, `CC-${session.bookingId.slice(0, 8).toUpperCase()}`);
      setSubmitting(false);
      return;
    }

    setError('Payment was not completed. Please try again.');
    setSubmitting(false);
  };

  const totalFormatted = formatPence(session.amountPence, session.currency);

  return (
    <form onSubmit={handlePay}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Stripe Card & Wallet Form */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 sm:p-4.5 rounded-[18px] bg-[#FFFDFB] border border-[#E8DCD0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2E7DC]">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#FF6600]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1F1F]">
                  Payment Method
                </h3>
              </div>
              <span className="text-[10px] font-medium text-[#8C7E72] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#22A06B]" /> 256-Bit Encrypted
              </span>
            </div>

            {/* Stripe's card / wallet form */}
            <div className="min-h-[160px]">
              {!ready && (
                <div className="flex flex-col items-center justify-center h-[160px] text-[#8C7E72] gap-1.5">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF6600]" />
                  <span className="text-xs">Loading secure payment options…</span>
                </div>
              )}
              <PaymentElement
                onReady={() => setReady(true)}
                options={{ layout: 'tabs' }}
              />
            </div>

            {error && <ErrorBox message={error} />}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2.5 pt-2 border-t border-[#F2E7DC]">
              <button
                type="button"
                onClick={onBack}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[10px] border border-[#DDD0C2] hover:bg-[#FFF8F2] text-[#403934] font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Details</span>
              </button>

              <button
                type="submit"
                disabled={!stripe || !ready || submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 sm:h-10.5 px-6 rounded-[10px] bg-gradient-to-r from-[#FF6600] to-[#F25A00] hover:from-[#E55C00] hover:to-[#DE4F00] text-white font-bold text-xs sm:text-sm transition-all shadow-[0_3px_12px_rgba(255,102,0,0.3)] hover:shadow-[0_5px_18px_rgba(255,102,0,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing payment…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {totalFormatted}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[10px] text-[#73685E]">
            <ShieldCheck className="w-3 h-3 text-[#22A06B]" />
            Secured by Stripe. Your card numbers never touch our servers.
          </p>
        </div>

        {/* Right Column: Order Summary Recap */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-[18px] bg-[#FFFDFB] border border-[#E8DCD0] p-4 sm:p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2E7DC]">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#FF6600]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1F1F]">
                  Booking Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C7E72]">
                Ref: {session.bookingId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="bg-[#FAF3EC] rounded-[10px] p-2.5 border border-[#EADBCC] text-[11px] space-y-0.5">
              <div className="font-bold text-[#1F1F1F] text-xs leading-snug">
                {eventTitle}
              </div>
              <div className="text-[#73685E]">
                Lead Booker: <span className="font-semibold text-[#1F1F1F]">{buyerName}</span>
              </div>
              <div className="text-[#73685E]">
                Tickets sent to: <span className="font-semibold text-[#1F1F1F]">{buyerEmail}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#403934]">
                <span>Total Attendees</span>
                <span className="font-semibold text-[#1F1F1F]">
                  {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#403934]">
                <span>Dining & Networking</span>
                <span className="text-[#22A06B] font-medium">Included</span>
              </div>

              <div className="flex items-center justify-between text-[#403934]">
                <span>Processing Fees</span>
                <span className="text-[#22A06B] font-medium">Free</span>
              </div>

              <div className="pt-2 border-t border-[#F2E7DC] flex items-baseline justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73685E]">
                  Amount Due
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#FF6600] tracking-tight">
                  {totalFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[12px] bg-[#FEF2F2] border border-[#FCA5A5] px-4 py-3 text-sm text-[#991B1B]">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
      <span className="font-medium">{message}</span>
    </div>
  );
}

function formatPence(pence?: number, currency = 'gbp'): string {
  if (pence === undefined) return '';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: (currency || 'gbp').toUpperCase(),
  }).format(pence / 100);
}

