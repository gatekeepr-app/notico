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
    <div className="flex min-h-svh w-full items-center justify-center overflow-y-auto bg-[#f8f0df] bg-[radial-gradient(#123d8318_1px,transparent_1px)] bg-size-[5px_5px] px-4 py-8 text-[#123d83] sm:px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-[#123d83]/20 bg-[#fff9ed]/85 p-5 shadow-2xl shadow-[#123d83]/10 backdrop-blur sm:p-8">
        <div className="mb-7 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123d83]">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h1 className="text-balance font-serif text-4xl font-black leading-none text-[#071b3d] sm:text-5xl">
            {forgotPassword ? "Reset password" : useCode ? "Connect this device" : isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-base font-semibold leading-snug text-[#123d83]/60">
            {forgotPassword ? "Use a pairing code from a signed-in device" : useCode ? "Use the code from your other phone" : isSignup ? "Start taking notes with Notico" : "Sign in to your Notico account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {useCode || forgotPassword ? (
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123d83]/45" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Pairing code"
                required
                className="w-full rounded-xl border border-[#123d83]/15 bg-[#fffdf6] py-3 pl-10 pr-4 text-base uppercase tracking-[0.25em] text-[#071b3d] outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[#123d83]/35 focus:border-[#123d83]"
              />
            </div>
          ) : (
            <>
              {isSignup && (
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123d83]/45" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-xl border border-[#123d83]/15 bg-[#fffdf6] py-3 pl-10 pr-4 text-base text-[#071b3d] outline-none transition-colors placeholder:text-[#123d83]/35 focus:border-[#123d83]"
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123d83]/45" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full rounded-xl border border-[#123d83]/15 bg-[#fffdf6] py-3 pl-10 pr-4 text-base text-[#071b3d] outline-none transition-colors placeholder:text-[#123d83]/35 focus:border-[#123d83]"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123d83]/45" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={forgotPassword ? "New password" : "Password"}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-[#123d83]/15 bg-[#fffdf6] py-3 pl-10 pr-11 text-base text-[#071b3d] outline-none transition-colors placeholder:text-[#123d83]/35 focus:border-[#123d83]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#123d83]/45"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </>
          )}

          {forgotPassword && (
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#123d83]/45" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                required
                minLength={6}
                className="w-full rounded-xl border border-[#123d83]/15 bg-[#fffdf6] py-3 pl-10 pr-11 text-base text-[#071b3d] outline-none transition-colors placeholder:text-[#123d83]/35 focus:border-[#123d83]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#123d83]/45"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123d83] py-3 text-base font-black text-white transition-colors hover:bg-[#071b3d] disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {forgotPassword ? "Reset and sign in" : useCode ? "Connect this device" : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-[#123d83]/60">
          {useCode || forgotPassword ? "Have your email and password?" : isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setUseCode(false); setForgotPassword(false); setIsSignup(useCode || forgotPassword ? false : !isSignup); setError(""); }}
            className="font-black text-[#123d83] hover:underline"
          >
            {useCode || forgotPassword || isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
        {!isSignup && !useCode && !forgotPassword && (
          <p className="mt-3 text-center text-sm font-semibold text-[#123d83]/60">
            Connecting another phone?{" "}
            <button onClick={() => { setUseCode(true); setError(""); }} className="font-black text-[#123d83] hover:underline">
              Use pairing code
            </button>
            <span className="mx-2 text-[#123d83]/30">/</span>
            <button onClick={() => { setForgotPassword(true); setError(""); }} className="font-black text-[#123d83] hover:underline">
              Forgot password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
