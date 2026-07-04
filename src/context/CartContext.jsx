import { createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";

/**
 * CartContext
 * -----------------------------------------------------------------------
 * Wraps useCart + useToast in a single React Context so any component
 * (Header cart icon, ProductCard "add to cart", Cart/Checkout pages)
 * can read/update the cart without prop-drilling. This is also the
 * natural seam for a future Supabase-backed cart (e.g. syncing to a
 * `cart_items` table per logged-in user) — only this file would change.
 * -----------------------------------------------------------------------
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCart();
  const { toast, showToast } = useToast();

  const addToCart = (product, qty = 1) => {
    cart.addToCart(product, qty);
    showToast(`تمت إضافة "${product.name}" للسلة`);
  };

  const value = { ...cart, addToCart, toast, showToast };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a <CartProvider>");
  return ctx;
}
