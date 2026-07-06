/**
 * src/data/categories.js
 * -----------------------------------------------------------------------
 * This file used to hold a hardcoded `categories` array. It now holds a
 * live, in-memory CACHE of the `categories` table in Supabase.
 *
 * WHY A CACHE INSTEAD OF ASYNC FUNCTIONS EVERYWHERE?
 * Every page/component in this app was written against a simple,
 * synchronous API (`CATEGORIES`, `getCategoryById(id)`). Turning every
 * one of those into `async`/`await` + loading states would mean touching
 * every page. Instead, `src/data/store.js` fetches everything from
 * Supabase ONCE when the app boots (see `initDataStore()` in
 * `src/main.jsx`) and fills these arrays in place, *before* the app is
 * rendered. Every page keeps working exactly as before — same imports,
 * same synchronous calls — but the data now genuinely comes from
 * Supabase instead of being hardcoded.
 *
 * `CATEGORIES` is declared with `const` and mutated in place (never
 * reassigned) so every file that imported it keeps the same live
 * reference.
 * -----------------------------------------------------------------------
 */

/** @type {Array<{id:string,name:string,image:string|null,gradient:string,sortOrder:number}>} */
export const CATEGORIES = [];

/** Replaces the cache contents in place (called once by src/data/store.js). */
export function _setCategories(categories) {
  CATEGORIES.length = 0;
  CATEGORIES.push(...categories);
}

/** Convenience lookup: category id -> category object */
export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}
