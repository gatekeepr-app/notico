import { createContext, useContext, useCallback, type ReactNode } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    type === "error" ? sonnerToast.error(message) : sonnerToast.success(message);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster richColors position="bottom-right" />
    </ToastContext.Provider>
  );
}
