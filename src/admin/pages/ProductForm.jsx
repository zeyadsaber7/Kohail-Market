import { useEffect, useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { PRODUCTS_BUCKET } from "../../lib/supabaseClient";
import ImageUploader from "../components/ImageUploader";
import {
  fetchProductImages,
  addProductImage,
  deleteProductImage,
} from "../../services/productImagesService";
import { uploadImageToStorage, deleteImageFromStorage } from "../../services/storageService";

function slugify(name, categoryId) {
  const base = (categoryId || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export default function ProductForm({ product, categories, onClose, onSave }) {
  const isNew = !product;
  const [values, setValues] = useState(() => ({
    id: product?.id || "",
    name: product?.name || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    desc: product?.desc || "",
    price: product?.price ?? "",
    oldPrice: product?.oldPrice ?? "",
    inStock: product?.inStock ?? true,
    rating: product?.rating ?? 4.5,
    isNew: product?.isNew ?? false,
    bestSeller: product?.bestSeller ?? false,
    isFeatured: product?.isFeatured ?? false,
    imagePath: product?.imagePath ?? null,
    image: product?.image ?? null,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchProductImages(product.id).then(setGallery).catch(() => {});
    }
  }, [isNew, product]);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.name.trim() || !values.categoryId || values.price === "") {
      setError("من فضلك أكمل الاسم والقسم والسعر");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...values,
        id: isNew ? values.id || slugify(values.name, values.categoryId) : values.id,
        price: Number(values.price),
        oldPrice: values.oldPrice === "" ? null : Number(values.oldPrice),
        rating: Number(values.rating),
      };
      await onSave(payload, isNew);
    } catch (err) {
      console.error("[ProductForm] save failed:", err);
      setError(err?.message?.includes("duplicate") ? "معرّف المنتج مستخدم من قبل" : "فشل حفظ المنتج");
    } finally {
      setSaving(false);
    }
  }

  async function handleGalleryAdd(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || isNew) return;
    setGalleryUploading(true);
    try {
      const { path } = await uploadImageToStorage(file, PRODUCTS_BUCKET, `products/${product.id}`);
      const img = await addProductImage(product.id, path, gallery.length);
      setGallery((g) => [...g, img]);
    } catch (err) {
      console.error("[ProductForm] gallery upload failed:", err);
    } finally {
      setGalleryUploading(false);
    }
  }

  async function handleGalleryDelete(img) {
    try {
      await deleteProductImage(img.id);
      await deleteImageFromStorage(img.path, PRODUCTS_BUCKET);
      setGallery((g) => g.filter((i) => i.id !== img.id));
    } catch (err) {
      console.error("[ProductForm] gallery delete failed:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-start md:items-center justify-center p-0 md:p-4 bg-black/40 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full md:max-w-2xl md:rounded-3xl shadow-2xl min-h-screen md:min-h-0 md:max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-brand text-base">{isNew ? "إضافة منتج جديد" : "تعديل المنتج"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex gap-4 items-start">
            <ImageUploader
              bucket={PRODUCTS_BUCKET}
              folder={values.id ? `products/${values.id}` : "products/temp"}
              path={values.imagePath}
              url={values.image}
              onChange={({ path, url }) => {
                update("imagePath", path);
                update("image", url);
              }}
              label="صورة الغلاف"
            />
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="اسم المنتج *" className="col-span-2">
                <input
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                  placeholder="مثال: جبنة رومي"
                />
              </Field>
              <Field label="القسم *">
                <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="معرّف المنتج (id)">
                <input
                  value={values.id}
                  onChange={(e) => update("id", e.target.value)}
                  disabled={!isNew}
                  className="input disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="يُنشأ تلقائيًا إن تُرك فارغًا"
                />
              </Field>
            </div>
          </div>

          <Field label="الوصف">
            <textarea
              value={values.desc}
              onChange={(e) => update("desc", e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="السعر (ج.م) *">
              <input type="number" step="0.01" min="0" value={values.price} onChange={(e) => update("price", e.target.value)} className="input" />
            </Field>
            <Field label="السعر قبل الخصم">
              <input type="number" step="0.01" min="0" value={values.oldPrice} onChange={(e) => update("oldPrice", e.target.value)} className="input" placeholder="اختياري" />
            </Field>
            <Field label="التقييم (0-5)">
              <input type="number" step="0.1" min="0" max="5" value={values.rating} onChange={(e) => update("rating", e.target.value)} className="input" />
            </Field>
            <Field label="حالة المخزون">
              <select value={values.inStock ? "1" : "0"} onChange={(e) => update("inStock", e.target.value === "1")} className="input">
                <option value="1">متوفر</option>
                <option value="0">غير متوفر</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-4">
            <Checkbox label="منتج جديد" checked={values.isNew} onChange={(v) => update("isNew", v)} />
            <Checkbox label="الأكثر مبيعًا" checked={values.bestSeller} onChange={(v) => update("bestSeller", v)} />
            <Checkbox label="منتج مميز (الصفحة الرئيسية)" checked={values.isFeatured} onChange={(v) => update("isFeatured", v)} />
          </div>

          {!isNew && (
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">صور إضافية للمعرض</p>
              <div className="flex flex-wrap gap-3">
                {gallery.map((img) => (
                  <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(img)}
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand cursor-pointer">
                  {galleryUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleGalleryAdd} disabled={galleryUploading} />
                </label>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand-light disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isNew ? "إضافة المنتج" : "حفظ التعديلات"}
          </button>
        </div>
      </form>

      <style>{`.input{width:100%;border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.55rem 0.75rem;font-size:0.875rem}.input:focus{outline:none;border-color:#0e2a4d}`}</style>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-brand" />
      {label}
    </label>
  );
}
