import { supabase } from "../lib/supabaseClient";

/**
 * src/services/ordersService.js
 * -----------------------------------------------------------------------
 * Reusable API for creating and (for a future admin dashboard) reading
 * orders. A checkout submission writes one `orders` row plus one
 * `order_items` row per cart line, inside a single Postgres function call
 * so the operation is atomic (see `place_order` in supabase/schema.sql).
 * -----------------------------------------------------------------------
 */

/**
 * Places an order.
 * @param {Object} params
 * @param {{name:string, phone:string, address:string, notes?:string}} params.customer
 * @param {{product:{id:string,name:string,price:number}, qty:number}[]} params.items
 * @param {{subtotal:number, deliveryFee:number, total:number}} params.totals
 */
export async function placeOrder({ customer, items, totals }) {
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: customer.name,
    p_customer_phone: customer.phone,
    p_customer_address: customer.address,
    p_notes: customer.notes || null,
    p_subtotal: totals.subtotal,
    p_delivery_fee: totals.deliveryFee,
    p_total: totals.total,
    p_items: items.map(({ product, qty }) => ({
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: qty,
    })),
  });
  if (error) throw error;
  return data; // new order id
}

/** Admin-only (requires an authenticated admin session — see RLS policies). */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single();
  if (error) throw error;
  return data;
}
