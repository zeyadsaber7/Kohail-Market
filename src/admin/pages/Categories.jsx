import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, FolderTree } from "lucide-react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoriesService";
import { deleteImageFromStorage } from "../../services/storageService";
import { PRODUCTS_BUCKET } from "../../lib/supabaseClient";
import ImageUploader from "../components/ImageUploader";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

const GRADIENTS = [
  "from-slate-600 to-slate-400",
  "from-blue-600 to-blue-400",
  "from-emerald-600 to-emerald-400",
  "from-amber-600 to-amber-400",
  "from-rose-600 to-rose-400",
  "from-violet-600 to-violet-400",
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // "new" | category | null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      setCategories(await fetchCategories());
    } catch (err) {
      console.error("[Categories] load failed:", err);
      showToast("تعذر تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      if (deleteTarget.imagePath) deleteImageFromStorage(deleteTarget.imagePath, PRODUCTS_BUCKET).catch(() => {});
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("تم حذف القسم");
      setDeleteTarget(null);
    } catch (err) {
      console.error("[Categories] delete failed:", err);
      showToast("تعذر الحذف — تأكد من عدم وجود منتجات مرتبطة بهذا القسم");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-brand">الأقسام</h1>
          <p className="text-sm text-slate-400">{categories.length} قسم</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="bg-brand text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-brand-light transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} /> إضافة قسم
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          <FolderTree size={28} className="mx-auto mb-2" /> لا توجد أقسام بعد
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex items-center gap-3">
              <img src={c.image || "/apple-touch-icon.png"} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brand truncate">{c.name}</p>
                <p className="text-xs text-slate-400">ترتيب العرض: {c.sortOrder}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setEditing(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-brand/10 hover:text-brand">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteTarget(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CategoryForm
          category={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setCategories((prev) => (isNew ? [...prev, saved] : prev.map((c) => (c.id === saved.id ? saved : c))));
            showToast(isNew ? "تم إضافة القسم" : "تم حفظ التعديلات");
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`حذف "${deleteTarget?.name}"؟`}
        description="لن يمكن حذف القسم إذا كانت هناك منتجات مرتبطة به."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />

      <Toast message={toast} />
    </div>
  );
}

function CategoryForm({ category, onClose, onSaved }) {
  const isNew = !category;
  const [id, setId] = useState(category?.id || "");
  const [name, setName] = useState(category?.name || "");
  const [gradient, setGradient] = useState(category?.gradient || GRADIENTS[0]);
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [imagePath, setImagePath] = useState(category?.imagePath ?? null);
  const [image, setImage] = useState(category?.image ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || (isNew && !id.trim())) {
      setError("من فضلك أكمل الاسم والمعرّف");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        gradient,
        sort_order: Number(sortOrder) || 0,
        image_path: imagePath,
      };
      if (isNew) {
        const created = await createCategory({ id: id.trim().toLowerCase().replace(/\s+/g, "-"), ...payload });
        onSaved(created, true);
      } else {
        const updated = await updateCategory(category.id, payload);
        onSaved(updated, false);
      }
    } catch (err) {
      console.error("[CategoryForm] save failed:", err);
      setError(err?.message?.includes("duplicate") ? "المعرّف مستخدم من قبل" : "فشل حفظ القسم");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-brand text-base">{isNew ? "إضافة قسم" : "تعديل القسم"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <ImageUploader
            bucket={PRODUCTS_BUCKET}
            folder="categories"
            path={imagePath}
            url={image}
            onChange={({ path, url }) => { setImagePath(path); setImage(url); }}
            label="صورة القسم"
          />

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">اسم القسم *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>

          {isNew && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">المعرّف (id) *</label>
              <input value={id} onChange={(e) => setId(e.target.value)} placeholder="مثال: dairy" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">ترتيب العرض</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">لون التدرّج (بطاقة القسم)</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENTS.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGradient(g)}
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${g} ${gradient === g ? "ring-2 ring-offset-2 ring-brand" : ""}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">إلغاء</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand-light disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 size={15} className="animate-spin" />}
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
}
