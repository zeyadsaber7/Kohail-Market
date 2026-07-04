import { useMemo, useState, useEffect, useCallback } from "react";
import { getProductById } from "../data/products";
import { calcSubtotal, calcDeliveryFee, calcTotal } from "../utils/cart";

const STORAGE_KEY = "kohail_cart_v1";

/**
 * useCart
 * -----------------------------------------------------------------------
 * Centralizes all shopping-cart state: { productId: quantity }.
 * Persists to localStorage so the cart survives a page refresh.
 * Exposes derived values (items, subtotal, deliveryFee, total) so pages
 * never duplicate this math.
 * -----------------------------------------------------------------------
 */
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + qty }));
  }, []);

  const setQty = useCallback((product, qty) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[product.id];
      else next[product.id] = qty;
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: getProductById(id), qty }))
        .filter((x) => x.product),
    [cart]
  );

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = calcSubtotal(items);
  const deliveryFee = calcDeliveryFee(subtotal);
  const total = calcTotal(subtotal, deliveryFee);

  return { cart, items, count, subtotal, deliveryFee, total, addToCart, setQty, removeFromCart, clearCart };
}
