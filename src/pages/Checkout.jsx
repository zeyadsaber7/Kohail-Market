import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, AlertCircle, Truck, CheckCircle2, User, Phone as PhoneIcon, MapPin, FileText, Loader2, ShoppingBag } from "lucide-react";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import { formatCurrency } from "../utils/currency";
import { validateCheckoutForm } from "../utils/validators";
import { placeOrder } from "../services/ordersService";
import Breadcrumb from "../components/ui/Breadcrumb";
import EmptyState from "../components/ui/EmptyState";

export default function Checkout() {
  useSEO({ title: "إتمام الطلب | كحيل ماركت" });
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, clearCart } = useCartContext();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateCheckoutForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      // Persists one `orders` row + one `order_items` row per cart line
      // in Supabase (see the `place_order` DB function in schema.sql).
      await placeOrder({ customer: form, items, totals: { subtotal, deliveryFee, total } });
      setPlaced(true);
      clearCart();
    } catch (err) {
      console.error("[Checkout] Failed to place order:", err);
      setSubmitError("حدث خطأ أثناء إرسال الطلب، برجاء المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 md:py-28 gap-5 text-center max-w-md mx-auto animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-brand mb-2">تم استلام طلبك بنجاح! 🎉</h2>
          <p className="text-sm text-slate-400">سيتواصل معك فريقنا قريبًا لتأكيد الطلب. الدفع عند الاستلام.</p>
        </div>
        <button onClick={() => navigate("/")} className="bg-brand text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-light active:scale-95 transition-all">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState icon={<ShoppingBag size={32} />} title="سلتك فارغة" message="أضف منتجات لسلتك أولًا قبل إتمام الطلب." actionLabel="تصفح المنتجات" actionTo="/" />;
  }

  const field = (key, label, placeholder, icon, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-brand flex items-center gap-1.5" htmlFor={key}>
        {icon} {label}
      </label>
      <input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/25 transition-all ${errors[key] ? "border-rose-400" : "border-slate-200"}`}
      />
      {errors[key] && <span className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle size={12} />{errors[key]}</span>}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "سلة المشتريات", to: "/cart" }, { label: "إتمام الطلب" }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-5 md:p-7 flex flex-col gap-4">
          <div className="mb-1">
            <h1 className="text-xl font-extrabold text-brand">بيانات الطلب</h1>
            <p className="text-xs text-slate-400 mt-1">أدخل بياناتك لإتمام عملية الشراء</p>
          </div>

          {field("name", "الاسم بالكامل", "مثال: أحمد محمد", <User size={14} />)}
          {field("phone", "رقم الهاتف", "01xxxxxxxxx", <PhoneIcon size={14} />, "tel")}
          {field("address", "العنوان بالتفصيل", "المحافظة، المدينة، الشارع، رقم العقار", <MapPin size={14} />)}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand flex items-center gap-1.5" htmlFor="notes"><FileText size={14} /> ملاحظات (اختياري)</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="أي تفاصيل إضافية عن طلبك..."
              rows={3}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/25 transition-all resize-none"
            />
          </div>

          <div className="bg-brand/5 rounded-xl p-4 flex items-center gap-3 mt-1">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0"><Truck size={18} className="text-brand" /></div>
            <div>
              <p className="text-sm font-bold text-brand">الدفع عند الاستلام</p>
              <p className="text-xs text-slate-400">طريقة الدفع الوحيدة المتاحة حاليًا</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand disabled:bg-brand/60 text-white font-bold py-3.5 rounded-xl hover:bg-brand-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-md"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
          </button>
          {submitError && (
            <span className="text-xs text-rose-500 flex items-center gap-1.5 justify-center -mt-1">
              <AlertCircle size={13} /> {submitError}
            </span>
          )}
        </form>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 h-fit sticky top-24">
          <h3 className="font-extrabold text-brand mb-4">ملخص الطلب</h3>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto thin-scrollbar pl-1">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between text-xs text-slate-500">
                <span className="line-clamp-1">{product.name} × {qty}</span>
                <span className="font-bold shrink-0">{formatCurrency(product.price * qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-500"><span>الإجمالي الفرعي</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-sm text-slate-500"><span>رسوم التوصيل</span><span>{deliveryFee === 0 ? "مجاني" : formatCurrency(deliveryFee)}</span></div>
            <div className="flex justify-between font-extrabold text-brand text-base border-t border-slate-100 pt-2"><span>الإجمالي</span><span>{formatCurrency(total)}</span></div>
          </div>
          <Link to="/cart" className="text-xs text-slate-400 hover:text-brand font-semibold mt-3 block text-center transition-colors">تعديل السلة</Link>
        </div>
      </div>
    </div>
  );
}
