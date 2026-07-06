/**
 * Formats a number as an Egyptian Pound price string, e.g. 1250 -> "1,250 ج.م"
 */
export function formatCurrency(amount) {
  return `${Number(amount).toLocaleString("ar-EG")} ج.م`;
}
