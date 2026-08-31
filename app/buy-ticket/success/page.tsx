'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle, CalendarPlus } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TicketCard, useTicketNumber, calendarUrl, type TicketData } from '@/components/TicketCard';

interface BookingStatus {
  paid: boolean;
  status: string;
  name: string;
  email: string;
  quantity: number;
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

/**
 * Landing page for payments that needed a full 3-D Secure redirect. Normal
 * card payments finish inside the modal and never reach this page.
 */
function SuccessContent() {
  const paymentIntent = useSearchParams().get('payment_intent');
  const [data, setData] = useState<BookingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Same polling as the modal — the webhook may not have landed yet.
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
        <p className="text-[#555]">Confirming your payment…</p>
      </Panel>
    );
  }

  if (!data.paid) {
    return (
      <Panel>
        <AlertCircle className="w-14 h-14 text-[#EE6422] mx-auto mb-5" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] mb-3">
          Payment not completed
        </h1>
        <p className="text-[#555] mb-8">
          We haven&apos;t received payment for this booking yet. If you were charged, it may still
          be processing — please check your email in a few minutes.
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
      <p className="text-[#555] text-sm sm:text-base mb-7">
        Thanks {data.name.split(' ')[0]} — your ticket is below and a copy is on its way to{' '}
        <span className="font-semibold text-[#1f1f1f]">{data.email}</span>.
      </p>

      <TicketCard data={ticketData} ticketNumber={ticketNumber} resolving={!resolved && !settled} />

      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        {calUrl && (
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] border border-[#E5D5C5] hover:bg-[#FFF8F2] text-[#4a4a4a] font-semibold text-sm transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to calendar
          </a>
        )}
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center h-12 px-8 rounded-[10px] bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-sm transition-all shadow-md"
        >
          Back to home
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
    <div className="w-full max-w-[640px] bg-[#FAF0E6] border border-[#F5E2D0] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] text-center">
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
