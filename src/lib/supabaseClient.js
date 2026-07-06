import { createClient } from "@supabase/supabase-js";

/**
 * src/lib/supabaseClient.js
 * -----------------------------------------------------------------------
 * Single Supabase client instance for the whole app (anon/public key only
 * — safe to ship in the frontend bundle since access is governed by
 * Row Level Security policies, not by keeping this key secret).
 *
 * Required environment variables (see .env.example):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 * -----------------------------------------------------------------------
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently returning empty data everywhere.
  console.error(
    "[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Copy .env.example to .env and fill in your project credentials."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Storage buckets used across the app. Each is a separate public bucket
 * (see supabase/migrations/003_storage.sql):
 *   - PRODUCTS_BUCKET: category images + product cover/gallery images
 *   - BANNERS_BUCKET:  homepage banner images
 *   - WEBSITE_BUCKET:  logo + other site-wide assets
 */
export const PRODUCTS_BUCKET = "products";
export const BANNERS_BUCKET = "banners";
export const WEBSITE_BUCKET = "website";

/** Kept for backward compatibility with older code that imported the old name. */
export const PRODUCT_IMAGES_BUCKET = PRODUCTS_BUCKET;

/** Builds a public URL for a file stored in the given bucket (defaults to the products bucket). */
export function getPublicImageUrl(path, bucket = PRODUCTS_BUCKET) {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
}
