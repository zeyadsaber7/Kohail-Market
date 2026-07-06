import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Truck, ShieldCheck, Package, Phone, Flame, Sparkles } from "lucide-react";
import { getProductById, getRelatedProducts } from "../data/products";
import { getCategoryById } from "../data/categories";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import { formatCurrency } from "../utils/currency";
import Breadcrumb from "../components/ui/Breadcrumb";
import Badge from "../components/ui/Badge";
import StarRating from "../components/ui/StarRating";
import SectionHeader from "../components/ui/SectionHeader";
import ProductGrid from "../components/ui/ProductGrid";
import NotFound from "./NotFound";

export default function Product() {
  const { productId } = useParams();
  const { cart, addToCart, setQty } = useCartContext();
  const [qtyLocal, setQtyLocal] = useState(1);

  const product = getProductById(productId);
  const category = product ? getCategoryById(product.categoryId) : null;
  const related = product ? getRelatedProducts(product) : [];

  useSEO({
    title: product ? `${product.name} | كحيل ماركت` : "المنتج غير موجود",
    description: product?.desc,
  });

  if (!product) return <NotFound />;

  const inCart = cart[product.id] || 0;

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      <Breadcrumb
        items={[
          { label: "الرئيسية", to: "/" },
          { label: category?.name || "القسم", to: category ? `/category/${category.id}` : "/" },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-10 bg-white rounded-3xl border border-slate-100 shadow-card p-5 md:p-8">
        {/* image */}
        <div className="bg-slate-50 rounded-2xl flex items-center justify-center p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-start">
            {product.bestSeller && <Badge tone="amber" className="gap-1"><Flame size={11} /> الأكثر مبيعًا</Badge>}
            {product.isNew && <Badge tone="green" className="gap-1"><Sparkles size={11} /> جديد</Badge>}
          </div>
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <Badge tone="red">خصم {product.discount}%</Badge>
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="max-h-72 md:max-h-96 object-contain transition-transform duration-500 ease-smooth group-hover:scale-105"
          />
        </div>

        {/* info */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-brand mb-2 leading-snug">{product.name}</h1>
            <div className="flex items-center gap-3">
              <StarRating value={product.rating} />
              <Badge tone={product.inStock ? "blue" : "gray"}>{product.inStock ? "متوفر" : "غير متوفر"}</Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3 bg-brand/5 rounded-2xl px-4 py-3.5 w-fit">
            <span className="text-3xl font-extrabold text-brand">{formatCurrency(product.price)}</span>
            {product.oldPrice && (
              <div className="flex flex-col items-start">
                <span className="text-slate-400 text-sm line-through">{formatCurrency(product.oldPrice)}</span>
                <span className="text-emerald-600 text-[11px] font-bold">وفّرت {formatCurrency(product.oldPrice - product.price)}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">{product.desc}</p>

          {/* desktop add-to-cart */}
          <div className="hidden md:flex items-center gap-3 pt-2">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setQtyLocal((q) => Math.max(1, q - 1))} className="p-3 hover:bg-slate-50 active:scale-95 transition-all" aria-label="تقليل"><Minus size={16} /></button>
              <span className="w-10 text-center font-bold tabular-nums">{qtyLocal}</span>
              <button onClick={() => setQtyLocal((q) => q + 1)} className="p-3 hover:bg-slate-50 active:scale-95 transition-all" aria-label="زيادة"><Plus size={16} /></button>
            </div>
            <button
              disabled={!product.inStock}
              onClick={() => addToCart(product, qtyLocal)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl hover:bg-brand-light active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={18} /> أضف للسلة {inCart > 0 && `(${inCart} بالسلة)`}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500"><Truck size={16} className="text-brand" /> توصيل سريع</div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={16} className="text-brand" /> منتج أصلي 100%</div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><Package size={16} className="text-brand" /> تغليف آمن</div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><Phone size={16} className="text-brand" /> دعم فوري</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <SectionHeader icon={<Package size={18} />} title="منتجات مشابهة" />
          <ProductGrid products={related} cart={cart} onAdd={addToCart} onQty={setQty} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-5" />
        </section>
      )}

      {/* sticky mobile add-to-cart bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(14,42,77,0.08)] p-3 flex items-center gap-3">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shrink-0">
          <button onClick={() => setQtyLocal((q) => Math.max(1, q - 1))} className="p-2.5 active:scale-95 transition-all" aria-label="تقليل"><Minus size={15} /></button>
          <span className="w-8 text-center font-bold text-sm tabular-nums">{qtyLocal}</span>
          <button onClick={() => setQtyLocal((q) => q + 1)} className="p-2.5 active:scale-95 transition-all" aria-label="زيادة"><Plus size={15} /></button>
        </div>
        <button
          disabled={!product.inStock}
          onClick={() => addToCart(product, qtyLocal)}
          className="flex-1 flex items-center justify-center gap-2 bg-brand disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all"
        >
          <ShoppingCart size={17} /> أضف للسلة
        </button>
      </div>
    </div>
  );
}
