/**
 * src/constants/site.js
 * -----------------------------------------------------------------------
 * Single source of truth for brand / store configuration.
 * Keeping these values here (instead of scattered across components)
 * means the whole site can be re-branded, or later driven by a
 * Supabase "settings" table, by editing ONE file / ONE query.
 * -----------------------------------------------------------------------
 */

export const SITE = {
  nameAr: "كحيل ماركت",
  nameEn: "Kohail Market",
  tagline: "وجهتك الأولى للتسوق اليومي",
  url: "https://www.kohailmarket.com",
};

export const CONTACT = {
  whatsappNumber: "201063653445", // international format, no + or spaces
  whatsappDisplay: "+20 106 365 3445",
  facebookUrl: "https://www.facebook.com/share/1bM6tc8Uv4/?mibextid=wwXIfr",
  googleMapsUrl: "https://maps.app.goo.gl/77tvwiFMCF2Ab6r3A?g_st=iw",
  workingHours: "يوميًا من 9 صباحًا حتى 12 منتصف الليل",
};

export const DELIVERY = {
  fee: 25, // EGP flat delivery fee
  freeDeliveryThreshold: 300, // orders above this amount ship free
  paymentMethod: "cash_on_delivery", // only supported method for now
};

/**
 * Placeholder for a future Supabase client.
 * When ready to go live with a real backend:
 *   1. `npm install @supabase/supabase-js`
 *   2. create src/lib/supabaseClient.js exporting a configured client
 *   3. replace the static imports in src/data/*.js with calls like
 *      `supabase.from('products').select('*')`
 * No component code needs to change — pages/components only ever
 * import from src/data, never from raw arrays directly.
 */
export const BACKEND_MODE = "static"; // "static" | "supabase"
