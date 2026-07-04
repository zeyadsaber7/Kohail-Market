import { supabase, getPublicImageUrl, WEBSITE_BUCKET } from "../lib/supabaseClient";

/**
 * src/services/settingsService.js
 * -----------------------------------------------------------------------
 * Reads/writes the single-row `website_settings` table (store info,
 * contact details, social links, delivery config, logo). Public read,
 * admin-only write (see RLS policies).
 * -----------------------------------------------------------------------
 */

function mapSettings(row) {
  if (!row) return null;
  return {
    storeNameAr: row.store_name_ar,
    storeNameEn: row.store_name_en,
    tagline: row.tagline,
    phone: row.phone,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    address: row.address,
    workingHours: row.working_hours,
    facebookUrl: row.facebook_url,
    instagramUrl: row.instagram_url,
    googleMapsUrl: row.google_maps_url,
    deliveryFee: row.delivery_fee !== null ? Number(row.delivery_fee) : 0,
    freeDeliveryThreshold: row.free_delivery_threshold !== null ? Number(row.free_delivery_threshold) : 0,
    logoPath: row.logo_path,
    logoUrl: row.logo_path ? getPublicImageUrl(row.logo_path, WEBSITE_BUCKET) : null,
  };
}

export async function fetchSettings() {
  const { data, error } = await supabase.from("website_settings").select("*").eq("id", true).maybeSingle();
  if (error) throw error;
  return mapSettings(data);
}

export async function updateSettings(updates) {
  const payload = {};
  const map = {
    storeNameAr: "store_name_ar",
    storeNameEn: "store_name_en",
    tagline: "tagline",
    phone: "phone",
    whatsappNumber: "whatsapp_number",
    email: "email",
    address: "address",
    workingHours: "working_hours",
    facebookUrl: "facebook_url",
    instagramUrl: "instagram_url",
    googleMapsUrl: "google_maps_url",
    deliveryFee: "delivery_fee",
    freeDeliveryThreshold: "free_delivery_threshold",
    logoPath: "logo_path",
  };
  for (const [key, column] of Object.entries(map)) {
    if (updates[key] !== undefined) payload[column] = updates[key];
  }

  const { data, error } = await supabase
    .from("website_settings")
    .update(payload)
    .eq("id", true)
    .select()
    .single();
  if (error) throw error;
  return mapSettings(data);
}
