# Stripe + Supabase Ticketing — Setup Guide

Everything is coded and building. Only the credentials and the database table
creation are left. Follow these five steps in order.

---

## 1. Create `.env.local`

Copy `.env.example` to `.env.local` in the project root and fill in the values
from steps 2 and 3.

```bash
cp .env.example .env.local
```

`.env.local` is gitignored — never commit it.

---

## 2. Supabase

1. Create a project at https://supabase.com
2. Go to **SQL Editor → New query**, paste the whole contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
   This creates the `events` and `bookings` tables, the RLS policies, the
   `increment_tickets_sold` function, and seeds your two current events.
3. Go to **Project Settings → API** and copy into `.env.local`:

   | Dashboard field       | `.env.local` variable            |
   |-----------------------|----------------------------------|
   | Project URL           | `NEXT_PUBLIC_SUPABASE_URL`       |
   | `anon` `public` key   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  |
   | `service_role` key    | `SUPABASE_SERVICE_ROLE_KEY`      |

> The `service_role` key bypasses all row-level security. It is used only in
> server code (`app/api/**`) and must never be prefixed `NEXT_PUBLIC_`.

---

## 3. Stripe

1. Create an account at https://stripe.com and stay in **Test mode** for now.
2. **Developers → API keys**, copy into `.env.local`:

   | Dashboard field   | `.env.local` variable                |
   |-------------------|--------------------------------------|
   | Secret key        | `STRIPE_SECRET_KEY`                  |
   | Publishable key   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |

3. Get the webhook secret — see step 4 (local) and step 5 (production).

No Products or Payment Links need to be created in the Stripe dashboard.
Prices come from the `events` table and the PaymentIntent is created
on the fly by `app/api/checkout/route.ts`.

---

## 4. Local testing

Install the Stripe CLI: https://stripe.com/docs/stripe-cli

```bash
# terminal 1
npm run dev

# terminal 2 — forwards live Stripe events to your local webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI prints `Ready! Your webhook signing secret is whsec_xxxxx`.
Put that value in `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.

Then open the site, click any ticket card, fill the form and pay with the
Stripe test card:

```
Card    4242 4242 4242 4242
Expiry  any future date
CVC     any 3 digits
ZIP     any
```

Other useful test cards:

| Card number           | Result                         |
|-----------------------|--------------------------------|
| `4242 4242 4242 4242` | Payment succeeds               |
| `4000 0000 0000 9995` | Declined — insufficient funds  |
| `4000 0025 0000 3155` | Requires 3D Secure             |

After paying you should see:
- the modal switch to a green confirmation with a booking reference
- a `paid` row in Supabase -> `bookings`
- `tickets_sold` incremented on the event
- confirmation emails sent (if `EMAIL_USER`/`EMAIL_PASS` are set)

---

## 5. Production

1. Set `NEXT_PUBLIC_SITE_URL` to your real domain, e.g.
   `https://chutneyandchat.com` (no trailing slash).
2. Switch Stripe out of Test mode and swap in the `sk_live_` / `pk_live_` keys.
3. **Developers → Webhooks → Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to send:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `charge.refunded`
   - Copy the endpoint's **Signing secret** into the production
     `STRIPE_WEBHOOK_SECRET`. It is a different value from the local CLI one.
4. Add every variable from `.env.example` to your host's environment settings
   (Vercel → Project → Settings → Environment Variables).

---

## How the flow works

The card form is embedded in our own modal using Stripe Elements — the user
never leaves the site.

```
User clicks a ticket card
  → Step 1: modal collects name / email / phone / company / role / quantity
  → POST /api/checkout
       · looks the event up in Supabase by slug
       · reads the price FROM THE DATABASE (never from the browser)
       · checks capacity
       · inserts a booking row with status 'pending'
       · creates a Stripe PaymentIntent with booking_id in metadata
       · returns the client secret
  → Step 2: Stripe Elements card form renders inside the same modal
  → user pays; on success the modal switches to a confirmation state
  → Stripe calls POST /api/webhooks/stripe  ← this is what confirms the booking
       · verifies the signature
       · flips the booking to 'paid'
       · increments tickets_sold
       · sends confirmation + admin emails
```

**Why the webhook and not the browser:** the confirm call in the browser can be
interrupted by a closed tab or a dropped connection. Only the signed webhook
proves Stripe actually took the money, so that is the only place a booking
becomes `paid`.

**PCI note:** card numbers are typed into a Stripe-hosted iframe and travel
straight to Stripe. They never pass through this server, so embedding the form
does not increase PCI scope — SAQ A still applies, same as the hosted page.

**`/buy-ticket/success`** is now only a fallback landing page for cards that
need a full 3-D Secure redirect. Normal payments finish inside the modal.

---

## Changing prices or adding events

Edit the `events` table in Supabase — no code change needed.

```sql
-- change a price to £45.00
update events set price_pence = 4500 where slug = 'summer-business-bbq';

-- cap an event at 80 seats
update events set capacity = 80 where slug = 'summer-business-bbq';

-- hide an event from booking
update events set is_active = false where slug = 'summer-business-bbq';
```

For a brand new event: insert a row with a new `slug`, then pass that slug to
`openModal({ eventSlug: 'your-new-slug', title: '...', price: '£40.00' })`.

> Note: the prices shown on the page are still the hardcoded display strings in
> the page components. The `price` passed to `openModal` is for display only —
> the amount actually charged always comes from `events.price_pence`. If you
> change a price in the database, update the display string too, or switch the
> pages to read from Supabase.
