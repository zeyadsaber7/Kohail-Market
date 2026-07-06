import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

/**
 * src/admin/components/ProtectedRoute.jsx
 * -----------------------------------------------------------------------
 * Wraps any /admin/* page that requires a logged-in admin. Row Level
 * Security is the real enforcement layer (an unauthorized user's queries
 * would fail regardless), but this keeps the dashboard UI itself from
 * ever rendering for a non-admin, and sends them to the login screen.
 * -----------------------------------------------------------------------
 */
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
