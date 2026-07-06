import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  FolderTree,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [products, categories, pendingOrders, unreadMessages] =
          await Promise.all([
            supabase
              .from("products")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("categories")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("orders")
              .select("id", { count: "exact", head: true })
              .eq("status", "pending"),
            supabase
              .from("contact_messages")
              .select("id", { count: "exact", head: true })
              .eq("is_read", false),
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
    {
      label: "المنتجات",
      value: stats?.products ?? 0,
      icon: Package,
      to: "/admin/products",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "الأقسام",
      value: stats?.categories ?? 0,
      icon: FolderTree,
      to: "/admin/categories",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "طلبات قيد الانتظار",
      value: stats?.pendingOrders ?? 0,
      icon: ShoppingCart,
      to: "/admin/orders",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "رسائل غير مقروءة",
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      to: "/admin/messages",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-extrabold text-brand mb-1">
        مرحبًا بك 👋
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        نظرة سريعة على حالة المتجر
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-2xl border bg-white p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold">
                    {card.value ?? 0}
                  </p>
                </div>

                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}