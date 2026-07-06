import { supabase, getPublicImageUrl, BANNERS_BUCKET } from "../lib/supabaseClient";

/**
 * src/services/bannersService.js
 * -----------------------------------------------------------------------
 * CRUD layer over the `homepage_banners` table, used by both the public
 * homepage (active banners only) and the admin dashboard (all banners).
 * -----------------------------------------------------------------------
 */

function mapBanner(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image_path ? getPublicImageUrl(row.image_path, BANNERS_BUCKET) : null,
    imagePath: row.image_path,
    linkUrl: row.link_url,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

/** Public: only active banners, in display order. */
export async function fetchActiveBanners() {
  const { data, error } = await supabase
    .from("homepage_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapBanner);
}

/** Admin: every banner regardless of active state. */
export async function fetchAllBanners() {
  const { data, error } = await supabase
    .from("homepage_banners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapBanner);
}

export async function createBanner(banner) {
  const { data, error } = await supabase
    .from("homepage_banners")
    .insert({
      title: banner.title ?? null,
      subtitle: banner.subtitle ?? null,
      image_path: banner.imagePath ?? null,
      link_url: banner.linkUrl ?? null,
      is_active: banner.isActive ?? true,
      sort_order: banner.sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBanner(data);
}

export async function updateBanner(id, updates) {
  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
  if (updates.imagePath !== undefined) payload.image_path = updates.imagePath;
  if (updates.linkUrl !== undefined) payload.link_url = updates.linkUrl;
  if (updates.isActive !== undefined) payload.is_active = updates.isActive;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await supabase.from("homepage_banners").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return mapBanner(data);
}

export async function deleteBanner(id) {
  const { error } = await supabase.from("homepage_banners").delete().eq("id", id);
  if (error) throw error;
  return true;
}
