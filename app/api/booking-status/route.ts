import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, formatPrice } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Read-only lookup for the confirmation view.
 *
 * Confirms the PaymentIntent with Stripe first, so knowing an id alone is not
 * enough to read someone's booking, and returns only display-safe fields.
 */
export async function GET(req: Request) {
  const intentId = new URL(req.url).searchParams.get('payment_intent');

  if (!intentId || !intentId.startsWith('pi_')) {
    return NextResponse.json(
      { error: 'Missing or invalid payment_intent.' },
      { status: 400 }
    );
  }

  try {
    const intent = await getStripe().paymentIntents.retrieve(intentId);
    const bookingId = intent.metadata?.booking_id;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();

    const BASE_COLUMNS = 'id, name, email, quantity, status, amount_pence, currency, event_id';

    // ticket_number is added by supabase/migration-ticket-numbers.sql. Select it
    // when present, but fall back cleanly if that migration has not been run —
    // otherwise a missing column turns into a bogus "Booking not found".
    let { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`${BASE_COLUMNS}, ticket_number`)
      .eq('id', bookingId)
      .single();

    if (bookingError?.code === '42703') {
      ({ data: booking } = await supabase
        .from('bookings')
        .select(BASE_COLUMNS)
        .eq('id', bookingId)
        .single());
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const { data: eventRow } = await supabase
      .from('events')
      .select('title, subtitle, venue, starts_at, ends_at')
      .eq('id', booking.event_id)
      .single();

    return NextResponse.json({
      // Stripe is the source of truth for whether money moved; the booking row
      // may still say 'pending' if the webhook has not landed yet.
      paid: intent.status === 'succeeded',
      status: booking.status,
      name: booking.name,
      email: booking.email,
      quantity: booking.quantity,
      total: formatPrice(booking.amount_pence, booking.currency),
      ticketNumber: booking.ticket_number || `CC-${booking.id.slice(0, 8).toUpperCase()}`,
      event: eventRow
        ? {
            title: eventRow.title,
            subtitle: eventRow.subtitle,
            venue: eventRow.venue,
            startsAt: eventRow.starts_at,
            endsAt: eventRow.ends_at,
          }
        : null,
    });
  } catch (err) {
    console.error('[booking-status] lookup failed:', err);
    return NextResponse.json({ error: 'Could not load your booking.' }, { status: 500 });
  }
}
