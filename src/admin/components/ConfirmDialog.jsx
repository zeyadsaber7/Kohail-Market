import { AlertTriangle } from "lucide-react";

/**
 * Simple confirm modal for destructive actions (delete product, delete
 * order, etc). Controlled entirely by the parent via props.
 */
export default function ConfirmDialog({ open, title, description, confirmLabel = "حذف", onConfirm, onCancel, busy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <AlertTriangle size={20} />
        </div>
        <h3 className="font-extrabold text-brand text-base mb-1">{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-5">{description}</p>}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {busy ? "جارٍ الحذف..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
