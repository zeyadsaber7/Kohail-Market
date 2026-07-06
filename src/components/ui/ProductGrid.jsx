import ProductCard from "./ProductCard";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";
import { PackageSearch } from "lucide-react";

/**
 * ProductGrid
 * Reusable responsive grid of ProductCards, with a built-in skeleton
 * loading state and a shared empty-state.
 */
export default function ProductGrid({
  products,
  cart,
  onAdd,
  onQty,
  loading = false,
  skeletonCount = 6,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  emptyTitle = "لا توجد منتجات",
  emptyMessage = "لا توجد منتجات لعرضها في هذا القسم حاليًا",
}) {
  if (loading) {
    return (
      <div className={`grid ${cols} gap-3 md:gap-4`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-3">
            <Skeleton className="aspect-square w-full mb-3 skeleton-shimmer" />
            <Skeleton className="h-3 w-4/5 mb-2 skeleton-shimmer" />
            <Skeleton className="h-3 w-2/5 mb-3 skeleton-shimmer" />
            <Skeleton className="h-9 w-full skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState icon={<PackageSearch size={34} />} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className={`grid ${cols} gap-3 md:gap-4`}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          qty={cart?.[product.id] || 0}
          onAdd={onAdd}
          onQty={onQty}
          delay={i * 30}
        />
      ))}
    </div>
  );
}
