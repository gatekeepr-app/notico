import { lazy, Suspense } from "react";
import { useAuth } from "./components/auth/AuthProvider";
import { LandingPage } from "./pages/LandingPage";

const AppLayout = lazy(() => import("./components/layout/AppLayout").then((mod) => ({ default: mod.AppLayout })));

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[var(--color-surface-subtle)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-dvh overflow-y-auto bg-[var(--color-surface-subtle)]">
        <LandingPage />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex h-dvh items-center justify-center bg-[var(--color-surface-subtle)]" />}>
      <AppLayout />
    </Suspense>
  );
}
