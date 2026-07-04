import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Offers from "./pages/Offers";
import BestSellers from "./pages/BestSellers";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import AdminApp from "./admin/AdminApp";

/**
 * App
 * -----------------------------------------------------------------------
 * All routes live here, in one place, wrapped by <Layout /> so every
 * page automatically gets the header, footer, floating WhatsApp/Facebook
 * buttons and toast notifications.
 * -----------------------------------------------------------------------
 */
export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
