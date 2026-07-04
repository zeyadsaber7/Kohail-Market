const TONES = {
  blue: "bg-brand text-white",
  red: "bg-rose-600 text-white",
  gray: "bg-slate-100 text-slate-500",
  green: "bg-emerald-500 text-white",
  amber: "bg-amber-400 text-brand-dark",
  outline: "bg-white/95 text-brand ring-1 ring-inset ring-brand/15",
};

/** Small pill label used for discount %, stock state, "new", "best seller", etc. */
export default function Badge({ children, tone = "blue", className = "" }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
