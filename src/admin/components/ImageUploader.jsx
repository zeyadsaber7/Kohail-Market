import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadImageToStorage, deleteImageFromStorage } from "../../services/storageService";

/**
 * src/admin/components/ImageUploader.jsx
 * -----------------------------------------------------------------------
 * Single-image picker used throughout the admin dashboard (product cover,
 * category image, banner image, logo). Compresses the file, uploads it to
 * the given bucket/folder, and reports the new storage path + public URL
 * back to the parent via onChange. Deletes the previous file when
 * replaced or cleared.
 * -----------------------------------------------------------------------
 */
export default function ImageUploader({ bucket, folder, path, url, onChange, label = "الصورة", square = true }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const previousPath = path;
      const result = await uploadImageToStorage(file, bucket, folder);
      onChange({ path: result.path, url: result.url });
      if (previousPath) {
        deleteImageFromStorage(previousPath, bucket).catch(() => {});
      }
    } catch (err) {
      console.error("[ImageUploader] upload failed:", err);
      setError("فشل رفع الصورة، حاول مرة أخرى");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (path) {
      deleteImageFromStorage(path, bucket).catch(() => {});
    }
    onChange({ path: null, url: null });
  }

  return (
    <div>
      {label && <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>}
      <div className={`relative ${square ? "w-28 h-28" : "w-full h-36"} rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center group`}>
        {uploading ? (
          <Loader2 className="animate-spin text-brand" size={22} />
        ) : url ? (
          <>
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="إزالة الصورة"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand transition-colors"
          >
            <ImagePlus size={22} />
            <span className="text-[11px] font-semibold">إضافة صورة</span>
          </button>
        )}
      </div>
      {url && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1.5 text-[11px] font-bold text-brand hover:underline"
        >
          تغيير الصورة
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
