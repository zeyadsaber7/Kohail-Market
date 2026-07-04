-- =========================================================================
-- KOHAIL MARKET — ADMIN DASHBOARD SCHEMA EXTENSIONS
-- Run AFTER 001-003. Adds everything the /admin dashboard needs on top
-- of the original storefront schema.
-- =========================================================================

-- -------------------------------------------------------------------------
-- PRODUCTS: featured flag + discount_percent helper column
-- (old_price already lets us derive a discount; is_featured drives the
-- homepage "Featured products" section independently of best_seller/is_new)
-- -------------------------------------------------------------------------
alter table public.products
  add column if not exists is_featured boolean not null default false;

create index if not exists idx_products_is_featured on public.products(is_featured) where is_featured = true;

-- -------------------------------------------------------------------------
-- PRODUCT_IMAGES — extra gallery images per product (beyond products.image_path,
-- which remains the primary/cover image).
-- -------------------------------------------------------------------------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  image_path  text not null,          -- path inside the "products" storage bucket
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

comment on table public.product_images is 'Additional gallery images for a product, beyond its main products.image_path cover image.';

create index if not exists idx_product_images_product_id on public.product_images(product_id);

-- -------------------------------------------------------------------------
-- HOMEPAGE_BANNERS — hero/promo banners shown on the homepage, fully
-- editable from the admin dashboard.
-- -------------------------------------------------------------------------
create table if not exists public.homepage_banners (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  subtitle    text,
  image_path  text,                   -- path inside the "banners" storage bucket
  link_url    text,                   -- where the banner navigates to when clicked (e.g. /offers)
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.homepage_banners is 'Homepage hero/promo banners, managed from the admin dashboard.';

drop trigger if exists trg_homepage_banners_updated_at on public.homepage_banners;
create trigger trg_homepage_banners_updated_at
  before update on public.homepage_banners
  for each row execute function public.set_updated_at();

create index if not exists idx_homepage_banners_active on public.homepage_banners(is_active, sort_order);

-- -------------------------------------------------------------------------
-- CONTACT_MESSAGES — messages submitted through the public contact form.
-- -------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.contact_messages is 'Messages submitted through the public /contact form.';

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_contact_messages_is_read on public.contact_messages(is_read);

-- -------------------------------------------------------------------------
-- WEBSITE_SETTINGS — single-row table holding store-wide configuration
-- (contact info, social links, delivery fee, etc). Enforced as a single
-- row via a fixed-value check constraint on `id`.
-- -------------------------------------------------------------------------
create table if not exists public.website_settings (
  id                        boolean primary key default true,
  store_name_ar             text not null default 'كحيل ماركت',
  store_name_en             text not null default 'Kohail Market',
  tagline                   text,
  phone                     text,
  whatsapp_number           text,
  email                     text,
  address                   text,
  working_hours             text,
  facebook_url              text,
  instagram_url             text,
  google_maps_url           text,
  delivery_fee              numeric(10,2) not null default 25,
  free_delivery_threshold   numeric(10,2) not null default 300,
  logo_path                 text,          -- path inside the "website" storage bucket
  updated_at                timestamptz not null default now(),

  constraint website_settings_singleton check (id)
);

comment on table public.website_settings is 'Single-row table of store-wide settings, editable from the admin dashboard.';

insert into public.website_settings (id)
values (true)
on conflict (id) do nothing;

drop trigger if exists trg_website_settings_updated_at on public.website_settings;
create trigger trg_website_settings_updated_at
  before update on public.website_settings
  for each row execute function public.set_updated_at();
