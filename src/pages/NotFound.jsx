import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import { useSEO } from "../hooks/useSEO";

/** Professional 404 page shown for any unmatched route or missing entity. */
export default function NotFound() {
  useSEO({ title: "الصفحة غير موجودة | كحيل ماركت" });

  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-28 gap-5 text-center animate-fadeIn">
      <div className="w-24 h-24 rounded-full bg-brand/5 flex items-center justify-center animate-floatSlow">
        <SearchX size={40} className="text-brand/60" />
      </div>
      <div>
        <h1 className="text-6xl font-extrabold text-brand/90 mb-2 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-brand mb-1.5">عذرًا، الصفحة غير موجودة</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          الصفحة التي تبحث عنها ربما تم نقلها أو حذفها، أو أن الرابط غير صحيح.
        </p>
      </div>
      <Link to="/" className="bg-brand text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-light active:scale-95 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
        <Home size={16} /> العودة للرئيسية
      </Link>
    </div>
  );
}
