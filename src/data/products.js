/**
 * src/data/products.js
 * -----------------------------------------------------------------------
 * Same pattern as src/data/categories.js: `PRODUCTS` is an in-memory
 * cache of the Supabase `products` table, filled once at app boot by
 * `src/data/store.js`. Every selector below is still a plain, synchronous
 * function — no page or component had to change to make this migration
 * happen. See src/services/productsService.js for the actual Supabase
 * queries (used for the initial load, and reusable for a future admin
 * dashboard or infinite-scroll catalog).
 * -----------------------------------------------------------------------
 */

/** @type {Array<{id:string,name:string,categoryId:string,image:string|null,price:number,oldPrice:number|null,discount:number,desc:string,inStock:boolean,rating:number,isNew:boolean,bestSeller:boolean}>} */
export const PRODUCTS = [];

/** Replaces the cache contents in place (called once by src/data/store.js). */
export function _setProducts(products) {
  PRODUCTS.length = 0;
  PRODUCTS.push(...products);
}

/* -------------------------------------------------------------------- */
/* Selectors — the ONLY way the rest of the app should read product data */
/* -------------------------------------------------------------------- */

export function getAllProducts() {
  return PRODUCTS;
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function getProductsByCategory(categoryId) {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function getOfferProducts() {
  return PRODUCTS.filter((p) => p.discount > 0);
}

export function getBestSellers() {
  // Driven by the `best_seller` boolean column in Supabase — flip it in
  // the products table (or a future admin dashboard) to change this list.
  return PRODUCTS.filter((p) => p.bestSeller);
}

export function getNewArrivals() {
  // Driven by the `is_new` boolean column in Supabase.
  return PRODUCTS.filter((p) => p.isNew);
}

export function getFeaturedProducts() {
  // Driven by the `is_featured` boolean column in Supabase — managed from
  // the admin dashboard's Homepage > Featured products section.
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getSuggestedProducts(limit = 6) {
  // Simple "not already featured elsewhere" pool for now. In a real
  // backend this would be a personalization/recommendation query.
  const pool = PRODUCTS.filter((p) => !p.bestSeller && !p.isNew);
  return pool.slice(0, limit);
}

export function getRelatedProducts(product, limit = 5) {
  return PRODUCTS.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, limit);
}

/** Simple case-insensitive search across product names (client-side, over the cached catalog). */
export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
}
