-- =============================================================================
-- HBS — Row Level Security (RLS) policies
-- =============================================================================
-- Apply with:  supabase db push
--   (after: supabase login && supabase link --project-ref rxihusojlhtmbohdxmju)
--
-- Schema below was VERIFIED against the live database (2026-07-11). Only tables
-- that actually exist are covered:
--   companies, profiles, customers, offerable_items,
--   warehouses, warehouse_locations, stock_movements, reservations
-- Tables referenced by the app but NOT yet created in the DB are intentionally
-- omitted: product_stock, orders, quotes, payment_reminders, reviews,
-- campaigns, licenses. Add their policies once those tables exist.
-- =============================================================================

-- Helper: company id of the currently authenticated user.
-- SECURITY DEFINER so it reads profiles without recursive RLS checks.
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

drop policy if exists "companies_public_read" on public.companies;
create policy "companies_public_read" on public.companies
  for select using (coalesce(is_public_search_enabled, false) = true);

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

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_self_write" on public.profiles;
create policy "profiles_self_write" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles_company_read" on public.profiles;
create policy "profiles_company_read" on public.profiles
  for select using (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- customers  (NOTE: this table has NO company_id column)
-- Self-scoped: a user manages only their own customer row. Authenticated users
-- may read the shared customer directory; anonymous may not.
-- -----------------------------------------------------------------------------
alter table if exists public.customers enable row level security;

drop policy if exists "customers_insert_self" on public.customers;
create policy "customers_insert_self" on public.customers
  for insert with check (id = auth.uid());

drop policy if exists "customers_select" on public.customers;
create policy "customers_select" on public.customers
  for select using (id = auth.uid() or auth.uid() is not null);

drop policy if exists "customers_update_self" on public.customers;
create policy "customers_update_self" on public.customers
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "customers_delete_self" on public.customers;
create policy "customers_delete_self" on public.customers
  for delete using (id = auth.uid());

-- -----------------------------------------------------------------------------
-- offerable_items  (products / services / rentals)
-- -----------------------------------------------------------------------------
alter table if exists public.offerable_items enable row level security;

drop policy if exists "offerable_items_public_read" on public.offerable_items;
create policy "offerable_items_public_read" on public.offerable_items
  for select using (coalesce(is_visible_in_public_search, false) = true);

drop policy if exists "offerable_items_company_read" on public.offerable_items;
create policy "offerable_items_company_read" on public.offerable_items
  for select using (company_id = public.current_company_id());

drop policy if exists "offerable_items_company_write" on public.offerable_items;
create policy "offerable_items_company_write" on public.offerable_items
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- warehouses / warehouse_locations / stock_movements  (company-scoped)
-- -----------------------------------------------------------------------------
alter table if exists public.warehouses enable row level security;

drop policy if exists "warehouses_public_read" on public.warehouses;
create policy "warehouses_public_read" on public.warehouses
  for select using (coalesce(is_visible_to_customers, false) = true);

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

alter table if exists public.stock_movements enable row level security;
drop policy if exists "stock_movements_company_all" on public.stock_movements;
create policy "stock_movements_company_all" on public.stock_movements
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- -----------------------------------------------------------------------------
-- reservations  (company-scoped; customers read their own)
-- -----------------------------------------------------------------------------
alter table if exists public.reservations enable row level security;
drop policy if exists "reservations_company_all" on public.reservations;
create policy "reservations_company_all" on public.reservations
  for all using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

drop policy if exists "reservations_customer_read" on public.reservations;
create policy "reservations_customer_read" on public.reservations
  for select using (customer_id = auth.uid());

-- =============================================================================
-- NOTE: The anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe in the browser
-- ONLY because RLS above restricts anonymous access to the specific public-read
-- policies (companies_public_read, offerable_items_public_read,
-- warehouses_public_read). Never grant the anon role broad table permissions
-- in the Supabase dashboard; RLS is the single source of truth for access.
-- =============================================================================
