/**
 * src/types/database.types.ts
 * -----------------------------------------------------------------------
 * Hand-written reference types describing the Supabase schema (see
 * supabase/migrations/*.sql for the source of truth). The project itself
 * is plain JS/JSX, so nothing imports this file at build time — it's
 * provided for editor intellisense (hover types in VS Code via JSDoc
 * `@type` imports) and as a head start if this project is ever migrated
 * to TypeScript.
 *
 * Column names are snake_case, matching the raw Supabase rows returned
 * by `supabase.from(...).select()` before the `services/*.js` mapper
 * functions convert them to the camelCase shape used by the UI.
 * -----------------------------------------------------------------------
 */

export type UUID = string;

export interface CategoryRow {
  id: string; // slug, e.g. "dairy"
  name: string;
  image_path: string | null; // path inside the "products" bucket
  gradient: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductRow {
  id: string; // e.g. "dairy-1"
  category_id: string;
  name: string;
  description: string | null;
  image_path: string | null; // path inside the "products" bucket
  price: number;
  old_price: number | null;
  in_stock: boolean;
  rating: number;
  is_new: boolean;
  best_seller: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: UUID;
  product_id: string;
  image_path: string; // path inside the "products" bucket
  sort_order: number;
  created_at: string;
}

export interface HomepageBannerRow {
  id: UUID;
  title: string | null;
  subtitle: string | null;
  image_path: string | null; // path inside the "banners" bucket
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRow {
  id: UUID;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WebsiteSettingsRow {
  id: true; // singleton row
  store_name_ar: string;
  store_name_en: string;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  working_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  google_maps_url: string | null;
  delivery_fee: number;
  free_delivery_threshold: number;
  logo_path: string | null; // path inside the "website" bucket
  updated_at: string;
}

export type OrderStatus = "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderRow {
  id: UUID;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
  order_items?: OrderItemRow[]; // present when selected with `*, order_items(*)`
}

export interface OrderItemRow {
  id: UUID;
  order_id: UUID;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export type AdminRole = "admin" | "super_admin";

export interface AdminUserRow {
  id: UUID; // FK -> auth.users.id
  full_name: string | null;
  role: AdminRole;
  created_at: string;
}

/** Convenience map from table name to its row type, for generic helpers. */
export interface Database {
  categories: CategoryRow;
  products: ProductRow;
  product_images: ProductImageRow;
  homepage_banners: HomepageBannerRow;
  contact_messages: ContactMessageRow;
  website_settings: WebsiteSettingsRow;
  orders: OrderRow;
  order_items: OrderItemRow;
  admin_users: AdminUserRow;
}
