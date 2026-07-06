import { fetchCategories } from "../services/categoriesService";
import { fetchAllProducts } from "../services/productsService";
import { _setCategories } from "./categories";
import { _setProducts } from "./products";

/**
 * src/data/store.js
 * -----------------------------------------------------------------------
 * Boots the app's data layer: fetches categories + products from
 * Supabase once, and fills the synchronous caches in categories.js /
 * products.js. Call `await initDataStore()` before mounting <App /> (see
 * src/main.jsx) so every page can keep reading CATEGORIES / PRODUCTS /
 * getXxx() synchronously, exactly like before the migration.
 * -----------------------------------------------------------------------
 */
let readyPromise = null;

export function initDataStore() {
  if (!readyPromise) {
    readyPromise = Promise.all([fetchCategories(), fetchAllProducts()]).then(([categories, products]) => {
      _setCategories(categories);
      _setProducts(products);
    });
  }
  return readyPromise;
}

/** Re-fetches fresh data from Supabase and updates the caches in place (e.g. after an admin edit). */
export async function refreshDataStore() {
  const [categories, products] = await Promise.all([fetchCategories(), fetchAllProducts()]);
  _setCategories(categories);
  _setProducts(products);
}
