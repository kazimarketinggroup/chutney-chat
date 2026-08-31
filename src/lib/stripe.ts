import Stripe from 'stripe';

/** Server-side Stripe client. Never import into a 'use client' file. */

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'Missing STRIPE_SECRET_KEY. Add it to .env.local (see .env.example).'
      );
    }
    // No apiVersion override: we use the version this SDK was generated
    // against, so request/response shapes always line up. Upgrading the
    // stripe package is the deliberate way to move to a newer API version.
    stripeClient = new Stripe(key, {
      appInfo: { name: 'Chutney & Chat', version: '1.0.0' },
    });
  }
  return stripeClient;
}

/** Absolute base URL for Stripe success/cancel redirects. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
