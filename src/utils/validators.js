/** Validates an Egyptian mobile number, e.g. 01012345678 */
export function isValidEgyptianPhone(value) {
  return /^01[0-9]{9}$/.test(String(value).trim());
}

/** Validates the checkout form and returns an { field: message } error map. */
export function validateCheckoutForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "الاسم مطلوب";
  if (!isValidEgyptianPhone(form.phone)) errors.phone = "رقم هاتف مصري غير صحيح";
  if (!form.address.trim()) errors.address = "العنوان مطلوب";
  return errors;
}
