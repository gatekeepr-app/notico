import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Eye, EyeOff, Mail, Lock, User, Loader2, KeyRound } from "lucide-react";

export function LoginPage() {
  const { signup, login, loginWithCode, resetPasswordWithCode } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [useCode, setUseCode] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (forgotPassword) {
        await resetPasswordWithCode(code, password);
      } else if (useCode) {
        await loginWithCode(code);
      } else if (isSignup) {
        await signup(email, password, name || undefined);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      const message = String(err?.message || "");
      setError(message.includes("Invalid") || message.includes("password") || message.includes("expired") ? "Invalid email, password, or code" : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center overflow-y-auto bg-[var(--color-surface-subtle)] px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-xl shadow-black/5 sm:p-8">
        <div className="mb-7 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
            {forgotPassword ? "Reset password" : useCode ? "Connect this device" : isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-snug text-[var(--color-text-secondary)]">
            {forgotPassword ? "Use a pairing code from a signed-in device" : useCode ? "Use the code from your other phone" : isSignup ? "Start taking notes with Notico" : "Sign in to your Notico account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {useCode || forgotPassword ? (
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Pairing code"
                required
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-4 py-2.5 text-sm uppercase tracking-[0.25em] outline-none focus:border-[var(--color-accent)] text-[var(--color-text)] placeholder:tracking-normal placeholder:normal-case placeholder:text-[var(--color-text-tertiary)] transition-colors"
              />
            </div>
          ) : (
            <>
              {isSignup && (
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-base outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] sm:text-sm"
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
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-base outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] sm:text-sm"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={forgotPassword ? "New password" : "Password"}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-11 text-base outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </>
          )}

          {forgotPassword && (
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                required
                minLength={6}
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-11 text-base outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {forgotPassword ? "Reset and sign in" : useCode ? "Connect this device" : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
          {useCode || forgotPassword ? "Have your email and password?" : isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setUseCode(false); setForgotPassword(false); setIsSignup(useCode || forgotPassword ? false : !isSignup); setError(""); }}
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            {useCode || forgotPassword || isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
        {!isSignup && !useCode && !forgotPassword && (
          <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
            Connecting another phone?{" "}
            <button onClick={() => { setUseCode(true); setError(""); }} className="text-[var(--color-accent)] hover:underline font-medium">
              Use pairing code
            </button>
            <span className="mx-2 text-[var(--color-text-tertiary)]">/</span>
            <button onClick={() => { setForgotPassword(true); setError(""); }} className="text-[var(--color-accent)] hover:underline font-medium">
              Forgot password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
