import { useRef, useState, useCallback } from "react";

/**
 * useToast
 * Minimal toast-notification hook: call `showToast("message")`
 * from anywhere and it auto-dismisses after ~2.2s.
 */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return { toast, showToast };
}
