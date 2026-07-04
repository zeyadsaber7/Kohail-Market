import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, MessageSquare, FolderTree, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [products, categories, pendingOrders, unreadMessages] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("categories").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        ]);
        if (cancelled) return;
        setStats({
          products: products.count ?? 0,
          categories: categories.count ?? 0,
          pendingOrders: pendingOrders.count ?? 0,
          unreadMessages: unreadMessages.count ?? 0,
        });
      } catch (err) {
        console.error("[Dashboard] failed to load stats:", err);
        if (!cancelled) setError("تعذر تحميل الإحصائيات");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: "المنتجات", value: stats?.products, icon: Package, to: "/admin/products", color: "bg-blue-50 text-blue-600" },
    { label: "الأقسام", value: stats?.categories, icon: FolderTree, to: "/admin/categories", color: "bg-emerald-50 text-emerald-600" },
    { label: "طلبات قيد الانتظار", value: stats?.pendingOrders, icon: ShoppingCart, to: "/admin/orders", color: "bg-amber-50 text-amber-600" },
    { label: "رسائل غير مقروءة", value: stats?.unreadMessages, icon: MessageSquare, to: "/admin/messages", color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div>
      <h1 className="text-xl font-extrabold text-brand mb-1">مرحبًا بك 👋</h1>
      <p className="text-sm text-slate-400 mb-6">نظرة سريعة على حالة المتجر</p>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand">{value ?? "—"}</p>
              <p className="text-xs text-slate-400 font-semibold">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
