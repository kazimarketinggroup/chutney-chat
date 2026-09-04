'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, CheckCircle2, Lock, ArrowLeft, CalendarPlus, Download } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { TicketCard, useTicketNumber, calendarUrl, type TicketData } from './TicketCard';
import { generateETicketHTML } from '../lib/generateETicketHTML';

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

const inputClass =
  'w-full h-11 sm:h-12 px-4 rounded-[8px] bg-[#FFF8F2] border border-[#F0E2D4] text-[#2d2d2d] text-sm sm:text-base focus:bg-white focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 focus:outline-none transition-all shadow-none disabled:opacity-60';

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

      const json = await res.json();
      if (!res.ok || !json.clientSecret) {
        throw new Error(json.error || 'Could not start checkout. Please try again.');
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

  // Stripe Elements themed to match the modal's warm cream palette.
  const elementsOptions = useMemo(
    () =>
      session
        ? {
            clientSecret: session.clientSecret,
            appearance: {
              theme: 'flat' as const,
              variables: {
                colorPrimary: '#FF6600',
                colorBackground: '#FFF8F2',
                colorText: '#2d2d2d',
                colorDanger: '#A6221D',
                fontFamily: 'inherit',
                borderRadius: '8px',
                spacingUnit: '4px',
              },
              rules: {
                '.Input': {
                  border: '1px solid #F0E2D4',
                  boxShadow: 'none',
                  padding: '12px 16px',
                },
                '.Input:focus': {
                  border: '1px solid #FF6600',
                  boxShadow: '0 0 0 2px rgba(255,102,0,0.2)',
                  backgroundColor: '#ffffff',
                },
                '.Label': {
                  fontWeight: '500',
                  color: '#4a4a4a',
                  marginBottom: '6px',
                },
                '.Tab': { border: '1px solid #F0E2D4', boxShadow: 'none' },
                '.Tab--selected': {
                  border: '1px solid #FF6600',
                  backgroundColor: '#ffffff',
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Ambient Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[920px] max-h-[88vh] overflow-y-auto bg-[#FAF0E6] border border-[#F5E2D0] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] text-left my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              type="button"
              disabled={submitting}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555555] hover:text-black transition-colors disabled:opacity-40 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
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
                {/* Header */}
                <div className="mb-4 sm:mb-6 pr-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] tracking-tight leading-snug">
                    {eventDetails.title}
                  </h2>
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <StepDot active={step === 'details'} done={step === 'payment'} label="1" />
                    <div
                      className={`h-[2px] w-10 rounded transition-colors ${
                        step === 'payment' ? 'bg-[#FF6600]' : 'bg-[#E8D5C4]'
                      }`}
                    />
                    <StepDot active={step === 'payment'} done={false} label="2" />
                    <span className="ml-2 text-xs sm:text-sm text-[#7a7a7a] font-medium">
                      {step === 'details' ? 'Your details' : 'Payment'}
                    </span>
                  </div>
                </div>

                {/* ---------- STEP 1: DETAILS ---------- */}
                {step === 'details' && (
                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    {/* Primary Buyer Row 1: Name | Phone | Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label htmlFor="modal-name" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Full Name *
                        </label>
                        <input
                          id="modal-name"
                          type="text"
                          name="name"
                          required
                          disabled={submitting}
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-phone" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Phone
                        </label>
                        <input
                          id="modal-phone"
                          type="tel"
                          name="phone"
                          disabled={submitting}
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-email" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Email *
                        </label>
                        <input
                          id="modal-email"
                          type="email"
                          name="email"
                          required
                          disabled={submitting}
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Primary Buyer Row 2: Company | Role | Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label htmlFor="modal-company" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Company (Optional)
                        </label>
                        <input
                          id="modal-company"
                          type="text"
                          name="company"
                          disabled={submitting}
                          value={formData.company}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-role" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Role (Optional)
                        </label>
                        <input
                          id="modal-role"
                          type="text"
                          name="role"
                          disabled={submitting}
                          value={formData.role}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-quantity" className="block text-xs font-semibold text-[#4a4a4a] mb-1">
                          Tickets
                        </label>
                        <select
                          id="modal-quantity"
                          name="quantity"
                          disabled={submitting}
                          value={formData.quantity}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'ticket' : 'tickets'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* ---------- DYNAMIC GUEST RECIPIENTS SECTION ---------- */}
                    {formData.quantity > 1 && (
                      <div className="space-y-3 pt-3 border-t border-[#E8D5C4]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f]">
                              Guest Recipient Details
                            </h3>
                            <p className="text-xs text-[#666]">
                              Provide recipient info for each guest to send individual E-Tickets.
                            </p>
                          </div>
                        </div>

                        {Array.from({ length: formData.quantity - 1 }).map((_, idx) => {
                          const guestIndex = idx + 1;
                          const currentGuest = guests[guestIndex] || { name: '', email: '', company: '', role: '' };
                          return (
                            <div
                              key={guestIndex}
                              className="p-3.5 sm:p-4 rounded-[14px] bg-[#FFF8F2] border border-[#F0E2D4] space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6600]">
                                  Guest #{guestIndex + 1} Recipient
                                </span>
                                <span className="text-[11px] text-[#888]">Ticket #{guestIndex + 1}</span>
                              </div>

                              {/* 3-Column Horizontal Grid for Guest Details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label
                                    htmlFor={`guest-name-${guestIndex}`}
                                    className="block text-[11px] font-semibold text-[#4a4a4a] mb-1"
                                  >
                                    Guest Name *
                                  </label>
                                  <input
                                    id={`guest-name-${guestIndex}`}
                                    type="text"
                                    required
                                    disabled={submitting}
                                    placeholder={`Full name`}
                                    value={currentGuest.name}
                                    onChange={(e) => handleGuestChange(guestIndex, 'name', e.target.value)}
                                    className={inputClass}
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor={`guest-email-${guestIndex}`}
                                    className="block text-[11px] font-semibold text-[#4a4a4a] mb-1"
                                  >
                                    Guest Email
                                  </label>
                                  <input
                                    id={`guest-email-${guestIndex}`}
                                    type="email"
                                    disabled={submitting}
                                    placeholder="Default: Primary email"
                                    value={currentGuest.email}
                                    onChange={(e) => handleGuestChange(guestIndex, 'email', e.target.value)}
                                    className={inputClass}
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor={`guest-role-${guestIndex}`}
                                    className="block text-[11px] font-semibold text-[#4a4a4a] mb-1"
                                  >
                                    Role / Company
                                  </label>
                                  <input
                                    id={`guest-role-${guestIndex}`}
                                    type="text"
                                    disabled={submitting}
                                    placeholder="Optional"
                                    value={currentGuest.role}
                                    onChange={(e) => handleGuestChange(guestIndex, 'role', e.target.value)}
                                    className={inputClass}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {error && <ErrorBox message={error} />}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Preparing payment…
                          </>
                        ) : (
                          <>Continue to payment</>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ---------- STEP 2: PAYMENT ---------- */}
                {step === 'payment' && session && elementsOptions && (
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <PaymentStep
                      session={session}
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

  const handleDownloadTicket = () => {
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

    const guestList = guests && guests.length > 0
      ? guests
      : [{ name: formData.name, email: formData.email, company: formData.company, role: formData.role }];

    const html = generateETicketHTML({
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

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
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
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all shadow-sm hover:shadow"
        >
          <Download className="w-4 h-4 text-[#FF6600]" />
          Download ticket
        </button>
        {calUrl && (
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to calendar
          </a>
        )}
        <button
          onClick={onClose}
          className="flex-1 h-11 sm:h-12 px-6 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
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
  onPaid,
  onBack,
  submitting,
  setSubmitting,
}: {
  session: PaymentSession;
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

  return (
    <form onSubmit={handlePay} className="space-y-5">
      {/* Amount summary */}
      <div className="flex items-center justify-between bg-[#FFF8F2] border border-[#F0E2D4] rounded-[12px] px-5 py-4">
        <span className="text-sm text-[#666]">Amount due</span>
        <span className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
          {formatPence(session.amountPence, session.currency)}
        </span>
      </div>

      {/* Stripe's card / wallet form */}
      <div className="min-h-[160px]">
        {!ready && (
          <div className="flex items-center justify-center h-[160px] text-[#999]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <PaymentElement
          onReady={() => setReady(true)}
          options={{ layout: 'tabs' }}
        />
      </div>

      {error && <ErrorBox message={error} />}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-1.5 h-11 sm:h-12 px-5 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={!stripe || !ready || submitting}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>Pay {formatPence(session.amountPence, session.currency)}</>
          )}
        </button>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-[#8a8a8a] pt-1">
        <Lock className="w-3 h-3" />
        Secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
        active || done ? 'bg-[#FF6600] text-white' : 'bg-[#E8D5C4] text-[#8a7a6a]'
      }`}
    >
      {done ? '✓' : label}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[10px] bg-[#FDECEA] border border-[#F5C6C1] px-4 py-3 text-sm text-[#A6221D]">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  mono,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#777]">{label}</span>
      <span className={`${bold ? 'font-bold' : ''} ${mono ? 'font-mono' : ''} text-[#1f1f1f]`}>
        {value}
      </span>
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
