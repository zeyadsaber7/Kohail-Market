import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Flame, Sparkles } from "lucide-react";
import { formatCurrency } from "../../utils/currency";
import Skeleton from "./Skeleton";
import Badge from "./Badge";
import StarRating from "./StarRating";

/**
 * ProductCard
 * -----------------------------------------------------------------------
 * The single reusable "product tile" used everywhere a product grid is
 * rendered (home rows, category listing, search results, offers, best
 * sellers, related/suggested products). All product-specific logic
 * (badges, add-to-cart, quantity stepper, hover motion) lives here once.
 * -----------------------------------------------------------------------
 */
export default function ProductCard({ product, qty = 0, onAdd, onQty, delay = 0 }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 ease-smooth overflow-hidden flex flex-col animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ---- image + badges ---- */}
      <Link to={`/product/${product.id}`} className="relative aspect-square bg-slate-50 block overflow-hidden">
        {!loaded && <Skeleton className="absolute inset-0 rounded-none skeleton-shimmer" />}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-smooth group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* top badges: stock/new/bestseller on the right, discount on the left */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-start">
          {product.bestSeller && (
            <Badge tone="amber" className="gap-1"><Flame size={11} /> الأكثر مبيعًا</Badge>
          )}
          {product.isNew && (
            <Badge tone="green" className="gap-1"><Sparkles size={11} /> جديد</Badge>
          )}
        </div>
        {product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge tone="red">خصم {product.discount}%</Badge>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
            <Badge tone="gray">غير متوفر</Badge>
          </div>
        )}

        {/* subtle bottom gradient on hover to lift the image */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* ---- info ---- */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link to={`/product/${product.id}`} className="text-sm font-semibold text-brand leading-snug line-clamp-2 min-h-[2.5em] hover:text-brand-light transition-colors">
          {product.name}
        </Link>
        <StarRating value={product.rating} />

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-brand font-extrabold text-[15px]">{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-slate-400 text-xs line-through decoration-rose-300">{formatCurrency(product.oldPrice)}</span>
          )}
        </div>

        <div className="mt-auto pt-2">
          {qty > 0 ? (
            <div className="flex items-center justify-between bg-brand rounded-xl overflow-hidden animate-fadeInScale">
              <button className="p-2.5 text-white hover:bg-white/15 active:scale-95 transition-all" onClick={() => onQty(product, qty - 1)} aria-label="تقليل الكمية">
                <Minus size={15} />
              </button>
              <span className="text-white font-bold text-sm tabular-nums">{qty}</span>
              <button className="p-2.5 text-white hover:bg-white/15 active:scale-95 transition-all" onClick={() => onQty(product, qty + 1)} aria-label="زيادة الكمية">
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <button
              disabled={!product.inStock}
              onClick={() => onAdd(product)}
              className="w-full flex items-center justify-center gap-1.5 bg-brand disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-brand-light active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={15} /> أضف للسلة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
