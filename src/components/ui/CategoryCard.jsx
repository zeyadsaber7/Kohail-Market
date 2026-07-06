import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

/** Rounded gradient tile used in the category grid on the homepage / menu. */
export default function CategoryCard({ category, delay = 0 }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group flex flex-col items-center gap-2 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${category.gradient} p-2.5 shadow-card group-hover:shadow-card-hover group-hover:-translate-y-1.5 group-hover:scale-[1.03] transition-all duration-300 ease-smooth overflow-hidden relative ring-1 ring-black/5`}
      >
        {category.image ? (
          <img
            src={category.image}
            className="w-full h-full object-contain drop-shadow transition-transform duration-500 ease-smooth group-hover:scale-110"
            alt={category.name}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="text-white transition-transform duration-300 group-hover:scale-110" size={30} />
          </div>
        )}
      </div>
      <span className="text-[11px] md:text-xs font-bold text-slate-600 group-hover:text-brand transition-colors text-center leading-tight">
        {category.name}
      </span>
    </Link>
  );
}
