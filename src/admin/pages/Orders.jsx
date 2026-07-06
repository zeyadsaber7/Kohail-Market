import { useEffect, useState } from "react";
import { X, ShoppingCart, Phone, MapPin, StickyNote } from "lucide-react";
import { fetchOrders, updateOrderStatus } from "../../services/ordersService";
import { formatCurrency } from "../../utils/currency";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  out_for_delivery: "جارٍ التوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  out_for_delivery: "bg-violet-50 text-violet-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const { toast, showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch (err) {
      console.error("[Orders] load failed:", err);
      showToast("تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(order, status) {
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)));
      if (selected?.id === order.id) setSelected((s) => ({ ...s, status: updated.status }));
      showToast("تم تحديث حالة الطلب");
    } catch (err) {
      console.error("[Orders] status update failed:", err);
      showToast("تعذر تحديث الحالة");
    }
  }

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-brand">الطلبات</h1>
          <p className="text-sm text-slate-400">{orders.length} طلب</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-brand focus:outline-none">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton-shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          <ShoppingCart size={28} className="mx-auto mb-2" /> لا توجد طلبات
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          {filtered.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelected(o)}
              className="w-full text-right grid grid-cols-2 md:grid-cols-5 gap-2 items-center px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-brand">{o.customer_name}</p>
                <p className="text-xs text-slate-400" dir="ltr">{o.customer_phone}</p>
              </div>
              <span className="hidden md:block text-xs text-slate-400">{new Date(o.created_at).toLocaleString("ar-EG")}</span>
              <span className="hidden md:block text-sm font-bold text-brand">{formatCurrency(o.total)}</span>
              <span className="hidden md:block text-xs text-slate-400">{o.order_items?.length ?? 0} صنف</span>
              <span className={`justify-self-start md:justify-self-auto text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${STATUS_COLORS[o.status]}`}>
                {STATUS_LABELS[o.status]}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-brand text-base">تفاصيل الطلب</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-3 text-sm mb-4">
              <p className="font-bold text-brand">{selected.customer_name}</p>
              <p className="flex items-center gap-2 text-slate-500" dir="ltr"><Phone size={14} /> {selected.customer_phone}</p>
              <p className="flex items-center gap-2 text-slate-500"><MapPin size={14} /> {selected.customer_address}</p>
              {selected.notes && <p className="flex items-center gap-2 text-slate-500"><StickyNote size={14} /> {selected.notes}</p>}
            </div>

            <div className="border-t border-slate-100 pt-3 mb-4">
              <p className="text-xs font-bold text-slate-400 mb-2">الأصناف</p>
              {selected.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1.5">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="font-bold text-brand">{formatCurrency(item.line_total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 mb-4 flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-slate-500"><span>المجموع الفرعي</span><span>{formatCurrency(selected.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>رسوم التوصيل</span><span>{formatCurrency(selected.delivery_fee)}</span></div>
              <div className="flex justify-between font-extrabold text-brand text-base"><span>الإجمالي</span><span>{formatCurrency(selected.total)}</span></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">حالة الطلب</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected, e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
