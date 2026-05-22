import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ToastProvider } from "./components/Toast";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  unsavedChangesWarning: false,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ConvexProvider>
  </StrictMode>
);
