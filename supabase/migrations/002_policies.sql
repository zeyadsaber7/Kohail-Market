-- =========================================================================
-- KOHAIL MARKET — ROW LEVEL SECURITY POLICIES
-- Run AFTER supabase/schema.sql, in the SQL Editor.
-- =========================================================================

-- -------------------------------------------------------------------------
-- Helper: is the currently authenticated user an admin?
-- SECURITY DEFINER so the function itself can read admin_users even
-- though admin_users' own RLS restricts direct SELECT (see below) —
-- otherwise this would recurse into the policy it's used by.
-- -------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

-- =========================================================================
-- CATEGORIES — public read, admin-only write
-- =========================================================================
alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- PRODUCTS — public read, admin-only write
-- =========================================================================
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- ORDERS — anyone can place an order, but customers can never read /
-- update / delete orders. Only admins can. Actual inserts happen through
-- the SECURITY DEFINER place_order() function (schema.sql), so a direct
-- table INSERT policy isn't required for checkout — omitted on purpose so
-- customers can never read each other's orders.
-- =========================================================================
alter table public.orders enable row level security;

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete"
  on public.orders for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- ORDER_ITEMS — same model: admin-only read/write via table policies;
-- inserts happen through place_order().
-- =========================================================================
alter table public.order_items enable row level security;

drop policy if exists "order_items_admin_read" on public.order_items;
create policy "order_items_admin_read"
  on public.order_items for select
  to authenticated
  using (public.is_admin());

drop policy if exists "order_items_admin_delete" on public.order_items;
create policy "order_items_admin_delete"
  on public.order_items for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- ADMIN_USERS — an admin can read their own row (e.g. to show role/name
-- in a dashboard); only a super_admin can manage admin accounts.
-- =========================================================================
alter table public.admin_users enable row level security;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
  on public.admin_users for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "admin_users_super_admin_write" on public.admin_users;
create policy "admin_users_super_admin_write"
  on public.admin_users for insert
  to authenticated
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'super_admin'));

drop policy if exists "admin_users_super_admin_update" on public.admin_users;
create policy "admin_users_super_admin_update"
  on public.admin_users for update
  to authenticated
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'super_admin'));

drop policy if exists "admin_users_super_admin_delete" on public.admin_users;
create policy "admin_users_super_admin_delete"
  on public.admin_users for delete
  to authenticated
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'super_admin'));

-- =========================================================================
-- place_order() needs EXECUTE granted to anonymous customers so checkout
-- works without requiring a login.
-- =========================================================================
grant execute on function public.place_order(text, text, text, text, numeric, numeric, numeric, jsonb) to anon, authenticated;
