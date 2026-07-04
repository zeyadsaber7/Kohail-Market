import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import BootScreen from "./components/BootScreen";
import { CartProvider } from "./context/CartContext";
import { initDataStore, refreshDataStore } from "./data/store";
import "./index.css";

/**
 * Root
 * -----------------------------------------------------------------------
 * Fetches categories + products from Supabase once (see src/data/store.js)
 * BEFORE rendering the actual app. This is what lets every existing page
 * keep using the same synchronous `CATEGORIES` / `getProductById()` /
 * etc. calls it always did — by the time <App /> mounts, the data is
 * already sitting in memory.
 * -----------------------------------------------------------------------
 */
function Root() {
  const [state, setState] = useState({ ready: false, error: null });
  const attempted = useRef(false);

  const load = useCallback(() => {
    setState({ ready: false, error: null });
    const task = attempted.current ? refreshDataStore() : initDataStore();
    attempted.current = true;
    task
      .then(() => setState({ ready: true, error: null }))
      .catch((err) => {
        console.error("[Supabase] Failed to load initial data:", err);
        setState({ ready: false, error: err });
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!state.ready) {
    return <BootScreen error={state.error} onRetry={load} />;
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
