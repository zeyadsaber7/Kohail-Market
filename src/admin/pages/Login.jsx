import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn, Loader2 } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Login() {
  const { admin, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("[AdminLogin] sign-in failed:", err);
      setError("بيانات الدخول غير صحيحة، أو هذا الحساب ليس لديه صلاحية الدخول للوحة التحكم.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-brand-gradient flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <p className="font-extrabold text-2xl text-brand">كحيل ماركت</p>
          <p className="text-sm text-slate-400 mt-1">تسجيل دخول لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pr-9 pl-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pr-9 pl-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 bg-brand text-white font-extrabold text-sm py-3 rounded-xl hover:bg-brand-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
