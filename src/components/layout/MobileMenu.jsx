import { Link } from "react-router-dom";
import { X, Home as HomeIcon, ChevronLeft, Phone } from "lucide-react";
import { SITE } from "../../constants/site";
import { CATEGORIES } from "../../data/categories";

/** Slide-in navigation drawer for mobile viewports. */
export default function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-80 max-w-[85%] bg-white h-full overflow-y-auto animate-fadeIn p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/assets/images/brand/logo.jpg" className="h-9 w-9 rounded-lg" alt={SITE.nameAr} />
            <span className="font-extrabold text-brand">{SITE.nameAr}</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400" aria-label="إغلاق القائمة">
            <X size={22} />
          </button>
        </div>

        <Link to="/" onClick={onClose} className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-brand">
          <HomeIcon size={16} /> الرئيسية
        </Link>

        <p className="text-xs text-slate-400 font-bold mt-3 mb-1 px-3">الأقسام</p>
        <div className="grid grid-cols-1">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600">
              {c.name} <ChevronLeft size={15} className="text-slate-300" />
            </Link>
          ))}
        </div>

        <Link to="/contact" onClick={onClose} className="w-full flex items-center gap-2 p-3 mt-2 rounded-xl hover:bg-slate-50 text-sm font-bold text-brand">
          <Phone size={16} /> تواصل معنا
        </Link>
      </div>
    </div>
  );
}
