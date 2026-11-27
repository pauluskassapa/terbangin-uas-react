-- Initial schema for the Terbangin UAS demo.
-- This app currently uses a public publishable key without associating bookings
-- or saved spots with auth.uid(). These policies keep the demo functional, but
-- allow anyone with the public key to read and modify demo records. Do not use
-- real passenger data until access is moved behind authenticated ownership or
-- server-side endpoints.

create table if not exists public.bookings (
  id uuid primary key,
  booking_code text not null unique,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null default '',
  airline text not null,
  flight_number text not null,
  from_code text not null,
  to_code text not null,
  flight_date date,
  passenger_count integer not null check (passenger_count > 0),
  ticket_total numeric(14, 2) not null check (ticket_total >= 0),
  baggage_kg integer not null default 0 check (baggage_kg >= 0),
  baggage_total numeric(14, 2) not null default 0 check (baggage_total >= 0),
  grand_total numeric(14, 2) not null check (grand_total >= 0),
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_passengers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  passenger_name text not null,
  seat text,
  created_at timestamptz not null default now()
);

create index if not exists booking_passengers_booking_id_idx
  on public.booking_passengers (booking_id);

create table if not exists public.booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  payment_method text not null,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'simulated_success', 'failed')),
  payment_mode text not null default 'simulation'
    check (payment_mode in ('simulation', 'production')),
  amount numeric(14, 2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists booking_payments_booking_id_created_at_idx
  on public.booking_payments (booking_id, created_at desc);

create table if not exists public.saved_spots (
  id uuid primary key default gen_random_uuid(),
  destination_code text not null,
  spot_id text not null,
  spot_name text not null,
  created_at timestamptz not null default now(),
  constraint saved_spots_destination_spot_unique unique (destination_code, spot_id)
);

alter table public.bookings enable row level security;
alter table public.booking_passengers enable row level security;
alter table public.booking_payments enable row level security;
alter table public.saved_spots enable row level security;

grant select, insert, update, delete on public.bookings to anon, authenticated;
grant select, insert, update, delete on public.booking_passengers to anon, authenticated;
grant select, insert, update, delete on public.booking_payments to anon, authenticated;
grant select, insert, update, delete on public.saved_spots to anon, authenticated;

drop policy if exists "demo access bookings" on public.bookings;
create policy "demo access bookings" on public.bookings
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "demo access booking passengers" on public.booking_passengers;
create policy "demo access booking passengers" on public.booking_passengers
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "demo access booking payments" on public.booking_payments;
create policy "demo access booking payments" on public.booking_payments
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "demo access saved spots" on public.saved_spots;
create policy "demo access saved spots" on public.saved_spots
  for all to anon, authenticated using (true) with check (true);
