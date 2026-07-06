import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Breadcrumb
 * items: [{ label, to? }] — the last item (current page) should omit `to`.
 */
export default function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronLeft size={13} />}
          {it.to ? (
            <Link to={it.to} className="hover:text-brand font-semibold">
              {it.label}
            </Link>
          ) : (
            <span className="text-brand font-bold">{it.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
