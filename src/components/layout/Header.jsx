import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Search, ShoppingCart, Menu, ArrowLeft } from "lucide-react";
=======
import { Search, ShoppingCart, Menu, Phone, ArrowLeft } from "lucide-react";
>>>>>>> fd87fe64f9c4879212f53955694a3138a18ad237
import { SITE } from "../../constants/site";
import { CATEGORIES } from "../../data/categories";
import { searchProducts } from "../../data/products";
import { formatCurrency } from "../../utils/currency";

/**
 * Header
 * Sticky top navigation: logo, live search dropdown (with instant
 * suggestions while typing), category bar (desktop), and the cart
 * icon with a live item count. Gains a subtle shadow once the page
 * scrolls, so it always reads as "above" the content.
 */
export default function Header({ cartCount, onOpenMenu }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = useMemo(() => searchProducts(searchTerm).slice(0, 6), [searchTerm]);

  const goToSearch = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  const SuggestionsList = ({ mobile = false }) => (
    <div className={`${mobile ? "mt-2" : "absolute mt-2 w-full z-50"} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeInScale`}>
      {results.map((r) => (
        <Link key={r.id} to={`/product/${r.id}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 transition-colors text-right">
          <img src={r.image} className="w-10 h-10 object-contain rounded-lg bg-slate-50 shrink-0" alt={r.name} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold line-clamp-1">{r.name}</p>
            <p className="text-xs text-brand font-bold">{formatCurrency(r.price)}</p>
          </div>
        </Link>
      ))}
      <button onClick={goToSearch} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-brand py-2.5 hover:bg-slate-50 border-t border-slate-100 transition-colors">
        عرض كل النتائج <ArrowLeft size={13} />
      </button>
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur border-b transition-shadow duration-300 ${scrolled ? "shadow-soft border-slate-100" : "border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <button className="lg:hidden p-2 -ms-2 text-brand hover:bg-slate-50 rounded-lg transition-colors" onClick={onOpenMenu} aria-label="القائمة">
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img src="/assets/images/brand/logo.jpg" alt={SITE.nameAr} className="h-10 w-10 object-contain rounded-xl transition-transform group-hover:scale-105" />
            <div className="leading-tight text-right hidden sm:block">
              <p className="font-extrabold text-brand text-base">{SITE.nameAr}</p>
              <p className="text-[10px] text-slate-400 tracking-wide">{SITE.nameEn.toUpperCase()}</p>
            </div>
          </Link>

          {/* Desktop search */}
          <form onSubmit={goToSearch} className="flex-1 relative hidden md:block">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="ابحث عن منتج، ماركة أو قسم..."
              className="w-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-brand/25 rounded-2xl py-3 pr-11 pl-4 text-sm outline-none transition-all duration-200"
            />
            {searchOpen && results.length > 0 && <SuggestionsList />}
            {searchOpen && <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />}
          </form>

          <button className="md:hidden p-2 text-brand hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setSearchOpen((s) => !s)} aria-label="بحث">
            <Search size={22} />
          </button>
<<<<<<< HEAD
=======
          <Link to="/contact" className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand transition-colors">
            <Phone size={16} /> تواصل معنا
          </Link>
>>>>>>> fd87fe64f9c4879212f53955694a3138a18ad237
          <Link to="/cart" className="relative p-2.5 bg-brand rounded-xl text-white hover:bg-brand-light active:scale-95 transition-all">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fadeInScale">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={goToSearch} className="md:hidden pb-3 relative animate-fadeIn">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
            <input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-slate-100 rounded-2xl py-3 pr-11 pl-4 text-sm outline-none focus:ring-2 focus:ring-brand/25"
            />
            {results.length > 0 && <SuggestionsList mobile />}
          </form>
        )}

        {/* Desktop category bar */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 -mt-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="whitespace-nowrap text-xs font-semibold text-slate-500 hover:text-brand hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
