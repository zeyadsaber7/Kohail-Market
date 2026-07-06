/**
 * supabase/seed/seed.mjs
 * -----------------------------------------------------------------------
 * One-time migration script: uploads every category/product image to the
 * "products" Storage bucket (and the brand logo to "website"), then
 * upserts the categories/products rows in supabase/seed/data.mjs into
 * Postgres.
 *
 * Uses the SERVICE ROLE key (bypasses RLS) — never run this in the
 * browser, never commit the key. Run locally:
 *
 *   npm run seed
 *
 * Requires in your .env (see .env.example):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 * -----------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES, PRODUCTS, BRAND_LOGO_FILE } from "./data.mjs";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const IMAGES_ROOT = path.join(PROJECT_ROOT, "public/assets/images");
const BUCKET = "products";
const WEBSITE_BUCKET = "website";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Uploads a local file to Storage (if not already there) and returns its bucket path. */
async function uploadImage(localRelativePath, storagePath, bucket = BUCKET) {
  const localAbsPath = path.join(IMAGES_ROOT, localRelativePath);
  if (!fs.existsSync(localAbsPath)) {
    console.warn(`  ⚠ missing local file, skipping: ${localAbsPath}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(localAbsPath);
  const contentType = localAbsPath.endsWith(".png") ? "image/png" : "image/jpeg";

  const { error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
    contentType,
    upsert: true,
  });
  if (error) {
    console.error(`  ✗ failed to upload ${storagePath}:`, error.message);
    return null;
  }
  console.log(`  ✓ uploaded ${storagePath}`);
  return storagePath;
}

async function seedBrandLogo() {
  console.log("\n📦 Uploading brand logo...");
  const logoPath = await uploadImage(BRAND_LOGO_FILE, BRAND_LOGO_FILE, WEBSITE_BUCKET);
  if (logoPath) {
    const { error } = await supabase.from("website_settings").update({ logo_path: logoPath }).eq("id", true);
    if (error) console.error("  ✗ failed to save logo_path to website_settings:", error.message);
  }
}

async function seedCategories() {
  console.log("\n📦 Uploading category images + upserting categories...");
  const rows = [];
  for (const cat of CATEGORIES) {
    let imagePath = null;
    if (cat.imageFile) {
      imagePath = await uploadImage(cat.imageFile, `categories/${cat.id}.jpg`);
    }
    rows.push({
      id: cat.id,
      name: cat.name,
      image_path: imagePath,
      gradient: cat.gradient,
      sort_order: cat.sortOrder,
    });
  }
  const { error } = await supabase.from("categories").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`  ✓ upserted ${rows.length} categories`);
}

async function seedProducts() {
  console.log("\n📦 Uploading product images + upserting products...");
  const rows = [];
  for (const p of PRODUCTS) {
    const imagePath = await uploadImage(p.imageFile, `products/${p.id}.jpg`);
    rows.push({
      id: p.id,
      category_id: p.categoryId,
      name: p.name,
      description: p.desc,
      image_path: imagePath,
      price: p.price,
      old_price: p.oldPrice ?? null,
      in_stock: p.inStock ?? true,
      rating: p.rating ?? 4.5,
      is_new: p.isNew ?? false,
      best_seller: p.bestSeller ?? false,
    });
  }
  const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`  ✓ upserted ${rows.length} products`);
}

async function main() {
  console.log("🚀 Seeding Kohail Market Supabase project...");
  await seedBrandLogo();
  await seedCategories(); // must run before products (FK: products.category_id -> categories.id)
  await seedProducts();
  console.log("\n✅ Done. Your Supabase project now has all categories/products + images.");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
