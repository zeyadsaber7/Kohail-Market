/**
 * src/utils/imageCompress.js
 * -----------------------------------------------------------------------
 * Client-side image compression using the browser's native Canvas API —
 * no extra npm dependency needed. Used by the admin dashboard before any
 * image is uploaded to Supabase Storage, so large phone-camera photos
 * (often 4-8MB) don't get pushed to the buckets as-is.
 *
 * Resizes to a max dimension and re-encodes as JPEG/WebP at a target
 * quality. Falls back to the original file if compression fails for any
 * reason (e.g. unsupported format) so uploads never hard-fail because of
 * this step.
 * -----------------------------------------------------------------------
 */

const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.8;

/**
 * @param {File} file - original image file selected by the admin
 * @param {Object} [options]
 * @param {number} [options.maxDimension=1600] - max width/height in pixels
 * @param {number} [options.quality=0.8] - JPEG quality (0-1)
 * @returns {Promise<File>} a new, compressed File (same name, .jpg extension forced)
 */
export async function compressImage(file, options = {}) {
  const { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = options;

  if (!file || !file.type?.startsWith("image/")) return file;
  // SVGs should never be re-rasterized.
  if (file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;

    // Only use the compressed version if it's actually smaller.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg", lastModified: Date.now() });
  } catch (err) {
    console.warn("[imageCompress] Falling back to original file:", err);
    return file;
  }
}

/** Builds a safe, unique storage filename that keeps the original extension. */
export function buildStorageFileName(originalName) {
  const ext = (originalName.match(/\.[^.]+$/)?.[0] || ".jpg").toLowerCase();
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${random}${ext}`;
}
