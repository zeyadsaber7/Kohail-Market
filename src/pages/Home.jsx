import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, TrendingUp, Sparkles, Truck, ShieldCheck, Clock, Tag, MessageCircle, ArrowLeft, Percent, Star } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { getBestSellers, getNewArrivals, getOfferProducts, getSuggestedProducts, getFeaturedProducts } from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import SectionHeader from "../components/ui/SectionHeader";
import CategoryCard from "../components/ui/CategoryCard";
import ProductGrid from "../components/ui/ProductGrid";
import { SITE } from "../constants/site";
import { fetchActiveBanners } from "../services/bannersService";

export default function Home() {
  useSEO({
    title: `${SITE.nameAr} | ${SITE.nameEn} - سوبر ماركت أونلاين`,
    description: "تسوق كل احتياجاتك من كحيل ماركت بأفضل الأسعار وتوصيل سريع، الدفع عند الاستلام.",
  });

  const { cart, addToCart, setQty } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchActiveBanners().then(setBanners).catch(() => setBanners([]));
  }, []);

  const bestSellers = getBestSellers().slice(0, 6);
  const newArrivals = getNewArrivals();
  const suggested = getSuggestedProducts();
  const offerCount = getOfferProducts().length;
  const featured = getFeaturedProducts();

  return (
    <div className="flex flex-col gap-11 md:gap-14">
      {/* ================= HERO ================= */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* main hero card */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-brand-gradient min-h-[300px] md:min-h-[380px] flex items-center">
          {/* decorative blobs */}
          <div className="absolute -left-10 -top-10 w-56 h-56 rounded-full bg-white/5 animate-floatSlow" />
          <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-white/[0.04] translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 px-8 md:px-14 py-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={13} /> أهلًا بك في {SITE.nameAr}
            </span>
            <h1 className="text-white text-3xl md:text-[42px] leading-tight font-extrabold mb-4">
              كل احتياجاتك اليومية، <br className="hidden sm:block" /> بضغطة واحدة
            </h1>
            <p className="text-white/75 text-sm md:text-base mb-7 leading-relaxed">
              أكثر من {offerCount}+ منتج بعروض حصرية، توصيل سريع لباب البيت، والدفع عند الاستلام.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/offers" className="bg-white text-brand font-extrabold text-sm px-6 py-3.5 rounded-2xl hover:bg-slate-100 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2">
                تسوّق العروض <ArrowLeft size={16} />
              </Link>
              <Link to="/best-sellers" className="bg-white/10 text-white font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 backdrop-blur">
                الأكثر مبيعًا
              </Link>
            </div>
          </div>
        </div>

        {/* side promo stack */}
        <div className="grid grid-rows-2 gap-4">
          <Link to="/offers" className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-600 to-red-500 p-6 flex flex-col justify-center min-h-[140px]">
            <Percent size={70} className="absolute -left-3 -bottom-3 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            <p className="relative z-10 text-white/80 text-xs font-bold mb-1">عروض اليوم</p>
            <h3 className="relative z-10 text-white text-xl font-extrabold mb-1">خصم حتى 30%</h3>
            <span className="relative z-10 text-white/85 text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              اكتشف الآن <ArrowLeft size={13} />
            </span>
          </Link>
          <Link to="/category/dairy" className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 to-sky-500 p-6 flex flex-col justify-center min-h-[140px]">
            <Star size={70} className="absolute -left-3 -bottom-3 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            <p className="relative z-10 text-white/80 text-xs font-bold mb-1">منتجات طازجة</p>
            <h3 className="relative z-10 text-white text-xl font-extrabold mb-1">ألبان ومخبوزات يوميًا</h3>
            <span className="relative z-10 text-white/85 text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              تصفح الآن <ArrowLeft size={13} />
            </span>
          </Link>
        </div>
      </section>

      {/* ================= PROMO BANNERS (admin-managed) ================= */}
      {banners.length > 0 && (
        <section className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {banners.map((b) => (
            <Link
              key={b.id}
              to={b.linkUrl || "/offers"}
              className="relative shrink-0 w-[280px] md:w-[340px] h-32 md:h-36 rounded-2xl overflow-hidden bg-slate-100 shadow-card hover:shadow-card-hover transition-shadow"
            >
              {b.image && <img src={b.image} alt={b.title || ""} className="absolute inset-0 w-full h-full object-cover" />}
              {(b.title || b.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-4">
                  {b.title && <h3 className="text-white font-extrabold text-base leading-tight">{b.title}</h3>}
                  {b.subtitle && <p className="text-white/80 text-xs mt-0.5">{b.subtitle}</p>}
                </div>
              )}
            </Link>
          ))}
        </section>
      )}

      {/* ================= QUICK STATS ================= */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: <Truck size={18} />, t: "توصيل سريع", s: "في أقل من ساعة" },
          { icon: <ShieldCheck size={18} />, t: "جودة مضمونة", s: "منتجات أصلية" },
          { icon: <Clock size={18} />, t: "خدمة متواصلة", s: "طوال الأسبوع" },
        ].map((x, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 text-center md:text-right">
            <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">{x.icon}</div>
            <div>
              <p className="text-xs md:text-sm font-bold text-brand">{x.t}</p>
              <p className="text-[10px] md:text-xs text-slate-400">{x.s}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ================= CATEGORIES ================= */}
      <section>
        <SectionHeader icon={<Package size={18} />} title="تسوق حسب القسم" subtitle="اختر القسم اللي محتاجه" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.id} category={c} delay={i * 30} />
          ))}
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section>
        <div className="flex items-center justify-between">
          <SectionHeader icon={<TrendingUp size={18} />} title="الأكثر مبيعًا" subtitle="الأكثر طلبًا من عملائنا" />
          <Link to="/best-sellers" className="text-xs font-bold text-brand hover:underline hidden sm:flex items-center gap-1">
            عرض الكل <ArrowLeft size={12} />
          </Link>
        </div>
        <ProductGrid products={bestSellers} cart={cart} onAdd={addToCart} onQty={setQty} loading={loading} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
      </section>

      {/* ================= FEATURED PRODUCTS (admin-managed) ================= */}
      {featured.length > 0 && (
        <section>
          <SectionHeader icon={<Star size={18} />} title="منتجات مميزة" subtitle="اختيارات مميزة من فريقنا" />
          <ProductGrid products={featured} cart={cart} onAdd={addToCart} onQty={setQty} loading={loading} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
        </section>
      )}

      {/* ================= OFFERS BANNER ================= */}
      <section className="relative rounded-3xl bg-gradient-to-l from-rose-600 to-red-500 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="relative z-10 text-center md:text-right">
          <p className="text-white/80 text-xs font-bold mb-1">لفترة محدودة</p>
          <h3 className="text-white text-xl md:text-3xl font-extrabold mb-2">خصومات تصل حتى 30%</h3>
          <p className="text-white/80 text-sm mb-4">على أكثر من {offerCount} منتج مختار</p>
          <Link to="/offers" className="bg-white text-rose-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rose-50 active:scale-95 transition-all inline-block">
            اكتشف العروض
          </Link>
        </div>
        <Tag size={110} className="text-white/10 absolute -left-4 -bottom-4 rotate-12" />
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section>
        <SectionHeader icon={<Sparkles size={18} />} title="أحدث المنتجات" subtitle="وصل حديثًا إلى المتجر" />
        <ProductGrid products={newArrivals} cart={cart} onAdd={addToCart} onQty={setQty} loading={loading} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
      </section>

      {/* ================= SUGGESTED FOR YOU ================= */}
      <section>
        <SectionHeader icon={<Star size={18} />} title="مقترح لك" subtitle="منتجات نعتقد أنك ستحبها" />
        <ProductGrid products={suggested} cart={cart} onAdd={addToCart} onQty={setQty} loading={loading} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
      </section>

      {/* ================= WHY US ================= */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-10">
        <SectionHeader icon={<ShieldCheck size={18} />} title="ليه تختار كحيل ماركت؟" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Truck size={22} />, t: "توصيل سريع وآمن", s: "لباب البيت في أسرع وقت" },
            { icon: <ShieldCheck size={22} />, t: "منتجات أصلية 100%", s: "من أفضل الماركات العالمية" },
            { icon: <Tag size={22} />, t: "أسعار تنافسية", s: "عروض وخصومات مستمرة" },
            { icon: <MessageCircle size={22} />, t: "دعم فوري", s: "تواصل معنا في أي وقت" },
          ].map((x, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 group">
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
