'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Loader2, Check, Copy } from 'lucide-react';

export interface TicketData {
  ticketNumber: string;
  quantity: number;
  total: string;
  name: string;
  email: string;
  event: {
    title: string;
    subtitle?: string | null;
    venue: string | null;
    startsAt: string;
    endsAt?: string | null;
  } | null;
}

/**
 * The on-screen ticket shown after a successful payment.
 *
 * The ticket number is assigned by the database when the Stripe webhook marks
 * the booking paid, which can land a moment after the browser finishes
 * confirming. So this polls briefly for the real number rather than showing a
 * placeholder that later changes under the user.
 */
export function useTicketNumber(paymentIntentId: string | null, fallback: string) {
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!paymentIntentId) {
      setSettled(true);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 8; // ~12s total

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(
          `/api/booking-status?payment_intent=${encodeURIComponent(paymentIntentId)}`
        );
        const json = await res.json();
        if (cancelled) return;

        // Only accept a number once the webhook has actually marked it paid;
        // before that the API returns the UUID-derived fallback.
        if (res.ok && json.status === 'paid' && json.ticketNumber) {
          setTicketNumber(json.ticketNumber);
          setSettled(true);
          return;
        }
      } catch {
        /* keep trying */
      }

      if (cancelled) return;
      if (attempts >= MAX_ATTEMPTS) {
        setSettled(true); // give up; the email still carries the real number
        return;
      }
      setTimeout(poll, 1500);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [paymentIntentId]);

  return { ticketNumber: ticketNumber || fallback, resolved: ticketNumber !== null, settled };
}

export function TicketCard({
  data,
  ticketNumber,
  resolving,
}: {
  data: TicketData;
  ticketNumber: string;
  resolving: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the number is visible anyway */
    }
  };

  const day = data.event?.startsAt
    ? new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/London',
      }).format(new Date(data.event.startsAt))
    : null;

  const time = data.event?.startsAt ? formatRange(data.event.startsAt, data.event.endsAt) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="relative bg-white rounded-[20px] border border-[#F0E2D4] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] overflow-hidden text-left"
    >
      {/* ---- Ticket number band ---- */}
      <div className="bg-[#FAF0E6] px-6 py-6 text-center relative">
        <div className="text-[10px] tracking-[0.16em] uppercase text-[#8a8a8a] mb-2.5 font-semibold">
          Ticket Number
        </div>

        <div className="flex items-center justify-center gap-2.5">
          {resolving ? (
            <span className="inline-flex items-center gap-2 text-[#b09880] font-mono text-2xl sm:text-[28px]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="tracking-widest">••••••••</span>
            </span>
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-mono text-2xl sm:text-[30px] font-bold tracking-[0.08em] text-[#EE6422]"
            >
              {ticketNumber}
            </motion.span>
          )}

          {!resolving && (
            <button
              onClick={copy}
              type="button"
              className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center text-[#a89684] hover:text-[#EE6422] transition-colors shrink-0"
              aria-label="Copy ticket number"
            >
              {copied ? <Check className="w-4 h-4 text-[#22a06b]" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>

        {data.quantity > 1 && (
          <div className="text-xs text-[#8a8a8a] mt-2">Admits {data.quantity} guests</div>
        )}
      </div>

      {/* ---- Perforated divider with notches ---- */}
      <div className="relative h-0">
        <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#FAF0E6] border border-[#F0E2D4]" />
        <div className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#FAF0E6] border border-[#F0E2D4]" />
        <div className="border-t-2 border-dashed border-[#F0E2D4] mx-4" />
      </div>

      {/* ---- Event details ---- */}
      <div className="px-6 py-6 space-y-4">
        <div>
          <div className="text-lg font-bold text-[#1f1f1f] leading-snug">
            {data.event?.title || 'Chutney & Chat Event'}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {data.event?.venue && (
            <DetailRow icon={<MapPin className="w-4 h-4" />} label="Venue" value={data.event.venue} />
          )}
          {day && <DetailRow icon={<Calendar className="w-4 h-4" />} label="Date" value={day} />}
          {time && <DetailRow icon={<Clock className="w-4 h-4" />} label="Time" value={time} />}
        </div>

        <div className="pt-4 border-t border-[#F5EDE4] space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#8a8a8a]">Tickets</span>
            <span className="text-[#1f1f1f] font-medium">{data.quantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8a8a8a]">Total paid</span>
            <span className="text-[#1f1f1f] font-bold">{data.total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#EE6422] mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-[#a09080] font-semibold">
          {label}
        </div>
        <div className="text-[#3d3d3d] leading-snug">{value}</div>
      </div>
    </div>
  );
}

function formatRange(startIso: string, endIso?: string | null): string {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Europe/London',
    })
      .format(new Date(iso))
      .replace(/\s/g, '')
      .toLowerCase();

  return endIso ? `${fmt(startIso)} – ${fmt(endIso)}` : fmt(startIso);
}

/** Google Calendar link — same one the email uses. */
export function calendarUrl(data: TicketData, ticketNumber: string): string | null {
  if (!data.event?.startsAt) return null;
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end =
    data.event.endsAt ||
    new Date(new Date(data.event.startsAt).getTime() + 3 * 3600_000).toISOString();

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.event.title,
    dates: `${stamp(data.event.startsAt)}/${stamp(end)}`,
    details: `Your ticket number is ${ticketNumber}. Please bring it with you.`,
    location: data.event.venue || '',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}
