import { DELIVERY } from "../constants/site";

/** Sum of price * qty for every line item. */
export function calcSubtotal(items) {
  return items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
}

/** Delivery fee is waived above the free-delivery threshold, and is 0 for an empty cart. */
export function calcDeliveryFee(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= DELIVERY.freeDeliveryThreshold ? 0 : DELIVERY.fee;
}

export function calcTotal(subtotal, deliveryFee) {
  return subtotal + deliveryFee;
}
