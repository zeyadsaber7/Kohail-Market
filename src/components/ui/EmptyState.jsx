import { Link } from "react-router-dom";

/**
 * EmptyState
 * -----------------------------------------------------------------------
 * Shared "nothing here" component used across Cart, Search, Category,
 * Offers, and ProductGrid so every empty state in the app looks and
 * feels consistent instead of each page inventing its own markup.
 * -----------------------------------------------------------------------
 */
export default function EmptyState({ icon, title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-24 gap-4 text-center animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center text-brand/40 animate-floatSlow">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-extrabold text-brand mb-1">{title}</h3>
        {message && <p className="text-sm text-slate-400 max-w-xs mx-auto">{message}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-light transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
