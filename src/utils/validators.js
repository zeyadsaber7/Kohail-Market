/** Validates an Egyptian mobile number, e.g. 01012345678 */
export function isValidEgyptianPhone(value) {
  return /^01[0-9]{9}$/.test(String(value).trim());
}

/** Validates the checkout form and returns an { field: message } error map. */
export function validateCheckoutForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "الاسم مطلوب";
  if (!isValidEgyptianPhone(form.phone)) errors.phone = "رقم هاتف مصري غير صحيح";
  // Support both the legacy single `address` field and the new split fields
  const addressFromParts = [form.region, form.street, form.buildingOrBlock, form.landmark]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).trim())
    .filter(Boolean)
    .join(", ");
  const effectiveAddress = (form.address || "").trim() || addressFromParts;
  if (!effectiveAddress) errors.address = "العنوان مطلوب";
  return errors;
}
