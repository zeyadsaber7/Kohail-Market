import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  Tag,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { CATEGORIES } from "../data/categories";
import {
  getBestSellers,
  getNewArrivals,
  getOfferProducts,
  getSuggestedProducts,
  getFeaturedProducts,
} from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import SectionHeader from "../components/ui/SectionHeader";
import CategoryCard from "../components/ui/CategoryCard";
import ProductGrid from "../components/ui/ProductGrid";
import { SITE } from "../constants/site";

export default function Home() {
  useSEO({
    title: `${SITE.nameAr} | ${SITE.nameEn} - سوبر ماركت أونلاين`,
    description:
      "تسوق كل احتياجاتك من كحيل ماركت بأفضل الأسعار وتوصيل سريع، الدفع عند الاستلام.",
  });

  const { cart, addToCart, setQty } = useCartContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const bestSellers = getBestSellers().slice(0, 6);
  const newArrivals = getNewArrivals();
  const suggested = getSuggestedProducts();
  const offerCount = getOfferProducts().length;
  const featured = getFeaturedProducts();

  return (
    <div className="flex flex-col gap-11 md:gap-14">
      <section>
        <SectionHeader
          icon={<Package size={18} />}
          title="تسوق حسب القسم"
          subtitle="اختر القسم اللي محتاجه"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.id} category={c} delay={i * 30} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <SectionHeader
            icon={<TrendingUp size={18} />}
            title="الأكثر مبيعًا"
            subtitle="الأكثر طلبًا من عملائنا"
          />
          <Link
            to="/best-sellers"
            className="text-xs font-bold text-brand hover:underline hidden sm:flex items-center gap-1"
          >
            عرض الكل <ArrowLeft size={12} />
          </Link>
        </div>
        <ProductGrid
          products={bestSellers}
          cart={cart}
          onAdd={addToCart}
          onQty={setQty}
          loading={loading}
          cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        />
      </section>

      {featured.length > 0 && (
        <section>
          <SectionHeader
            icon={<Star size={18} />}
            title="منتجات مميزة"
            subtitle="اختيارات مميزة من فريقنا"
          />
          <ProductGrid
            products={featured}
            cart={cart}
            onAdd={addToCart}
            onQty={setQty}
            loading={loading}
            cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          />
        </section>
      )}

      <section className="relative rounded-3xl bg-gradient-to-l from-rose-600 to-red-500 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="relative z-10 text-center md:text-right">
          <p className="text-white/80 text-xs font-bold mb-1">لفترة محدودة</p>
          <h3 className="text-white text-xl md:text-3xl font-extrabold mb-2">
            خصومات تصل حتى 30%
          </h3>
          <p className="text-white/80 text-sm mb-4">
            على أكثر من {offerCount} منتج مختار
          </p>
          <Link
            to="/offers"
            className="bg-white text-rose-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rose-50 active:scale-95 transition-all inline-block"
          >
            اكتشف العروض
          </Link>
        </div>
        <Tag
          size={110}
          className="text-white/10 absolute -left-4 -bottom-4 rotate-12"
        />
      </section>

      <section>
        <SectionHeader
          icon={<Sparkles size={18} />}
          title="أحدث المنتجات"
          subtitle="وصل حديثًا إلى المتجر"
        />
        <ProductGrid
          products={newArrivals}
          cart={cart}
          onAdd={addToCart}
          onQty={setQty}
          loading={loading}
          cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        />
      </section>

      <section>
        <SectionHeader
          icon={<Star size={18} />}
          title="مقترح لك"
          subtitle="منتجات نعتقد أنك ستحبها"
        />
        <ProductGrid
          products={suggested}
          cart={cart}
          onAdd={addToCart}
          onQty={setQty}
          loading={loading}
          cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        />
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-10">
        <SectionHeader
          icon={<ShieldCheck size={18} />}
          title="ليه تختار كحيل ماركت؟"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              icon: <Truck size={22} />,
              t: "توصيل سريع وآمن",
              s: "لباب البيت في أسرع وقت",
            },
            {
              icon: <ShieldCheck size={22} />,
              t: "منتجات أصلية 100%",
              s: "من أفضل الماركات العالمية",
            },
            {
              icon: <Tag size={22} />,
              t: "أسعار تنافسية",
              s: "عروض وخصومات مستمرة",
            },
            {
              icon: <MessageCircle size={22} />,
              t: "دعم فوري",
              s: "تواصل معنا في أي وقت",
            },
          ].map((x, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                {x.icon}
              </div>
              <p className="text-sm font-bold text-brand">{x.t}</p>
              <p className="text-xs text-slate-400">{x.s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}