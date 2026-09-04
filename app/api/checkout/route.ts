import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, type EventRow } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUANTITY = 10;

interface GuestInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
}

interface CheckoutBody {
  eventSlug?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  quantity?: number;
  guests?: GuestInput[];
}

function clean(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // ---- validate the primary attendee details ----
  const eventSlug = clean(body.eventSlug, 120);
  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);
  const company = clean(body.company, 160);
  const role = clean(body.role, 160);

  const quantity = Number.isInteger(body.quantity) ? Number(body.quantity) : 1;

  if (!eventSlug) return NextResponse.json({ error: 'Event is required.' }, { status: 400 });
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (quantity < 1 || quantity > MAX_QUANTITY) {
    return NextResponse.json(
      { error: `Quantity must be between 1 and ${MAX_QUANTITY}.` },
      { status: 400 }
    );
  }

  // ---- validate & sanitize guest recipient list ----
  const guestDetails: Array<{ name: string; email: string; company?: string; role?: string }> = [];
  const rawGuests = Array.isArray(body.guests) ? body.guests : [];

  for (let i = 0; i < quantity; i++) {
    if (i === 0) {
      // Primary guest
      const gName = clean(rawGuests[0]?.name, 120) || name;
      const gEmail = clean(rawGuests[0]?.email, 200).toLowerCase() || email;
      const gCompany = clean(rawGuests[0]?.company, 160) || company;
      const gRole = clean(rawGuests[0]?.role, 160) || role;
      guestDetails.push({ name: gName, email: gEmail, company: gCompany, role: gRole });
    } else {
      const guestObj = rawGuests[i];
      const gName = clean(guestObj?.name, 120);
      const gEmail = clean(guestObj?.email, 200).toLowerCase() || email;
      const gCompany = clean(guestObj?.company, 160) || company;
      const gRole = clean(guestObj?.role, 160);

      if (!gName) {
        return NextResponse.json(
          { error: `Please provide the name for Guest #${i + 1}.` },
          { status: 400 }
        );
      }
      if (gEmail && !EMAIL_RE.test(gEmail)) {
        return NextResponse.json(
          { error: `Please provide a valid email address for Guest #${i + 1}.` },
          { status: 400 }
        );
      }

      guestDetails.push({ name: gName, email: gEmail, company: gCompany, role: gRole });
    }
  }

  try {
    const supabase = getSupabaseAdmin();

    // ---- price comes from the DB, never from the client ----
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('slug', eventSlug)
      .eq('is_active', true)
      .single<EventRow>();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'This event is not available for booking.' },
        { status: 404 }
      );
    }

    // ---- capacity check ----
    if (event.capacity !== null && event.tickets_sold + quantity > event.capacity) {
      const remaining = Math.max(event.capacity - event.tickets_sold, 0);
      return NextResponse.json(
        {
          error:
            remaining === 0
              ? 'Sorry, this event is now sold out.'
              : `Only ${remaining} ticket${remaining === 1 ? '' : 's'} left for this event.`,
        },
        { status: 409 }
      );
    }

    const amountPence = event.price_pence * quantity;

    // ---- create the pending booking BEFORE taking payment ----
    let bookingId: string | null = null;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        event_id: event.id,
        name,
        email,
        phone: phone || null,
        company: company || null,
        role: role || null,
        quantity,
        guest_details: guestDetails,
        status: 'pending',
        amount_pence: amountPence,
        currency: event.currency,
      })
      .select('id')
      .single<{ id: string }>();

    if (booking?.id) {
      bookingId = booking.id;
    } else {
      console.warn('[checkout] insert with guest_details failed, retrying without guest_details:', bookingError);
      // Fallback: insert without guest_details column if schema is not yet updated
      const { data: fbBooking, error: fbError } = await supabase
        .from('bookings')
        .insert({
          event_id: event.id,
          name,
          email,
          phone: phone || null,
          company: company || null,
          role: role || null,
          quantity,
          status: 'pending',
          amount_pence: amountPence,
          currency: event.currency,
        })
        .select('id')
        .single<{ id: string }>();

      if (fbError || !fbBooking) {
        console.error('[checkout] fallback booking insert failed:', fbError);
        return NextResponse.json(
          { error: 'Could not start your booking. Please try again.' },
          { status: 500 }
        );
      }
      bookingId = fbBooking.id;
    }

    // ---- PaymentIntent for the in-page card form ----
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: amountPence,
      currency: event.currency,
      receipt_email: email,
      description: `${event.title} — ${quantity} ticket${quantity === 1 ? '' : 's'}`,
      automatic_payment_methods: { enabled: true },
      metadata: {
        booking_id: bookingId,
        event_id: event.id,
        event_slug: event.slug,
        attendee_name: name,
        attendee_email: email,
        quantity: String(quantity),
        guest_details: JSON.stringify(guestDetails),
      },
    });

    await supabase
      .from('bookings')
      .update({ stripe_payment_intent_id: intent.id })
      .eq('id', bookingId);

    if (!intent.client_secret) {
      return NextResponse.json(
        { error: 'Stripe did not return a client secret.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      bookingId,
      amountPence,
      currency: event.currency,
    });
  } catch (err) {
    console.error('[checkout] unexpected error:', err);
    return NextResponse.json(
      { error: 'Something went wrong starting checkout. Please try again.' },
      { status: 500 }
    );
  }
}
