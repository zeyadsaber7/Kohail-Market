import { supabase } from "../lib/supabaseClient";

/**
 * src/services/messagesService.js
 * -----------------------------------------------------------------------
 * CRUD layer over `contact_messages`. Anyone (including anonymous
 * visitors) can submit a message; only admins can list/read/delete them —
 * enforced by RLS (see supabase/migrations/005_admin_policies.sql).
 * -----------------------------------------------------------------------
 */

function mapMessage(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

/** Public: submit a new contact message from the storefront's /contact form. */
export async function submitContactMessage({ name, phone, email, message }) {
  const { error } = await supabase.from("contact_messages").insert({
    name,
    phone: phone || null,
    email: email || null,
    message,
  });
  if (error) throw error;
  return true;
}

/** Admin: list all messages, newest first. */
export async function fetchMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapMessage);
}

export async function markMessageRead(id, isRead = true) {
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
  return true;
}
