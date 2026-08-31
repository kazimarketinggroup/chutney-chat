-- ============================================================
-- MIGRATION: ticket numbers
--
-- Run this ONCE in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run: every statement is idempotent.
--
-- Adds a short, human-readable ticket number to each paid booking, e.g.
--   CC-0909-0042
--    ^   ^    ^
--    |   |    +-- sequential counter
--    |   +------- event month/day
--    +----------- Chutney & Chat
--
-- Readable over the phone and on the door, unlike a raw UUID.
-- ============================================================

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

-- Assign the number in the same statement that flips the booking to paid.
-- Doing it in a trigger (rather than in the webhook handler) guarantees every
-- paid booking gets exactly one number, even if Stripe retries the webhook or
-- a booking is marked paid by hand in the dashboard.
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

-- Backfill any bookings that were already paid before this migration ran.
update public.bookings
   set ticket_number = public.generate_ticket_number(event_id)
 where status = 'paid'
   and ticket_number is null;
