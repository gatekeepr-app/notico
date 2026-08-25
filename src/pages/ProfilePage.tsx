import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../components/auth/AuthProvider";
import { useToast } from "../components/Toast";
import { User, LogOut, Plug, Copy, Check, Loader2, RefreshCw } from "lucide-react";

export function ProfilePage() {
  const { user, logout, token } = useAuth();
  const { toast } = useToast();
  const generateCode = useMutation(api.pairing.generate);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const code = await generateCode({ token });
      setPairingCode(code);
    } catch (err: any) {
      toast(err.message || "Failed to generate code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!pairingCode) return;
    await navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    toast("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Profile</h1>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <User size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{user?.name || "Notico User"}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Plug size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Pair Extension</h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Generate a code to connect the Notico browser extension to your account. The code expires in 5 minutes.
          </p>

          {pairingCode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] px-4 py-3 text-center">
                  <span className="text-2xl font-mono font-bold tracking-[0.3em] text-[var(--color-accent)]">{pairingCode}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="rounded-xl border border-[var(--color-border-subtle)] p-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] text-center">
                Enter this code in the Notico extension popup
              </p>
              <button
                onClick={handleGenerateCode}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <RefreshCw size={12} />
                Generate new code
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plug size={14} />}
              Pair Extension
            </button>
          )}
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
}
