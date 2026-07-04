import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Star, PackageX } from "lucide-react";
import {
  fetchProductsAdmin,
  createProductRow,
  updateProductRow,
  deleteProductRow,
} from "../../services/productsService";
import { fetchCategories } from "../../services/categoriesService";
import { deleteImageFromStorage } from "../../services/storageService";
import { PRODUCTS_BUCKET } from "../../lib/supabaseClient";
import { formatCurrency } from "../../utils/currency";
import ConfirmDialog from "../components/ConfirmDialog";
import ProductForm from "./ProductForm";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editing, setEditing] = useState(null); // product object | "new" | null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchProductsAdmin({ search, categoryId: categoryFilter }),
        categories.length ? Promise.resolve(categories) : fetchCategories(),
      ]);
      setProducts(prods);
      if (!categories.length) setCategories(cats);
    } catch (err) {
      console.error("[Products] load failed:", err);
      showToast("تعذر تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  async function handleSave(values, isNew) {
    if (isNew) {
      const created = await createProductRow(values);
      setProducts((prev) => [created, ...prev]);
      showToast("تم إضافة المنتج بنجاح");
    } else {
      const updated = await updateProductRow(values.id, values);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast("تم حفظ التعديلات");
    }
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProductRow(deleteTarget.id);
      if (deleteTarget.imagePath) deleteImageFromStorage(deleteTarget.imagePath, PRODUCTS_BUCKET).catch(() => {});
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("تم حذف المنتج");
      setDeleteTarget(null);
    } catch (err) {
      console.error("[Products] delete failed:", err);
      showToast("تعذر حذف المنتج");
    } finally {
      setDeleting(false);
    }
  }

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id) => map.get(id) || id;
  }, [categories]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-brand">المنتجات</h1>
          <p className="text-sm text-slate-400">{products.length} منتج</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="bg-brand text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-brand-light transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المنتج..."
            className="w-full rounded-xl border border-slate-200 pr-9 pl-3 py-2.5 text-sm focus:border-brand focus:outline-none bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-brand focus:outline-none"
        >
          <option value="">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          <PackageX size={28} className="mx-auto mb-2" />
          لا توجد منتجات مطابقة
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
            <span></span>
            <span>المنتج</span>
            <span>القسم</span>
            <span>السعر</span>
            <span>المخزون</span>
            <span>مميز</span>
            <span></span>
          </div>
          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
            >
              <img
                src={p.image || "/apple-touch-icon.png"}
                alt=""
                className="w-11 h-11 rounded-lg object-cover bg-slate-100"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand truncate">{p.name}</p>
                <p className="text-xs text-slate-400 md:hidden">{categoryName(p.categoryId)}</p>
              </div>
              <span className="hidden md:block text-xs text-slate-500">{categoryName(p.categoryId)}</span>
              <span className="hidden md:flex flex-col text-xs">
                <span className="font-bold text-brand">{formatCurrency(p.price)}</span>
                {p.oldPrice && <span className="text-slate-400 line-through">{formatCurrency(p.oldPrice)}</span>}
              </span>
              <span className={`hidden md:inline-flex text-[11px] font-bold px-2 py-1 rounded-full w-fit ${p.inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {p.inStock ? "متوفر" : "غير متوفر"}
              </span>
              <span className="hidden md:block">
                {p.isFeatured && <Star size={16} className="text-amber-400 fill-amber-400" />}
              </span>
              <div className="flex items-center gap-1.5 justify-self-end">
                <button
                  onClick={() => setEditing(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-brand/10 hover:text-brand transition-colors"
                  aria-label="تعديل"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`حذف "${deleteTarget?.name}"؟`}
        description="لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />

      <Toast message={toast} />
    </div>
  );
}
