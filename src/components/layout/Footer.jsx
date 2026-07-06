import { Link } from "react-router-dom";
import { MessageCircle, Facebook, MapPin, Truck, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { SITE, CONTACT } from "../../constants/site";
import { CATEGORIES } from "../../data/categories";

/** Site-wide footer: trust strip, brand blurb, quick links, categories, contact info. */
export default function Footer() {
  return (
    <footer className="bg-brand text-white mt-14">
      {/* trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Truck size={18} />, t: "توصيل سريع لباب البيت" },
            { icon: <ShieldCheck size={18} />, t: "منتجات أصلية 100%" },
            { icon: <BadgeCheck size={18} />, t: "الدفع عند الاستلام" },
            { icon: <Clock size={18} />, t: CONTACT.workingHours },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-white/70">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">{x.icon}</span>
              <span className="line-clamp-2">{x.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/assets/images/brand/logo.jpg" className="h-9 w-9 rounded-lg" alt={SITE.nameAr} />
            <p className="font-extrabold text-lg">{SITE.nameAr}</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            وجهتك الأولى للتسوق اليومي بأفضل الأسعار وأعلى جودة، مع توصيل سريع لباب بيتك.
          </p>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="واتساب" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
              <MessageCircle size={16} />
            </a>
            <a href={CONTACT.facebookUrl} target="_blank" rel="noreferrer" aria-label="فيسبوك" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors">
              <Facebook size={16} />
            </a>
            <a href={CONTACT.googleMapsUrl} target="_blank" rel="noreferrer" aria-label="خرائط جوجل" className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500 flex items-center justify-center transition-colors">
              <MapPin size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm">روابط سريعة</p>
          <div className="flex flex-col gap-2.5 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors w-fit">الرئيسية</Link>
            <Link to="/offers" className="hover:text-white transition-colors w-fit">العروض</Link>
            <Link to="/best-sellers" className="hover:text-white transition-colors w-fit">الأكثر مبيعًا</Link>
            <Link to="/cart" className="hover:text-white transition-colors w-fit">السلة</Link>
            <Link to="/contact" className="hover:text-white transition-colors w-fit">تواصل معنا</Link>
          </div>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm">الأقسام</p>
          <div className="flex flex-col gap-2.5 text-sm text-white/60">
            {CATEGORIES.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/category/${c.id}`} className="hover:text-white transition-colors w-fit">{c.name}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm">تواصل معنا</p>
          <div className="flex flex-col gap-2.5 text-sm text-white/60">
            <a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors" dir="ltr">
              <MessageCircle size={15} /> {CONTACT.whatsappDisplay}
            </a>
            <a href={CONTACT.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Facebook size={15} /> صفحتنا على فيسبوك
            </a>
            <a href={CONTACT.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin size={15} /> موقعنا على الخريطة
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {SITE.nameAr} - جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
