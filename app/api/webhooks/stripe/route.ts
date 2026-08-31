import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendBookingEmails } from '@/lib/bookingEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook — the ONLY place a booking becomes 'paid'.
 *
 * The card form confirms in the browser, and that call can be interrupted by a
 * closed tab or a dropped connection, so its result is never trusted for
 * fulfilment. Stripe signs every event with STRIPE_WEBHOOK_SECRET and we verify
 * that signature against the RAW body.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  // Must be the raw text body — parsing it first would break the signature.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(rawBody, signature, secret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        await markBookingPaid(event.data.object as Stripe.PaymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        await markBookingStatus(event.data.object as Stripe.PaymentIntent, 'failed');
        break;
      }

      case 'payment_intent.canceled': {
        await markBookingStatus(event.data.object as Stripe.PaymentIntent, 'expired');
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (paymentIntentId) {
          await getSupabaseAdmin()
            .from('bookings')
            .update({ status: 'refunded' })
            .eq('stripe_payment_intent_id', paymentIntentId);
        }
        break;
      }

      default:
        // Everything else is acknowledged and ignored.
        break;
    }
  } catch (err) {
    // Return 500 so Stripe retries — better than silently losing a paid booking.
    console.error(`[stripe-webhook] handler failed for ${event.type}:`, err);
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Flip a booking to paid, bump tickets_sold, then email. Idempotent. */
async function markBookingPaid(intent: Stripe.PaymentIntent) {
  const supabase = getSupabaseAdmin();
  const bookingId = intent.metadata?.booking_id;

  if (!bookingId) {
    console.error('[stripe-webhook] no booking_id on payment intent', intent.id);
    return;
  }

  // Only update rows that are NOT already paid. Stripe retries webhooks and can
  // deliver the same event twice, so this guard is what keeps tickets_sold and
  // the confirmation email from being applied more than once.
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: intent.id,
    })
    .eq('id', bookingId)
    .neq('status', 'paid')
    .select('*')
    .maybeSingle();

  if (error) throw error;

  // Already processed by an earlier delivery of this event — nothing left to do.
  if (!updated) return;

  // Increment the sold counter for capacity tracking.
  const { error: rpcError } = await supabase.rpc('increment_tickets_sold', {
    p_event_id: updated.event_id,
    p_quantity: updated.quantity,
  });
  if (rpcError) {
    console.error('[stripe-webhook] increment_tickets_sold failed:', rpcError);
  }

  // Email failures must not fail the webhook — the payment is already taken.
  try {
    const { data: eventRow } = await supabase
      .from('events')
      .select('*')
      .eq('id', updated.event_id)
      .single();
    await sendBookingEmails(updated, eventRow);
  } catch (err) {
    console.error('[stripe-webhook] confirmation email failed:', err);
  }
}

async function markBookingStatus(
  intent: Stripe.PaymentIntent,
  status: 'failed' | 'expired'
) {
  const bookingId = intent.metadata?.booking_id;
  if (!bookingId) return;

  // Never downgrade a booking that already succeeded.
  await getSupabaseAdmin()
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .eq('status', 'pending');
}
