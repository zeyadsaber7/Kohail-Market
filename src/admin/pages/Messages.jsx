import { useEffect, useState } from "react";
import { MessageSquare, Trash2, Mail, Phone } from "lucide-react";
import { fetchMessages, markMessageRead, deleteMessage } from "../../services/messagesService";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast } = useToast();

  async function load() {
    setLoading(true);
    try {
      setMessages(await fetchMessages());
    } catch (err) {
      console.error("[Messages] load failed:", err);
      showToast("تعذر تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleOpen(msg) {
    if (!msg.isRead) {
      try {
        await markMessageRead(msg.id, true);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
      } catch (err) {
        console.error("[Messages] mark read failed:", err);
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMessage(deleteTarget.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      showToast("تم حذف الرسالة");
      setDeleteTarget(null);
    } catch (err) {
      console.error("[Messages] delete failed:", err);
      showToast("تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-brand">الرسائل</h1>
        <p className="text-sm text-slate-400">{messages.length} رسالة · {messages.filter((m) => !m.isRead).length} غير مقروءة</p>
      </div>

      {loading ? (
        <div className="grid gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-2xl skeleton-shimmer" />)}</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          <MessageSquare size={28} className="mx-auto mb-2" /> لا توجد رسائل بعد
        </div>
      ) : (
        <div className="grid gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => handleOpen(m)}
              className={`bg-white rounded-2xl border shadow-card p-4 cursor-pointer transition-colors ${m.isRead ? "border-slate-100" : "border-brand/30 bg-brand/[0.02]"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-brand">{m.name}</p>
                    {!m.isRead && <span className="w-2 h-2 rounded-full bg-brand" />}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-2">
                    {m.phone && <span className="flex items-center gap-1" dir="ltr"><Phone size={12} /> {m.phone}</span>}
                    {m.email && <span className="flex items-center gap-1" dir="ltr"><Mail size={12} /> {m.email}</span>}
                    <span>{new Date(m.createdAt).toLocaleString("ar-EG")}</span>
                  </div>
                  <p className="text-sm text-slate-600">{m.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(m); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="حذف هذه الرسالة؟" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} busy={deleting} />
      <Toast message={toast} />
    </div>
  );
}
