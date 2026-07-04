import { useState } from "react";
import { MessageCircle, Facebook, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { CONTACT } from "../constants/site";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/ui/Breadcrumb";
import { submitContactMessage } from "../services/messagesService";

export default function Contact() {
  useSEO({
    title: "تواصل معنا | كحيل ماركت",
    description: "تواصل مع كحيل ماركت عبر واتساب أو فيسبوك، أو زور موقعنا على خرائط جوجل. مواعيد العمل ومعلومات التواصل الكاملة.",
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setStatus("sending");
    try {
      await submitContactMessage(form);
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("[Contact] failed to submit message:", err);
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Breadcrumb items={[{ label: "الرئيسية", to: "/" }, { label: "تواصل معنا" }]} />

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand mb-2">تواصل معنا</h1>
        <p className="text-sm text-slate-400">فريقنا جاهز للرد على استفساراتك في أي وقت</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <a
          href={`https://wa.me/${CONTACT.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center gap-2.5 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
            <MessageCircle size={24} />
          </div>
          <p className="text-sm font-bold text-brand">واتساب</p>
          <p className="text-xs text-slate-400" dir="ltr">{CONTACT.whatsappDisplay}</p>
        </a>

        <a
          href={CONTACT.facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center gap-2.5 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors duration-300">
            <Facebook size={24} />
          </div>
          <p className="text-sm font-bold text-brand">فيسبوك</p>
          <p className="text-xs text-slate-400">صفحتنا الرسمية</p>
        </a>

        <a
          href={CONTACT.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center gap-2.5 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors duration-300">
            <MapPin size={24} />
          </div>
          <p className="text-sm font-bold text-brand">موقعنا</p>
          <p className="text-xs text-slate-400">افتح خرائط Google</p>
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0"><Clock size={22} /></div>
        <div>
          <p className="text-sm font-bold text-brand">مواعيد العمل</p>
          <p className="text-xs text-slate-400">{CONTACT.workingHours}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <h2 className="text-base font-extrabold text-brand mb-1">أرسل لنا رسالة</h2>
        <p className="text-xs text-slate-400 mb-5">هنرد عليك في أقرب وقت ممكن</p>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CheckCircle2 size={32} className="text-emerald-500" />
            <p className="font-bold text-brand">تم إرسال رسالتك بنجاح</p>
            <p className="text-xs text-slate-400">هنتواصل معاك قريبًا</p>
            <button onClick={() => setStatus("idle")} className="text-xs font-bold text-brand hover:underline mt-1">إرسال رسالة أخرى</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="الاسم *"
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="رقم الهاتف"
                dir="ltr"
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="البريد الإلكتروني (اختياري)"
              dir="ltr"
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
            <textarea
              required
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="رسالتك *"
              rows={4}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none resize-none"
            />
            {status === "error" && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">حدث خطأ أثناء الإرسال، حاول مرة أخرى</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="self-start bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-light active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              إرسال
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
