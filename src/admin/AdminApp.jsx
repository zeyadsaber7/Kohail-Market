import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Banners from "./pages/Banners";
import Orders from "./pages/Orders";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

/**
 * src/admin/AdminApp.jsx
 * -----------------------------------------------------------------------
 * Mounted at /admin/* (see src/App.jsx), completely separate from the
 * storefront's <Layout /> (no header/footer/cart). Wraps everything in
 * <AdminAuthProvider> so only this subtree pays for the extra auth
 * session lookup — storefront visitors never trigger it.
 * -----------------------------------------------------------------------
 */
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
