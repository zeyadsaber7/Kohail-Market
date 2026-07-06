import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import FloatingButtons from "./FloatingButtons";
import Toast from "../ui/Toast";
import { useCartContext } from "../../context/CartContext";

/**
 * Layout
 * Persistent chrome (header, footer, floating WhatsApp/Facebook buttons,
 * mobile drawer, toast) rendered once around every page via
 * react-router's <Outlet />.
 */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, toast } = useCartContext();
  const location = useLocation();

  // Smooth-scroll to top on every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f9fc] text-slate-800 font-sans">
      <Header cartCount={count} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 py-5 min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />
      <FloatingButtons />
      <Toast message={toast} />
    </div>
  );
}
