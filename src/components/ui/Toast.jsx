import { CheckCircle2 } from "lucide-react";

/** Fixed-position success toast; renders nothing when `message` is falsy. */
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-brand-dark/95 backdrop-blur text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-toastIn pointer-events-auto max-w-sm">
        <span className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 size={17} className="text-emerald-400" />
        </span>
        <span className="line-clamp-2">{message}</span>
      </div>
    </div>
  );
}
