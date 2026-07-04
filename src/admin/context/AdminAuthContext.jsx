import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentAdmin, signInAdmin, signOutAdmin } from "../../services/adminService";

/**
 * src/admin/context/AdminAuthContext.jsx
 * -----------------------------------------------------------------------
 * Tracks the current Supabase Auth session and whether that user is a
 * row in `admin_users`. `/admin/*` routes are gated on `admin !== null`
 * (see ProtectedRoute.jsx). A signed-in Supabase user who is NOT in
 * admin_users is treated as unauthorized (RLS would block them anyway,
 * but we also keep them out of the dashboard UI itself).
 * -----------------------------------------------------------------------
 */
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const current = await getCurrentAdmin();
      setAdmin(current);
      setError(null);
    } catch (err) {
      console.error("[AdminAuth] Failed to load admin session:", err);
      setAdmin(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription?.subscription?.unsubscribe();
  }, [refresh]);

  const signIn = useCallback(async (email, password) => {
    await signInAdmin(email, password);
    await refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await signOutAdmin();
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, signIn, signOut, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within <AdminAuthProvider>");
  return ctx;
}
