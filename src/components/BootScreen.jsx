import { RefreshCw, AlertTriangle } from "lucide-react";

/**
 * BootScreen
 * Shown for the brief moment while categories/products are being fetched
 * from Supabase on first load, or if that initial fetch fails (e.g. bad
 * env vars, network issue). Kept intentionally lightweight — this is not
 * a route, just what main.jsx renders before <App /> is ready.
 */
export default function BootScreen({ error, onRetry }) {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f7f9fc] font-sans px-6 text-center">
      <img src="/assets/images/brand/logo.jpg" alt="كحيل ماركت" className="h-14 w-14 rounded-2xl object-contain shadow-card" />
      {error ? (
        <>
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <AlertTriangle size={26} />
          </div>
          <div>
            <p className="font-extrabold text-[#0e2a4d] mb-1">تعذّر تحميل بيانات المتجر</p>
            <p className="text-sm text-slate-400 max-w-sm">
              تأكد من إعداد متغيرات Supabase بشكل صحيح (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) ومن اتصالك بالإنترنت.
            </p>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-[#0e2a4d] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#153a63] transition-colors"
          >
            <RefreshCw size={15} /> إعادة المحاولة
          </button>
        </>
      ) : (
        <>
          <div className="w-8 h-8 border-[3px] border-[#0e2a4d]/15 border-t-[#0e2a4d] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">جاري تحميل المتجر...</p>
        </>
      )}
    </div>
  );
}
