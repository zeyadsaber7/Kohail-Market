import { supabase, getPublicImageUrl } from "../lib/supabaseClient";
import { compressImage, buildStorageFileName } from "../utils/imageCompress";

/**
 * src/services/storageService.js
 * -----------------------------------------------------------------------
 * One reusable function for the whole admin dashboard: compress an image
 * client-side, then upload it to the given Supabase Storage bucket/folder.
 * Every image picker in the admin (product cover, gallery, category,
 * banner, logo) goes through this single code path.
 * -----------------------------------------------------------------------
 */

/**
 * @param {File} file
 * @param {string} bucket - "products" | "banners" | "website"
 * @param {string} folder - e.g. "products/dairy-1", "categories", "banners", "brand"
 * @returns {Promise<{path:string, url:string}>}
 */
export async function uploadImageToStorage(file, bucket, folder = "") {
  if (!file) throw new Error("No file provided");

  const compressed = await compressImage(file);
  const fileName = buildStorageFileName(compressed.name || file.name);
  const path = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage.from(bucket).upload(path, compressed, {
    contentType: compressed.type || file.type,
    upsert: false,
  });
  if (error) throw error;

  return { path, url: getPublicImageUrl(path, bucket) };
}

/** Deletes a file from a bucket. Safe to call with a null/undefined path (no-op). */
export async function deleteImageFromStorage(path, bucket) {
  if (!path) return true;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}
