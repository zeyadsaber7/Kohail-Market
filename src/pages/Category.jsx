import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { getCategoryById } from "../data/categories";
import { getProductsByCategory, getOfferProducts } from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/ui/Breadcrumb";
import ProductGrid from "../components/ui/ProductGrid";
import NotFound from "./NotFound";

/** Single category listing (also handles the special "offers" pseudo-category id). */
export default function Category() {
  const { categoryId } = useParams();
  const { cart, addToCart, setQty } = useCartContext();
  const [sort, setSort] = useState("default");

  const category = getCategoryById(categoryId);

  const products = useMemo(() => {
    if (!category) return [];
    let list = category.id === "offers" ? getOfferProducts() : getProductsByCategory(category.id);
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort]);

  useSEO({
    title: category ? `${category.name} | كحيل ماركت` : "القسم غير موجود",
    description: category ? `تسوق أفضل منتجات قسم ${category.name} بأسعار تنافسية وتوصيل سريع من كحيل ماركت.` : undefined,
  });

  if (!category) return <NotFound />;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: category.name }]} />

      <div className={`rounded-3xl bg-gradient-to-l ${category.gradient} p-6 md:p-10 flex items-center justify-between overflow-hidden relative min-h-[140px]`}>
        <div className="relative z-10">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-1">{category.name}</h1>
          <p className="text-white/80 text-sm">{products.length} منتج متاح</p>
        </div>
        {category.image && (
          <img src={category.image} className="hidden md:block h-28 object-contain drop-shadow-2xl relative z-10 animate-floatSlow" alt={category.name} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">{products.length} نتيجة</p>
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 outline-none bg-white focus:ring-2 focus:ring-brand/25 transition-all appearance-none cursor-pointer"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      <ProductGrid
        products={products}
        cart={cart}
        onAdd={addToCart}
        onQty={setQty}
        emptyTitle="لا توجد منتجات بعد"
        emptyMessage="هذا القسم فارغ حاليًا، تصفح أقسامًا أخرى في هذه الأثناء."
      />
    </div>
  );
}
