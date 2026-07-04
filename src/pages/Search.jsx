import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, PackageSearch } from "lucide-react";
import { searchProducts } from "../data/products";
import { useCartContext } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/ui/Breadcrumb";
import ProductGrid from "../components/ui/ProductGrid";
import EmptyState from "../components/ui/EmptyState";

/** Displays results for ?q= search queries coming from the header search box. */
export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [term, setTerm] = useState(query);
  const { cart, addToCart, setQty } = useCartContext();

  const results = useMemo(() => searchProducts(query), [query]);

  useSEO({ title: query ? `نتائج البحث عن "${query}" | كحيل ماركت` : "بحث | كحيل ماركت" });

  const submit = (e) => {
    e.preventDefault();
    setParams(term.trim() ? { q: term.trim() } : {});
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "نتائج البحث" }]} />

      <form onSubmit={submit} className="relative max-w-xl">
        <SearchIcon size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="ابحث عن منتج، ماركة أو قسم..."
          className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-brand/25 rounded-2xl py-3.5 pr-11 pl-4 text-sm outline-none transition-all shadow-card"
        />
      </form>

      {query && (
        <p className="text-sm text-slate-500">
          نتائج البحث عن "<span className="font-bold text-brand">{query}</span>" — {results.length} منتج
        </p>
      )}

      {!query ? (
        <EmptyState icon={<SearchIcon size={32} />} title="ابدأ البحث" message="اكتب اسم منتج أو ماركة أو قسم لعرض النتائج." />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={32} />}
          title="لا توجد نتائج"
          message={`لم نجد أي منتجات تطابق "${query}"، جرّب كلمة بحث مختلفة.`}
          actionLabel="تصفح كل المنتجات"
          actionTo="/"
        />
      ) : (
        <ProductGrid products={results} cart={cart} onAdd={addToCart} onQty={setQty} />
      )}
    </div>
  );
}
