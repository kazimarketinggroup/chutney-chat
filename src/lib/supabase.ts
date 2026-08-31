import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Two clients, deliberately separated:
 *
 *  - supabaseAdmin  → service-role / secret key. SERVER ONLY. Bypasses RLS, so
 *                     it can write bookings and read customer data. Never
 *                     import this into a file that has 'use client'.
 *  - supabasePublic → publishable (anon) key. Safe in the browser. RLS limits
 *                     it to reading active events only.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to .env.local (see .env.example).`
    );
  }
  return value;
}

/**
 * Supabase renamed the browser-safe key from "anon" (a JWT starting eyJ...) to
 * "publishable" (sb_publishable_...). Both work with createClient, and projects
 * carry one or the other depending on when they were made, so accept either
 * variable name rather than forcing a rename in .env.local.
 */
function publicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'Missing Supabase browser key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
        '(or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local.'
    );
  }
  return key;
}

/** Same story on the server side: "service_role" JWT or the newer "secret" key. */
function secretKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'Missing Supabase server key. Set SUPABASE_SERVICE_ROLE_KEY ' +
        '(or SUPABASE_SECRET_KEY) in .env.local.'
    );
  }
  return key;
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin() must never be called from the browser.');
  }
  if (!adminClient) {
    adminClient = createClient(
      required('NEXT_PUBLIC_SUPABASE_URL'),
      secretKey(),
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return adminClient;
}

let publicClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(required('NEXT_PUBLIC_SUPABASE_URL'), publicKey(), {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}

/** Shape of a row in public.events */
export interface EventRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  price_pence: number;
  currency: string;
  capacity: number | null;
  tickets_sold: number;
  image_url: string | null;
  is_active: boolean;
}

/** Shape of a row in public.bookings */
export interface BookingRow {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  quantity: number;
  /** Human-readable ticket number, e.g. CC-0909-0042. Set when paid. */
  ticket_number: string | null;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';
  amount_pence: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
}

/** £40.00 from 4000 */
export function formatPrice(pence: number, currency = 'gbp'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(pence / 100);
}
