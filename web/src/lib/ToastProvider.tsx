import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Toast } from "../components/ds/Toast";

interface ToastState {
  message: string;
  icon?: string;
}

const ToastContext = createContext<(message: string, icon?: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, icon?: string) => {
    setToast({ message, icon });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 2000 }}>
          <Toast icon={toast.icon}>{toast.message}</Toast>
        </div>
      )}
    </ToastContext.Provider>
  );
}
