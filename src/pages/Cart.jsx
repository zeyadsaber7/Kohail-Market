import { Link } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import { formatCurrency } from "../utils/currency";
import { DELIVERY } from "../constants/site";
import Breadcrumb from "../components/ui/Breadcrumb";
import EmptyState from "../components/ui/EmptyState";

export default function Cart() {
  useSEO({ title: "سلة المشتريات | كحيل ماركت" });
  const { items, setQty, removeFromCart, subtotal, deliveryFee, total } = useCartContext();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={32} />}
        title="سلتك فارغة"
        message="لم تُضف أي منتجات بعد. تصفح المتجر وابدأ التسوق الآن."
        actionLabel="تصفح المنتجات"
        actionTo="/"
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "سلة المشتريات" }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h1 className="text-xl font-extrabold text-brand mb-1">سلة المشتريات ({items.length})</h1>
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-3 animate-fadeIn">
              <Link to={`/product/${product.id}`} className="shrink-0">
                <img src={product.image} className="w-20 h-20 object-contain bg-slate-50 rounded-xl p-1.5" alt={product.name} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-sm font-bold text-brand line-clamp-2 hover:text-brand-light transition-colors">{product.name}</Link>
                <p className="text-xs text-slate-400 mt-1">{formatCurrency(product.price)} / للقطعة</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(product, qty - 1)} className="p-1.5 hover:bg-slate-50 active:scale-95 transition-all" aria-label="تقليل"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
                    <button onClick={() => setQty(product, qty + 1)} className="p-1.5 hover:bg-slate-50 active:scale-95 transition-all" aria-label="زيادة"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors" aria-label="حذف">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-extrabold text-brand text-sm shrink-0">{formatCurrency(product.price * qty)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 h-fit sticky top-24">
          <h3 className="font-extrabold text-brand mb-4">ملخص الطلب</h3>
          <div className="flex justify-between text-sm text-slate-500 mb-2"><span>الإجمالي الفرعي</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>رسوم التوصيل</span>
            <span className={deliveryFee === 0 ? "text-emerald-600 font-bold" : ""}>{deliveryFee === 0 ? "مجاني" : formatCurrency(deliveryFee)}</span>
          </div>
          {subtotal < DELIVERY.freeDeliveryThreshold && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 rounded-lg p-2.5 mb-2 flex items-center gap-1.5">
              <Truck size={13} className="shrink-0" /> أضف {formatCurrency(DELIVERY.freeDeliveryThreshold - subtotal)} أخرى للحصول على توصيل مجاني
            </p>
          )}
          <div className="flex justify-between font-extrabold text-brand text-base border-t border-slate-100 pt-3 mt-2 mb-4">
            <span>الإجمالي النهائي</span><span>{formatCurrency(total)}</span>
          </div>
          <Link to="/checkout" className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            إتمام الطلب <ArrowLeft size={16} />
          </Link>
          <Link to="/" className="w-full text-sm text-slate-400 font-semibold py-3 hover:text-brand block text-center transition-colors">متابعة التسوق</Link>
          <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400 mt-1">
            <ShieldCheck size={13} /> الدفع عند الاستلام فقط
          </div>
        </div>
      </div>
    </div>
  );
}
