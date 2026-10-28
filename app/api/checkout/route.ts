import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, type EventRow } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUANTITY = 100;

interface GuestInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
}

interface CheckoutBody {
  eventSlug?: string;
  ticketType?: 'individual' | 'standard' | 'table';
  tableCount?: number;
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

  const isTable = body.ticketType === 'table';
  const tableCount = isTable
    ? Math.max(1, Number(body.tableCount) || Math.floor((Number(body.quantity) || 10) / 10) || 1)
    : 1;
  const quantity = isTable
    ? tableCount * 10
    : (Number.isInteger(body.quantity) ? Number(body.quantity) : 1);

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

  if (isTable) {
    // For Table of 10 bookings:
    // - Primary guest is always at index 0 (or fallback to lead name/email)
    // - Buyer can delete unassigned guest slots, so only validate guests that were actually retained
    const g0Name = clean(rawGuests[0]?.name, 120) || name;
    const g0Email = clean(rawGuests[0]?.email, 200).toLowerCase() || email;
    const g0Company = clean(rawGuests[0]?.company, 160) || company;
    const g0Role = clean(rawGuests[0]?.role, 160) || role;
    guestDetails.push({ name: g0Name, email: g0Email, company: g0Company, role: g0Role });

    for (let i = 1; i < rawGuests.length; i++) {
      const guestObj = rawGuests[i];
      const gName = clean(guestObj?.name, 120);
      const gEmail = clean(guestObj?.email, 200).toLowerCase();
      const gCompany = clean(guestObj?.company, 160) || company;
      const gRole = clean(guestObj?.role, 160) || role || 'Table Guest';

      if (!gName) {
        return NextResponse.json(
          { error: `Please provide the full name for Guest #${i + 1}.` },
          { status: 400 }
        );
      }

      if (!gEmail || !EMAIL_RE.test(gEmail)) {
        return NextResponse.json(
          { error: `Please provide a valid email address for Guest #${i + 1}.` },
          { status: 400 }
        );
      }

      guestDetails.push({ name: gName, email: gEmail, company: gCompany, role: gRole });
    }
  } else {
    // Individual ticket bookings: validate every purchased ticket
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
        const gEmail = clean(guestObj?.email, 200).toLowerCase();
        const gCompany = clean(guestObj?.company, 160) || company;
        const gRole = clean(guestObj?.role, 160) || role || 'Guest Pass';

        if (!gName) {
          return NextResponse.json(
            { error: `Please provide the full name for Guest #${i + 1}. All attendee details are mandatory.` },
            { status: 400 }
          );
        }

        if (!gEmail || !EMAIL_RE.test(gEmail)) {
          return NextResponse.json(
            { error: `Please provide a valid email address for Guest #${i + 1}. All attendee details are mandatory.` },
            { status: 400 }
          );
        }

        guestDetails.push({ name: gName, email: gEmail, company: gCompany, role: gRole });
      }
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

    let amountPence: number;

    if (isTable) {
      // Table accommodating 10 people for £450 (45,000 pence per table)
      amountPence = 45000 * tableCount;
    } else {
      amountPence = (event.price_pence || 0) * quantity;
    }

    // ---- If event price is 0 or TBC, tickets are not on sale yet ----
    if (amountPence === 0 || (!isTable && event.price_pence === 0)) {
      return NextResponse.json(
        { error: 'Tickets for this event are not on sale yet. Bookings will open soon.' },
        { status: 400 }
      );
    }

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
      // Fallback: insert with baseline columns if optional columns (guest_details / role) are not present
      const { data: fbBooking, error: fbError } = await supabase
        .from('bookings')
        .insert({
          event_id: event.id,
          name,
          email,
          phone: phone || null,
          company: company || null,
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

    // Attach or create Stripe Customer so Name and Phone populate top-level Customer profile in Stripe Dashboard
    let customerId: string | undefined;
    try {
      const existing = await stripe.customers.list({ email, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
        await stripe.customers.update(customerId, {
          name,
          phone: phone || undefined,
        });
      } else {
        const createdCustomer = await stripe.customers.create({
          name,
          email,
          phone: phone || undefined,
          metadata: {
            company: company || '',
            role: role || '',
          },
        });
        customerId = createdCustomer.id;
      }
    } catch (custErr) {
      console.warn('[checkout] customer attach warning:', custErr);
    }

    const intent = await stripe.paymentIntents.create({
      amount: amountPence,
      currency: event.currency,
      customer: customerId,
      receipt_email: email,
      description: isTable
        ? `${event.title} — Table of 10 (${tableCount > 1 ? `${tableCount} tables • ` : ''}${guestDetails.length} assigned / ${quantity} seats)`
        : `${event.title} — ${quantity} ticket${quantity === 1 ? '' : 's'}`,
      automatic_payment_methods: { enabled: true },
      metadata: {
        booking_id: bookingId,
        event_id: event.id,
        event_slug: event.slug,
        ticket_type: isTable ? 'table' : 'standard',
        attendee_name: name,
        attendee_email: email,
        attendee_phone: phone || '',
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
