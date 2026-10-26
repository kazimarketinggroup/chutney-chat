'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle, CalendarPlus, Download, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TicketCard, useTicketNumber, calendarUrl, type TicketData } from '@/components/TicketCard';
import { downloadTicketPDF } from '@/lib/downloadTicketPDF';

interface GuestDetail {
  name: string;
  email?: string;
  company?: string;
  role?: string;
}

interface BookingStatus {
  paid: boolean;
  status: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  quantity: number;
  guestDetails?: GuestDetail[];
  total: string;
  ticketNumber: string;
  event: {
    title: string;
    subtitle: string | null;
    venue: string | null;
    startsAt: string;
    endsAt: string | null;
  } | null;
}

function SuccessContent() {
  const paymentIntent = useSearchParams().get('payment_intent');
  const [data, setData] = useState<BookingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Poll for the confirmed ticket number
  const { ticketNumber, resolved, settled } = useTicketNumber(
    paymentIntent,
    data?.ticketNumber || ''
  );

  useEffect(() => {
    if (!paymentIntent) {
      setError('No booking reference was provided.');
      return;
    }

    let cancelled = false;

    fetch(`/api/booking-status?payment_intent=${encodeURIComponent(paymentIntent)}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error || 'Could not load your booking.');
        setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [paymentIntent]);

  const handleDownloadPDF = async () => {
    if (!data || downloading) return;
    setDownloading(true);

    try {
      const dayText = data.event?.startsAt
        ? new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/London',
          }).format(new Date(data.event.startsAt))
        : 'Event Date TBC';

      const timeText = data.event?.startsAt
        ? new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/London',
          }).format(new Date(data.event.startsAt))
        : 'Evening';

      const guestsPayload =
        data.guestDetails && data.guestDetails.length > 0
          ? data.guestDetails
          : [{ name: data.name, email: data.email, company: data.company, role: data.role }];

      await downloadTicketPDF({
        ticketNumber: ticketNumber || data.ticketNumber,
        eventTitle: data.event?.title || 'Chutney & Chat Event',
        venue: data.event?.venue || 'Venue TBC',
        date: dayText,
        time: timeText,
        total: data.total,
        primaryBuyer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          role: data.role,
        },
        guests: guestsPayload,
        paymentRef: paymentIntent || undefined,
      });
    } catch (err) {
      console.error('Failed to generate ticket PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <Panel>
        <AlertCircle className="w-14 h-14 text-[#EE6422] mx-auto mb-5" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] mb-3">
          We couldn&apos;t load your booking
        </h1>
        <p className="text-[#555] mb-8">{error}</p>
        <HomeLinks />
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel>
        <Loader2 className="w-12 h-12 text-[#FF6600] mx-auto mb-5 animate-spin" />
        <p className="text-[#555] font-medium">Confirming your payment and generating your ticket…</p>
      </Panel>
    );
  }

  if (!data.paid) {
    return (
      <Panel>
        <AlertCircle className="w-14 h-14 text-[#EE6422] mx-auto mb-5" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] mb-3">
          Payment Processing
        </h1>
        <p className="text-[#555] mb-8 leading-relaxed">
          We haven&apos;t received payment confirmation for this booking yet. If you were charged, it may still
          be clearing with your bank — please check your email at{' '}
          <span className="font-semibold text-[#1f1f1f]">{data.email}</span> in a few moments.
        </p>
        <HomeLinks />
      </Panel>
    );
  }

  const ticketData: TicketData = {
    ticketNumber,
    quantity: data.quantity,
    total: data.total,
    name: data.name,
    email: data.email,
    event: data.event,
  };

  const calUrl = calendarUrl(ticketData, ticketNumber);

  return (
    <Panel>
      <CheckCircle2 className="w-14 h-14 text-[#22a06b] mx-auto mb-4" />
      <h1 className="text-2xl sm:text-[30px] font-bold text-[#1f1f1f] mb-2 tracking-tight">
        You&apos;re booked in!
      </h1>
      <p className="text-[#555] text-sm sm:text-base mb-6">
        Thanks {data.name.split(' ')[0]} — your official ticket is below and a confirmation copy has been sent to{' '}
        <span className="font-semibold text-[#1f1f1f]">{data.email}</span>.
      </p>

      <TicketCard data={ticketData} ticketNumber={ticketNumber} resolving={!resolved && !settled} />

      {/* Guest breakdown notice if multi-ticket booking */}
      {data.quantity > 1 && data.guestDetails && data.guestDetails.length > 1 && (
        <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#EADBCC] text-left text-xs">
          <div className="font-bold text-[#1f1f1f] mb-1">
            Registered Attendees ({data.quantity} Total):
          </div>
          <div className="text-[#555] space-y-0.5">
            <div>• Ticket #1 (Lead): {data.name}</div>
            {data.guestDetails.slice(1).map((g, i) => (
              <div key={i}>
                • Ticket #{i + 2}: {g.name || `Guest #${i + 2}`} {g.company ? `(${g.company})` : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating PDF Ticket...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </>
          )}
        </button>

        {calUrl && (
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all"
          >
            <CalendarPlus className="w-4 h-4 text-[#FF6600]" />
            Add to calendar
          </a>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all"
        >
          Home
        </Link>
      </div>
    </Panel>
  );
}

function HomeLinks() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        href="/"
        className="inline-flex items-center justify-center h-12 px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm transition-all shadow-md"
      >
        Back to home
      </Link>
      <Link
        href="/events"
        className="inline-flex items-center justify-center h-12 px-8 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#1f1f1f] font-bold text-sm transition-all"
      >
        See other events
      </Link>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[640px] bg-[#FAF0E6] border border-[#F5E2D0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] text-center">
      {children}
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="relative w-full min-h-screen bg-white text-[#2d2d2d] font-sans antialiased">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-32 min-h-screen">
        <Suspense
          fallback={
            <Panel>
              <Loader2 className="w-12 h-12 text-[#FF6600] mx-auto animate-spin" />
            </Panel>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
