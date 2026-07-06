-- =========================================================================
-- KOHAIL MARKET — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- =========================================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- -------------------------------------------------------------------------
-- CATEGORIES
-- id is a human-readable slug (e.g. "dairy") so it can be used directly
-- in the site's routes (/category/:categoryId) — no separate slug column.
-- -------------------------------------------------------------------------
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  image_path  text,                 -- path inside the "products" storage bucket
  gradient    text not null default 'from-slate-600 to-slate-400',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

comment on table public.categories is 'Supermarket departments (Dairy, Cheese, Beverages, ...).';
comment on column public.categories.image_path is 'Path inside the products storage bucket, e.g. categories/dairy.jpg';

-- -------------------------------------------------------------------------
-- PRODUCTS
-- -------------------------------------------------------------------------
create table if not exists public.products (
  id           text primary key,     -- e.g. "dairy-1" (kept stable for readable URLs / cart keys)
  category_id  text not null references public.categories(id) on update cascade on delete restrict,
  name         text not null,
  description  text not null default '',
  image_path   text,                 -- path inside the "products" storage bucket
  price        numeric(10,2) not null check (price >= 0),
  old_price    numeric(10,2) check (old_price is null or old_price >= price),
  in_stock     boolean not null default true,
  rating       numeric(2,1) not null default 4.5 check (rating between 0 and 5),
  is_new       boolean not null default false,
  best_seller  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.products is 'Catalog items belonging to a category.';
comment on column public.products.image_path is 'Path inside the products storage bucket, e.g. products/dairy-1/cover.jpg';

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_best_seller on public.products(best_seller) where best_seller = true;
create index if not exists idx_products_is_new on public.products(is_new) where is_new = true;
create index if not exists idx_products_name_trgm on public.products using gin (name gin_trgm_ops);

-- trigram search index needs pg_trgm
create extension if not exists pg_trgm;

-- keep updated_at fresh on every UPDATE
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- ORDERS  +  ORDER_ITEMS
-- One order (customer + totals) has many order_items (product snapshots).
-- Snapshotting product name/price on the line item protects order history
-- from later price changes or product deletions.
-- -------------------------------------------------------------------------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_phone    text not null,
  customer_address  text not null,
  notes             text,
  subtotal          numeric(10,2) not null check (subtotal >= 0),
  delivery_fee      numeric(10,2) not null default 0 check (delivery_fee >= 0),
  total             numeric(10,2) not null check (total >= 0),
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','out_for_delivery','delivered','cancelled')),
  payment_method    text not null default 'cash_on_delivery',
  created_at        timestamptz not null default now()
);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    text references public.products(id) on delete set null,
  product_name  text not null,   -- snapshot at time of order
  unit_price    numeric(10,2) not null check (unit_price >= 0),
  quantity      integer not null check (quantity > 0),
  line_total    numeric(10,2) generated always as (unit_price * quantity) stored
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- -------------------------------------------------------------------------
-- ADMIN_USERS
-- Links a Supabase Auth user (created via Dashboard → Authentication) to
-- an admin role. Having this as its own table (rather than checking email
-- allow-lists in application code) is what RLS policies key off of.
-- -------------------------------------------------------------------------
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin','super_admin')),
  created_at  timestamptz not null default now()
);

comment on table public.admin_users is 'Grants dashboard/admin access to specific Supabase Auth users.';

-- -------------------------------------------------------------------------
-- place_order(...)
-- Atomically inserts one orders row + N order_items rows in a single
-- transaction, callable by anonymous customers (SECURITY DEFINER lets it
-- write even though anon has no direct INSERT grant on order_items —
-- see supabase/policies.sql for the matching RLS policies).
-- -------------------------------------------------------------------------
create or replace function public.place_order(
  p_customer_name    text,
  p_customer_phone   text,
  p_customer_address text,
  p_notes            text,
  p_subtotal         numeric,
  p_delivery_fee     numeric,
  p_total            numeric,
  p_items            jsonb   -- [{ product_id, product_name, unit_price, quantity }, ...]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (customer_name, customer_phone, customer_address, notes, subtotal, delivery_fee, total)
  values (p_customer_name, p_customer_phone, p_customer_address, p_notes, p_subtotal, p_delivery_fee, p_total)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into public.order_items (order_id, product_id, product_name, unit_price, quantity)
    values (
      v_order_id,
      (v_item->>'product_id'),
      (v_item->>'product_name'),
      (v_item->>'unit_price')::numeric,
      (v_item->>'quantity')::integer
    );
  end loop;

  return v_order_id;
end;
$$;

comment on function public.place_order is 'Atomically creates an order + its line items. Callable by anonymous customers at checkout.';
