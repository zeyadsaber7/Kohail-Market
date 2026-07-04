-- =========================================================================
-- KOHAIL MARKET — STORAGE CONFIGURATION
-- Run AFTER 001_schema.sql + 002_policies.sql, in the SQL Editor.
--
-- Three public buckets:
--   products/  -> categories/<category-id>.jpg
--                 products/<product-id>/<file>.jpg   (main + gallery images)
--   banners/   -> homepage banner images
--   website/   -> brand/logo.jpg, favicons, and other site-wide assets
-- =========================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('banners',  'banners',  true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('website',  'website',  true, 5242880, array['image/jpeg','image/png','image/webp','image/x-icon','image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- -------------------------------------------------------------------------
-- Public read for everyone (anon + authenticated) on all three buckets —
-- needed so <img src> tags work without auth.
-- -------------------------------------------------------------------------
drop policy if exists "storefront_buckets_public_read" on storage.objects;
create policy "storefront_buckets_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('products', 'banners', 'website'));

-- -------------------------------------------------------------------------
-- Only admins can upload/replace/delete images in any of the three buckets.
-- -------------------------------------------------------------------------
drop policy if exists "storefront_buckets_admin_insert" on storage.objects;
create policy "storefront_buckets_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('products', 'banners', 'website') and public.is_admin());

drop policy if exists "storefront_buckets_admin_update" on storage.objects;
create policy "storefront_buckets_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('products', 'banners', 'website') and public.is_admin());

drop policy if exists "storefront_buckets_admin_delete" on storage.objects;
create policy "storefront_buckets_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('products', 'banners', 'website') and public.is_admin());

-- NOTE: the seed script (supabase/seed/seed.mjs) uploads the initial
-- images using the service_role key, which bypasses RLS entirely — so
-- these policies only govern uploads made through the app itself
-- (i.e. the /admin dashboard) using a logged-in admin session.

-- -------------------------------------------------------------------------
-- Legacy bucket cleanup note:
-- Earlier versions of this project used a single "product-images" bucket.
-- If your project still has it and you have files there, copy them into
-- the new "products" bucket (Storage -> product-images -> select all ->
-- Move/Copy) before deleting it. New installs can ignore this note.
-- =========================================================================
