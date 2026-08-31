import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, type EventRow } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUANTITY = 10;

interface CheckoutBody {
  eventSlug?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  quantity?: number;
}

function clean(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates the booking row and a PaymentIntent, and returns the client secret.
 *
 * The card form lives in our own modal (Stripe Elements), so there is no
 * redirect to a hosted page. Elements needs a client secret; it cannot use a
 * Checkout Session. Card details still go straight from the iframe to Stripe —
 * they never touch this server, so PCI scope is unchanged.
 */
export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // ---- validate the attendee details ----
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
    // If the user abandons the form we still keep the lead; the webhook is what
    // flips this row to 'paid'.
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
        status: 'pending',
        amount_pence: amountPence,
        currency: event.currency,
      })
      .select('id')
      .single<{ id: string }>();

    if (bookingError || !booking) {
      console.error('[checkout] booking insert failed:', bookingError);
      return NextResponse.json(
        { error: 'Could not start your booking. Please try again.' },
        { status: 500 }
      );
    }

    // ---- PaymentIntent for the in-page card form ----
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: amountPence,
      currency: event.currency,
      receipt_email: email,
      description: `${event.title} — ${quantity} ticket${quantity === 1 ? '' : 's'}`,
      // Lets Stripe offer cards plus whatever else is enabled on the account
      // (Apple Pay / Google Pay / Link) without extra code here.
      automatic_payment_methods: { enabled: true },
      // The webhook reads these back to reconcile the booking.
      metadata: {
        booking_id: booking.id,
        event_id: event.id,
        event_slug: event.slug,
        attendee_name: name,
        attendee_email: email,
        quantity: String(quantity),
      },
    });

    await supabase
      .from('bookings')
      .update({ stripe_payment_intent_id: intent.id })
      .eq('id', booking.id);

    if (!intent.client_secret) {
      return NextResponse.json(
        { error: 'Stripe did not return a client secret.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      bookingId: booking.id,
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
