import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export function LoginPage() {
  const { signup, login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, name || undefined);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--color-surface-subtle)] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {isSignup ? "Start taking notes with Notico" : "Sign in to your Notico account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-text-secondary)] mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(""); }}
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
