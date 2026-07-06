import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { fetchAllBanners, createBanner, updateBanner, deleteBanner } from "../../services/bannersService";
import { deleteImageFromStorage } from "../../services/storageService";
import { BANNERS_BUCKET } from "../../lib/supabaseClient";
import ImageUploader from "../components/ImageUploader";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      setBanners(await fetchAllBanners());
    } catch (err) {
      console.error("[Banners] load failed:", err);
      showToast("تعذر تحميل البانرات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleActive(banner) {
    try {
      const updated = await updateBanner(banner.id, { isActive: !banner.isActive });
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      console.error("[Banners] toggle failed:", err);
      showToast("تعذر التحديث");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTarget.id);
      if (deleteTarget.imagePath) deleteImageFromStorage(deleteTarget.imagePath, BANNERS_BUCKET).catch(() => {});
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      showToast("تم حذف البانر");
      setDeleteTarget(null);
    } catch (err) {
      console.error("[Banners] delete failed:", err);
      showToast("تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-brand">بانرات الصفحة الرئيسية</h1>
          <p className="text-sm text-slate-400">{banners.length} بانر</p>
        </div>
        <button onClick={() => setEditing("new")} className="bg-brand text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-brand-light transition-colors flex items-center gap-1.5">
          <Plus size={16} /> إضافة بانر
        </button>
      </div>

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />)}</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          <ImageIcon size={28} className="mx-auto mb-2" /> لا توجد بانرات بعد
        </div>
      ) : (
        <div className="grid gap-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex items-center gap-4">
              <img src={b.image || "/apple-touch-icon.png"} alt="" className="w-24 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brand truncate">{b.title || "بدون عنوان"}</p>
                <p className="text-xs text-slate-400 truncate">{b.subtitle}</p>
                {b.linkUrl && <p className="text-[11px] text-slate-400 truncate" dir="ltr">{b.linkUrl}</p>}
              </div>
              <button onClick={() => toggleActive(b)} className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 ${b.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                {b.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                {b.isActive ? "مفعّل" : "متوقف"}
              </button>
              <button onClick={() => setEditing(b)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-brand/10 hover:text-brand">
                <Pencil size={14} />
              </button>
              <button onClick={() => setDeleteTarget(b)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <BannerForm
          banner={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setBanners((prev) => (isNew ? [...prev, saved] : prev.map((b) => (b.id === saved.id ? saved : b))));
            showToast(isNew ? "تم إضافة البانر" : "تم حفظ التعديلات");
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog open={!!deleteTarget} title="حذف هذا البانر؟" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} busy={deleting} />
      <Toast message={toast} />
    </div>
  );
}

function BannerForm({ banner, onClose, onSaved }) {
  const isNew = !banner;
  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || "");
  const [sortOrder, setSortOrder] = useState(banner?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [imagePath, setImagePath] = useState(banner?.imagePath ?? null);
  const [image, setImage] = useState(banner?.image ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { title, subtitle, linkUrl, sortOrder: Number(sortOrder) || 0, isActive, imagePath };
      if (isNew) onSaved(await createBanner(payload), true);
      else onSaved(await updateBanner(banner.id, payload), false);
    } catch (err) {
      console.error("[BannerForm] save failed:", err);
      setError("فشل حفظ البانر");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-brand text-base">{isNew ? "إضافة بانر" : "تعديل البانر"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="flex flex-col gap-4">
          <ImageUploader bucket={BANNERS_BUCKET} folder="banners" path={imagePath} url={image} onChange={({ path, url }) => { setImagePath(path); setImage(url); }} label="صورة البانر" square={false} />

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">العنوان</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">النص الفرعي</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">الرابط عند الضغط</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/offers" dir="ltr" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">ترتيب العرض</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 pb-2.5">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-brand" />
              مفعّل
            </label>
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
