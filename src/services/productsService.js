import { supabase, getPublicImageUrl } from "../lib/supabaseClient";

/**
 * src/services/productsService.js
 * -----------------------------------------------------------------------
 * Reusable, thin API layer over the `products` table. No caching, no UI
 * logic — just CRUD + query helpers any part of the app can reuse.
 * -----------------------------------------------------------------------
 */

/** Maps a raw `products` row to the shape the UI expects. */
function mapProduct(row) {
  const discount = row.old_price ? Math.round(((row.old_price - row.price) / row.old_price) * 100) : 0;
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
<<<<<<< HEAD
    imagePath: row.image_path,
=======
>>>>>>> fd87fe64f9c4879212f53955694a3138a18ad237
    image: row.image_path ? getPublicImageUrl(row.image_path) : null,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    discount,
    desc: row.description,
    inStock: row.in_stock,
    rating: row.rating ? Number(row.rating) : 0,
    isNew: row.is_new,
    bestSeller: row.best_seller,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
  };
}

export async function fetchAllProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchProductById(id) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function fetchProductsByCategory(categoryId) {
  const { data, error } = await supabase.from("products").select("*").eq("category_id", categoryId);
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function searchProductsRemote(query) {
  const { data, error } = await supabase.from("products").select("*").ilike("name", `%${query}%`);
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchProductsAdmin({ search = "", categoryId = "" } = {}) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (search) query = query.ilike("name", `%${search}%`);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapProduct);
}

/** Converts the camelCase shape used by admin forms into DB column names. */
function toDbColumns(product) {
  const payload = {};
  const map = {
    id: "id",
    categoryId: "category_id",
    name: "name",
    desc: "description",
    description: "description",
    imagePath: "image_path",
    price: "price",
    oldPrice: "old_price",
    inStock: "in_stock",
    rating: "rating",
    isNew: "is_new",
    bestSeller: "best_seller",
    isFeatured: "is_featured",
  };
  for (const [key, column] of Object.entries(map)) {
    if (product[key] !== undefined) payload[column] = product[key];
  }
  return payload;
}

export async function createProductRow(product) {
  const { data, error } = await supabase.from("products").insert(toDbColumns(product)).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProductRow(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(toDbColumns(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProductRow(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}
