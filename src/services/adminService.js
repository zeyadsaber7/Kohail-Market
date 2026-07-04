import { supabase } from "../lib/supabaseClient";

/**
 * src/services/adminService.js
 * -----------------------------------------------------------------------
 * Reusable auth helpers for a future admin dashboard. Not called from any
 * current storefront page — provided so the `admin_users` table has a
 * ready-to-use API the moment an /admin area is built, without touching
 * this file again.
 *
 * Admin accounts are created in Supabase Auth (email/password), and the
 * `admin_users` table links `auth.users.id` to a role. See
 * supabase/schema.sql + supabase/policies.sql for the `is_admin()` helper
 * used by RLS to gate writes on categories/products and reads on orders.
 * -----------------------------------------------------------------------
 */

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentAdmin() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const { data, error } = await supabase.from("admin_users").select("*").eq("id", userData.user.id).maybeSingle();
  if (error) throw error;
  return data;
}
