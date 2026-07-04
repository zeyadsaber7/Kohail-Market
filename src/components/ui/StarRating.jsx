import { Star } from "lucide-react";

/** Renders a 5-star rating row, filled up to `value` (rounded). */
export default function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < Math.round(value) ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
      <span className="text-[11px] text-slate-400 ms-1">{value}</span>
    </div>
  );
}
