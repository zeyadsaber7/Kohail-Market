import { supabase, getPublicImageUrl } from "../lib/supabaseClient";

/**
 * src/services/categoriesService.js
 * -----------------------------------------------------------------------
 * Reusable, thin API layer over the `categories` table. Contains no
 * caching and no UI logic — just typed CRUD calls any part of the app
 * (storefront today, an admin dashboard tomorrow) can reuse.
 * -----------------------------------------------------------------------
 */

/** Maps a raw `categories` row to the shape the UI expects. */
function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.image_path ? getPublicImageUrl(row.image_path) : null,
    imagePath: row.image_path,
    gradient: row.gradient,
    sortOrder: row.sort_order,
  };
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapCategory);
}

export async function fetchCategoryById(id) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapCategory(data) : null;
}

export async function createCategory(category) {
  const { data, error } = await supabase.from("categories").insert(category).select().single();
  if (error) throw error;
  return mapCategory(data);
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return mapCategory(data);
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
}
