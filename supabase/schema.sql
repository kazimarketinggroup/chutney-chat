-- ============================================================
-- Chutney & Chat — Ticketing schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ---------- EVENTS ----------
-- Price lives here, NOT in the frontend. The checkout API always reads
-- the price from this table so a user cannot tamper with it in the browser.
create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  subtitle       text,
  venue          text,
  starts_at      timestamptz not null,
  ends_at        timestamptz,
  price_pence    integer not null check (price_pence >= 0),  -- £40.00 -> 4000
  currency       text not null default 'gbp',
  capacity       integer,               -- null = unlimited
  tickets_sold   integer not null default 0,
  image_url      text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------- BOOKINGS ----------
create table if not exists public.bookings (
  id                         uuid primary key default gen_random_uuid(),
  event_id                   uuid not null references public.events(id) on delete restrict,

  -- attendee details from the modal form
  name                       text not null,
  email                      text not null,
  phone                      text,
  company                    text,
  role                       text,
  quantity                   integer not null default 1 check (quantity > 0),

  -- payment state
  status                     text not null default 'pending'
                               check (status in ('pending','paid','failed','refunded','expired')),
  amount_pence               integer not null,
  currency                   text not null default 'gbp',

  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text,
  paid_at                    timestamptz,

  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create index if not exists bookings_event_id_idx on public.bookings(event_id);
create index if not exists bookings_email_idx    on public.bookings(lower(email));
create index if not exists bookings_status_idx   on public.bookings(status);
create index if not exists bookings_session_idx  on public.bookings(stripe_checkout_session_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
  before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------- ROW LEVEL SECURITY ----------
alter table public.events   enable row level security;
alter table public.bookings enable row level security;

-- Anyone (anon key) may READ active events — needed to render prices/cards.
drop policy if exists "public can read active events" on public.events;
create policy "public can read active events"
  on public.events for select
  using (is_active = true);

-- Bookings: NO anon policy at all. Only the server (service-role key)
-- touches this table, and service-role bypasses RLS. This means a leaked
-- anon key can never read customer names, emails or payment records.

-- ---------- SEED THE TWO CURRENT EVENTS ----------
insert into public.events (slug, title, subtitle, venue, starts_at, ends_at, price_pence, image_url)
values
  (
    'summer-business-bbq',
    'Summer Business BBQ',
    'Wednesday 9th September 2026 - The Farmhouse Coventry',
    'The Farmhouse, Coventry',
    '2026-09-09T18:30:00+01:00',
    '2026-09-09T21:30:00+01:00',
    4000,
    '/images/business_bbq_event_slider_image.png'
  ),
  (
    'business-networking-evening',
    'Business Networking Evening',
    'Tuesday 29th September 2026 - Tipu Sultan Leicester',
    'Tipu Sultan, 18 The Parade, Oadby, Leicester LE2 5BF',
    '2026-09-29T18:30:00+01:00',
    '2026-09-29T22:30:00+01:00',
    3500,
    '/images/business_networking_event_slider_image.png'
  )
on conflict (slug) do update set
  title       = excluded.title,
  subtitle    = excluded.subtitle,
  venue       = excluded.venue,
  starts_at   = excluded.starts_at,
  ends_at     = excluded.ends_at,
  price_pence = excluded.price_pence,
  image_url   = excluded.image_url;

-- ---------- ATOMIC SOLD COUNTER ----------
-- Called by the Stripe webhook. Doing this as SELECT-then-UPDATE in JS would
-- race when two people pay at the same moment; a single SQL statement will not.
create or replace function public.increment_tickets_sold(
  p_event_id uuid,
  p_quantity integer
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.events
     set tickets_sold = tickets_sold + p_quantity
   where id = p_event_id;
$$;

revoke all on function public.increment_tickets_sold(uuid, integer) from public, anon, authenticated;

-- ============================================================
-- TICKET NUMBERS
-- Run this block after the original schema above.
-- ============================================================

-- A short, human-readable ticket number per booking, e.g. CC-2609-0042.
--   CC   = Chutney & Chat
--   2609 = event month/day
--   0042 = sequential per event
-- Readable over the phone and on the door, unlike a raw UUID.

create sequence if not exists public.ticket_seq;

alter table public.bookings
  add column if not exists ticket_number text unique;

create or replace function public.generate_ticket_number(p_event_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_starts_at timestamptz;
  v_seq       bigint;
begin
  select starts_at into v_starts_at from public.events where id = p_event_id;
  v_seq := nextval('public.ticket_seq');
  return 'CC-'
      || to_char(coalesce(v_starts_at, now()), 'MMDD')
      || '-'
      || lpad((v_seq % 10000)::text, 4, '0');
end $$;

revoke all on function public.generate_ticket_number(uuid) from public, anon, authenticated;

-- Assign the number the moment a booking is marked paid, inside the same
-- statement that flips the status. Doing it in a trigger (rather than in the
-- webhook handler) guarantees every paid booking has exactly one number even
-- if the webhook is retried or a booking is marked paid by hand.
create or replace function public.assign_ticket_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'paid' and new.ticket_number is null then
    new.ticket_number := public.generate_ticket_number(new.event_id);
  end if;
  return new;
end $$;

drop trigger if exists bookings_assign_ticket_number on public.bookings;
create trigger bookings_assign_ticket_number
  before update on public.bookings
  for each row execute function public.assign_ticket_number();
