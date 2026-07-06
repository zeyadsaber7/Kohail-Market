import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { fetchSettings, updateSettings } from "../../services/settingsService";
import { WEBSITE_BUCKET } from "../../lib/supabaseClient";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

export default function Settings() {
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchSettings()
      .then(setValues)
      .catch((err) => {
        console.error("[Settings] load failed:", err);
        showToast("تعذر تحميل الإعدادات");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await updateSettings(values);
      setValues(saved);
      showToast("تم حفظ الإعدادات");
    } catch (err) {
      console.error("[Settings] save failed:", err);
      showToast("فشل حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !values) {
    return <div className="grid gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold text-brand mb-1">الإعدادات</h1>
      <p className="text-sm text-slate-400 mb-6">معلومات المتجر، التواصل، وروابط التواصل الاجتماعي</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col gap-5 max-w-2xl">
        <ImageUploader
          bucket={WEBSITE_BUCKET}
          folder="brand"
          path={values.logoPath}
          url={values.logoUrl}
          onChange={({ path, url }) => setValues((v) => ({ ...v, logoPath: path, logoUrl: url }))}
          label="شعار المتجر"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم المتجر (عربي)"><input value={values.storeNameAr || ""} onChange={(e) => update("storeNameAr", e.target.value)} className="input" /></Field>
          <Field label="اسم المتجر (إنجليزي)"><input value={values.storeNameEn || ""} onChange={(e) => update("storeNameEn", e.target.value)} className="input" dir="ltr" /></Field>
        </div>

        <Field label="الشعار الفرعي (Tagline)"><input value={values.tagline || ""} onChange={(e) => update("tagline", e.target.value)} className="input" /></Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="رقم الهاتف"><input value={values.phone || ""} onChange={(e) => update("phone", e.target.value)} dir="ltr" className="input" /></Field>
          <Field label="رقم واتساب"><input value={values.whatsappNumber || ""} onChange={(e) => update("whatsappNumber", e.target.value)} dir="ltr" placeholder="201063653445" className="input" /></Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="البريد الإلكتروني"><input type="email" value={values.email || ""} onChange={(e) => update("email", e.target.value)} dir="ltr" className="input" /></Field>
          <Field label="مواعيد العمل"><input value={values.workingHours || ""} onChange={(e) => update("workingHours", e.target.value)} className="input" /></Field>
        </div>

        <Field label="العنوان"><input value={values.address || ""} onChange={(e) => update("address", e.target.value)} className="input" /></Field>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="رابط فيسبوك"><input value={values.facebookUrl || ""} onChange={(e) => update("facebookUrl", e.target.value)} dir="ltr" className="input" /></Field>
          <Field label="رابط إنستجرام"><input value={values.instagramUrl || ""} onChange={(e) => update("instagramUrl", e.target.value)} dir="ltr" className="input" /></Field>
          <Field label="رابط خرائط جوجل"><input value={values.googleMapsUrl || ""} onChange={(e) => update("googleMapsUrl", e.target.value)} dir="ltr" className="input" /></Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="رسوم التوصيل (ج.م)"><input type="number" step="0.01" value={values.deliveryFee ?? 0} onChange={(e) => update("deliveryFee", Number(e.target.value))} className="input" /></Field>
          <Field label="حد التوصيل المجاني (ج.م)"><input type="number" step="0.01" value={values.freeDeliveryThreshold ?? 0} onChange={(e) => update("freeDeliveryThreshold", Number(e.target.value))} className="input" /></Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-5 py-2.5 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand-light disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          حفظ الإعدادات
        </button>
      </form>

      <style>{`.input{width:100%;border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.55rem 0.75rem;font-size:0.875rem}.input:focus{outline:none;border-color:#0e2a4d}`}</style>
      <Toast message={toast} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
