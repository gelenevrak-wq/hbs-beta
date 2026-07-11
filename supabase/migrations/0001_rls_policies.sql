-- =============================================================================
-- HBS — Row Level Security (RLS) policies
-- =============================================================================
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
--
-- ⚠️  REVIEW BEFORE APPLYING
-- This migration assumes the snake_case schema inferred from the app code
-- (types/hbs.ts, app/login, app/register, app/page.tsx). Before running in
-- production, confirm table & column names against your live database:
--     supabase db dump --schema public
-- or open Table Editor in the Supabase dashboard.
-- If a table is named differently, adjust the identifier — policies are
-- idempotent (CREATE POLICY IF NOT EXISTS) but ENABLE ROW LEVEL SECURITY
-- requires the table to exist.
-- =============================================================================

-- Helper: company id of the currently authenticated user.
-- SECURITY DEFINER so it can read profiles without recursive RLS checks.
create or replace function public.current_company_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- companies
-- -----------------------------------------------------------------------------
alter table if exists public.companies enable row level security;

-- Public storefront / search: only companies that opted into public visibility.
drop policy if exists "companies_public_read" on public.companies;
create policy "companies_public_read" on public.companies
  for select using (coalesce(is_public_search_enabled, false) = true);

-- Owners / staff of the company can read & manage their own company row.
drop policy if exists "companies_company_read" on public.companies;
create policy "companies_company_read" on public.companies
  for select using (id = public.current_company_id());

drop policy if exists "companies_company_write" on public.companies;
create policy "companies_company_write" on public.companies
  for all using (id = public.current_company_id())
  with check (id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
alter table if exists public.profiles enable row level security;

-- A user can read/update only their own profile.
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_self_write" on public.profiles;
create policy "profiles_self_write" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Company admins may read profiles of users in the same company.
drop policy if exists "profiles_company_read" on public.profiles;
create policy "profiles_company_read" on public.profiles
  for select using (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- customers
-- -----------------------------------------------------------------------------
alter table if exists public.customers enable row level security;

-- Company-linked customers: readable by their own company.
drop policy if exists "customers_company_read" on public.customers;
create policy "customers_company_read" on public.customers
  for select using (company_id = public.current_company_id());

drop policy if exists "customers_company_write" on public.customers;
create policy "customers_company_write" on public.customers
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- offerable_items  (products / services / rentals)
-- -----------------------------------------------------------------------------
alter table if exists public.offerable_items enable row level security;

-- Public search: only items flagged visible in public search.
drop policy if exists "offerable_items_public_read" on public.offerable_items;
create policy "offerable_items_public_read" on public.offerable_items
  for select using (coalesce(is_visible_in_public_search, false) = true);

-- Company staff manage their own items.
drop policy if exists "offerable_items_company_read" on public.offerable_items;
create policy "offerable_items_company_read" on public.offerable_items
  for select using (company_id = public.current_company_id());

drop policy if exists "offerable_items_company_write" on public.offerable_items;
create policy "offerable_items_company_write" on public.offerable_items
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- warehouses / warehouse_locations / product_stock / stock_movements
-- (company-scoped; never exposed to anonymous users)
-- -----------------------------------------------------------------------------
alter table if exists public.warehouses enable row level security;
drop policy if exists "warehouses_company_all" on public.warehouses;
create policy "warehouses_company_all" on public.warehouses
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.warehouse_locations enable row level security;
drop policy if exists "warehouse_locations_company_all" on public.warehouse_locations;
create policy "warehouse_locations_company_all" on public.warehouse_locations
  for all using (
    warehouse_id in (select id from public.warehouses where company_id = public.current_company_id())
  )
  with check (
    warehouse_id in (select id from public.warehouses where company_id = public.current_company_id())
  );

alter table if exists public.product_stock enable row level security;
drop policy if exists "product_stock_company_all" on public.product_stock;
create policy "product_stock_company_all" on public.product_stock
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.stock_movements enable row level security;
drop policy if exists "stock_movements_company_all" on public.stock_movements;
create policy "stock_movements_company_all" on public.stock_movements
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- business documents: quotes / orders / reservations / reminders / reviews /
-- campaigns / licenses — all company-scoped.
-- -----------------------------------------------------------------------------
alter table if exists public.quotes enable row level security;
drop policy if exists "quotes_company_all" on public.quotes;
create policy "quotes_company_all" on public.quotes
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.orders enable row level security;
drop policy if exists "orders_company_all" on public.orders;
create policy "orders_company_all" on public.orders
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.reservations enable row level security;
drop policy if exists "reservations_company_all" on public.reservations;
create policy "reservations_company_all" on public.reservations
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.payment_reminders enable row level security;
drop policy if exists "payment_reminders_company_all" on public.payment_reminders;
create policy "payment_reminders_company_all" on public.payment_reminders
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.reviews enable row level security;
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (visibility = 'public');
drop policy if exists "reviews_company_all" on public.reviews;
create policy "reviews_company_all" on public.reviews
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.campaigns enable row level security;
drop policy if exists "campaigns_company_all" on public.campaigns;
create policy "campaigns_company_all" on public.campaigns
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

alter table if exists public.licenses enable row level security;
drop policy if exists "licenses_company_all" on public.licenses;
create policy "licenses_company_all" on public.licenses
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- NOTE: The anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe to ship to the
-- browser ONLY because RLS above restricts anonymous access to the specific
-- public-read policies. Never grant the anon role broad table permissions in
-- the Supabase dashboard; RLS is the single source of truth for access control.
-- -----------------------------------------------------------------------------
