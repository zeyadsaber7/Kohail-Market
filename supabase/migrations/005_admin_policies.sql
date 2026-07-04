-- =========================================================================
-- KOHAIL MARKET — RLS POLICIES FOR ADMIN DASHBOARD TABLES
-- Run AFTER 004_admin_tables.sql.
-- =========================================================================

-- =========================================================================
-- PRODUCT_IMAGES — public read (storefront gallery), admin-only write
-- =========================================================================
alter table public.product_images enable row level security;

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
  on public.product_images for select
  to anon, authenticated
  using (true);

drop policy if exists "product_images_admin_insert" on public.product_images;
create policy "product_images_admin_insert"
  on public.product_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "product_images_admin_update" on public.product_images;
create policy "product_images_admin_update"
  on public.product_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_images_admin_delete" on public.product_images;
create policy "product_images_admin_delete"
  on public.product_images for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- HOMEPAGE_BANNERS — public read of ACTIVE banners only, admin reads all,
-- admin-only write
-- =========================================================================
alter table public.homepage_banners enable row level security;

drop policy if exists "homepage_banners_public_read" on public.homepage_banners;
create policy "homepage_banners_public_read"
  on public.homepage_banners for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "homepage_banners_admin_insert" on public.homepage_banners;
create policy "homepage_banners_admin_insert"
  on public.homepage_banners for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "homepage_banners_admin_update" on public.homepage_banners;
create policy "homepage_banners_admin_update"
  on public.homepage_banners for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "homepage_banners_admin_delete" on public.homepage_banners;
create policy "homepage_banners_admin_delete"
  on public.homepage_banners for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- CONTACT_MESSAGES — anyone (including anonymous visitors) can INSERT a
-- message; only admins can read/update/delete. No public SELECT policy
-- exists on purpose, so a visitor can never read other people's messages.
-- =========================================================================
alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_messages_admin_read" on public.contact_messages;
create policy "contact_messages_admin_read"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "contact_messages_admin_update" on public.contact_messages;
create policy "contact_messages_admin_update"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact_messages_admin_delete" on public.contact_messages;
create policy "contact_messages_admin_delete"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- =========================================================================
-- WEBSITE_SETTINGS — public read (storefront needs phone/social/etc),
-- admin-only write. Single row, so no INSERT/DELETE policy is needed
-- (the row is created once by migration 004 and only ever UPDATEd).
-- =========================================================================
alter table public.website_settings enable row level security;

drop policy if exists "website_settings_public_read" on public.website_settings;
create policy "website_settings_public_read"
  on public.website_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "website_settings_admin_update" on public.website_settings;
create policy "website_settings_admin_update"
  on public.website_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
