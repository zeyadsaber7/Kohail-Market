import { supabase, getPublicImageUrl, PRODUCTS_BUCKET } from "../lib/supabaseClient";

/**
 * src/services/productImagesService.js
 * -----------------------------------------------------------------------
 * CRUD layer over `product_images` — the extra gallery images shown on a
 * product page beyond its main `products.image_path` cover image.
 * -----------------------------------------------------------------------
 */

function mapImage(row) {
  return {
    id: row.id,
    productId: row.product_id,
    path: row.image_path,
    url: getPublicImageUrl(row.image_path, PRODUCTS_BUCKET),
    sortOrder: row.sort_order,
  };
}

export async function fetchProductImages(productId) {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapImage);
}

export async function addProductImage(productId, imagePath, sortOrder = 0) {
  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, image_path: imagePath, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return mapImage(data);
}

export async function deleteProductImage(id) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
  return true;
}
