import { useState } from "react";
import { FileText, Clock, Smartphone, ArrowRight, Menu, X } from "lucide-react";
import { LoginPage } from "../components/auth/LoginPage";

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authOpen) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-subtle)] flex flex-col">
        <button
          onClick={() => setAuthOpen(false)}
          className="fixed top-4 left-4 z-50 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold text-[var(--color-text)]">Notico</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a href="#features" className="hover:text-[var(--color-text)] transition-colors">Features</a>
            <button
              onClick={() => setAuthOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-lg hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 space-y-2">
            <a href="#features" className="block text-sm text-[var(--color-text-secondary)] py-1">Features</a>
            <button
              onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-medium mb-6">
            <Clock size={12} />
            Notes that expire — save for the moment
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight leading-tight">
            Quick notes,<br />
            <span className="text-[var(--color-accent)]">10-minute</span> lifetime.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
            Paste anything from your browser. Notes live for 10 minutes, then vanish.
            Perfect for quick captures you don't need to organize.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setAuthOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Start capturing <ArrowRight size={16} />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-surface-subtle)] transition-colors text-center"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] text-center mb-12">
            Built for speed, not storage.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText size={20} />,
                title: "Browser Extension",
                desc: "Paste text directly from any webpage. No tab switching, no copy-paste hoops.",
              },
              {
                icon: <Clock size={20} />,
                title: "10-Minute Lifetime",
                desc: "Every note auto-expires. Capture what matters now, forget what doesn't.",
              },
              {
                icon: <Smartphone size={20} />,
                title: "Works Everywhere",
                desc: "Chrome extension + responsive web app. Your notes sync in real-time.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] mb-3">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            Ready to try it?
          </h2>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            No credit card. No setup. Just paste and go.
          </p>
          <button
            onClick={() => setAuthOpen(true)}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Create your account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span>Notico — quick notes that don't stick around.</span>
          <span>Built with Convex + React</span>
        </div>
      </footer>
    </div>
  );
}
