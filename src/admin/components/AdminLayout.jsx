import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "الرئيسية", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "المنتجات", icon: Package },
  { to: "/admin/categories", label: "الأقسام", icon: FolderTree },
  { to: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
];

export default function AdminLayout() {
  const { admin, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-brand text-white min-h-screen sticky top-0">
        <SidebarContent admin={admin} onSignOut={handleSignOut} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-brand text-white flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <SidebarContent admin={admin} onSignOut={handleSignOut} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="text-brand">
            <Menu size={22} />
          </button>
          <span className="font-extrabold text-brand text-sm">لوحة تحكم كحيل ماركت</span>
          <div className="w-5" />
        </header>

        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ admin, onSignOut, onNavigate }) {
  return (
    <>
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-extrabold text-lg">كحيل ماركت</p>
        <p className="text-xs text-white/60 mt-0.5">لوحة التحكم</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? "bg-white text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={18} /> عرض المتجر
        </a>

        <div className="px-3.5 py-2 text-[11px] text-white/50 truncate">
          {admin?.full_name || "مسؤول"}
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:bg-red-500/20 hover:text-white transition-colors"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </>
  );
}