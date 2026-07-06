import { Tag } from "lucide-react";
import { getOfferProducts } from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/ui/Breadcrumb";
import ProductGrid from "../components/ui/ProductGrid";

/** Dedicated page listing every product currently on discount. */
export default function Offers() {
  useSEO({
    title: "العروض والخصومات | كحيل ماركت",
    description: "اكتشف أقوى عروض وخصومات كحيل ماركت على مئات المنتجات، توصيل سريع والدفع عند الاستلام.",
  });

  const { cart, addToCart, setQty } = useCartContext();
  const products = getOfferProducts();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "العروض" }]} />

      <div className="rounded-3xl bg-gradient-to-l from-rose-600 to-red-500 p-6 md:p-10 flex items-center justify-between overflow-hidden relative min-h-[140px]">
        <div className="relative z-10">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-1 flex items-center gap-2"><Tag size={26} /> العروض والخصومات</h1>
          <p className="text-white/80 text-sm">{products.length} منتج بخصومات مميزة الآن</p>
        </div>
        <Tag size={120} className="text-white/10 absolute -left-6 -bottom-6 rotate-12" />
      </div>

      <ProductGrid
        products={products}
        cart={cart}
        onAdd={addToCart}
        onQty={setQty}
        emptyTitle="لا توجد عروض حاليًا"
        emptyMessage="تابعنا قريبًا لعروض وخصومات جديدة."
      />
    </div>
  );
}
