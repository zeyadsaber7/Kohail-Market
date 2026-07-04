import { TrendingUp } from "lucide-react";
import { getBestSellers } from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/ui/Breadcrumb";
import ProductGrid from "../components/ui/ProductGrid";

/** Dedicated page listing the store's best-selling products. */
export default function BestSellers() {
  useSEO({
    title: "المنتجات الأكثر مبيعًا | كحيل ماركت",
    description: "تصفح المنتجات الأكثر طلبًا لدى عملاء كحيل ماركت.",
  });

  const { cart, addToCart, setQty } = useCartContext();
  const products = getBestSellers();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "الأكثر مبيعًا" }]} />

      <div className="rounded-3xl bg-brand-gradient p-6 md:p-10 flex items-center justify-between overflow-hidden relative min-h-[140px]">
        <div className="relative z-10">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-1 flex items-center gap-2"><TrendingUp size={26} /> الأكثر مبيعًا</h1>
          <p className="text-white/80 text-sm">أكثر {products.length} منتج طلبًا من عملائنا</p>
        </div>
        <TrendingUp size={120} className="text-white/10 absolute -left-6 -bottom-6 rotate-12" />
      </div>

      <ProductGrid products={products} cart={cart} onAdd={addToCart} onQty={setQty} />
    </div>
  );
}
