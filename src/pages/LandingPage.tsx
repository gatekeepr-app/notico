import { useState } from "react";
import {
  ArrowRight,
  Clipboard,
  Clock,
  Copy,
  FileText,
  Folder,
  KeyRound,
  Link,
  Lock,
  Menu,
  PenLine,
  Search,
  Share2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { LoginPage } from "../components/auth/LoginPage";

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authOpen) {
    return (
      <div className="min-h-screen bg-[#f8f0df] text-[#123d83]">
        <button
          onClick={() => setAuthOpen(false)}
          className="fixed left-4 top-4 z-50 rounded-full border border-[#123d83]/30 bg-[#fff9ed]/80 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white"
        >
          Back
        </button>
        <div className="flex min-h-screen items-center justify-center p-4">
          <LoginPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f0df] text-[#123d83] [background-image:radial-gradient(#123d8318_1px,transparent_1px)] [background-size:5px_5px]">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#f8f0df]/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
          <button onClick={() => setAuthOpen(false)} className="flex items-center gap-3" aria-label="Notico home">
            <img src="/icons/notico.svg" alt="" className="h-10 w-10 rounded-xl shadow-sm" />
            <span className="text-2xl font-black tracking-tight">Notico</span>
          </button>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a href="#how" className="hover:opacity-70">How it works</a>
            <a href="#uses" className="hover:opacity-70">Use cases</a>
            <a href="#privacy" className="hover:opacity-70">Privacy</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
            <button onClick={() => setAuthOpen(true)} className="rounded-full border border-[#123d83] px-6 py-2 hover:bg-[#123d83] hover:text-[#fff9ed]">
              Get Started
            </button>
            <button onClick={() => setAuthOpen(true)} className="rounded-full bg-white px-6 py-2 shadow-sm hover:bg-[#123d83] hover:text-[#fff9ed]">
              Login
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen((v) => !v)} className="rounded-full border border-[#123d83]/25 p-2 md:hidden">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="mx-5 mb-4 space-y-2 rounded-2xl border border-[#123d83]/20 bg-[#fff9ed] p-4 text-sm font-bold md:hidden">
            <a href="#how" className="block py-2" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <a href="#uses" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Use cases</a>
            <button onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }} className="w-full rounded-full bg-[#123d83] px-5 py-3 text-white">
              Get Started
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-[620px] overflow-hidden px-5 pt-24 text-center md:min-h-[720px] md:px-10">
          <div
            className="absolute inset-x-0 bottom-0 h-[76%] bg-cover bg-center opacity-95 md:h-[82%]"
            style={{ backgroundImage: "url('/notico-coast-bg.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f0df] via-[#f8f0df]/50 to-transparent" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <h1 className="text-balance text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-7xl md:text-8xl">
              Quick notes,<br />10-minute lifetime.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-snug md:text-xl">
              Paste anything from your browser. Notes live for 10 minutes, then vanish. Perfect for quick captures you don't need to organize.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => setAuthOpen(true)} className="flex min-w-52 items-center justify-center gap-2 rounded-full bg-[#123d83] px-8 py-3 text-base font-black text-white shadow-lg shadow-[#123d83]/20 hover:translate-y-[-1px]">
                Start a note <ArrowRight size={18} />
              </button>
              <button onClick={() => setAuthOpen(true)} className="min-w-52 rounded-full border border-[#123d83] bg-[#fff9ed]/55 px-8 py-3 text-base font-black backdrop-blur hover:bg-white">
                Login
              </button>
            </div>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#123d83]/70 bg-[#fff9ed]/70 px-6 py-2 text-lg font-black backdrop-blur">
              <Clock size={19} /> <span>09:59</span> <span className="text-sm font-semibold">remaining</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
          <div className="grid gap-8 border-b border-[#123d83]/20 pb-9 md:grid-cols-[1fr_0.6fr_1fr_0.5fr] md:items-center">
            <div>
              <h2 className="font-serif text-4xl font-black leading-none md:text-5xl">Not everything<br />needs a folder.</h2>
              <div className="mt-6 h-px w-20 bg-[#123d83]" />
            </div>
            <p className="border-[#123d83]/20 text-base font-semibold leading-relaxed md:border-l md:pl-10">Phone number.<br />Quote.<br />Link.<br />Address.<br />A paragraph.</p>
            <p className="text-lg font-semibold leading-relaxed">Information comes and goes.<br />You don't always need to save it.<br /><br /><strong>You just need it for a minute.</strong></p>
            <PenLine className="mx-auto h-20 w-20 opacity-70" strokeWidth={1.3} />
          </div>

          <div className="mt-9 grid gap-5 rounded-2xl border border-[#123d83]/20 bg-[#fff9ed]/55 p-4 shadow-xl shadow-[#123d83]/5 md:grid-cols-[0.34fr_0.66fr] md:p-6">
            <div className="rounded-xl p-2 md:p-5">
              <p className="text-xs font-black uppercase tracking-widest">Try it now</p>
              <h3 className="mt-4 font-serif text-3xl font-black leading-tight">Create a temporary note in seconds.</h3>
              <p className="mt-4 max-w-xs font-semibold">Paste anything. Copy the link. It lives for 10 minutes.</p>
              <p className="mt-10 rotate-[-8deg] font-serif text-2xl italic">Give it a try &rarr;</p>
            </div>
            <div className="rounded-2xl border border-[#123d83]/20 bg-[#fffdf6]/80 p-5 shadow-xl shadow-[#123d83]/10">
              <div className="flex flex-wrap items-center gap-3 border-b border-[#123d83]/20 pb-4">
                <FileText size={24} />
                <span className="font-mono text-xl font-black">note-8f3a2c</span>
                <Link size={15} />
                <span className="ml-auto flex items-center gap-2 font-mono font-black"><Clock size={18} />09:54 remaining</span>
              </div>
              <div className="mt-5 rounded-xl border border-[#123d83]/25 bg-[#fffaf0] p-5 text-base font-semibold leading-relaxed">
                Figma is a collaborative interface design tool used by teams.<br />It helps design, prototype, and handoff all in one place.<br /><br />
                <span className="underline">https://www.figma.com</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold">
                <span className="mr-auto text-[#123d83]/55">Created just now</span>
                <button className="rounded-lg border border-[#123d83]/15 px-4 py-2"><Copy className="mr-2 inline" size={15} />Copy</button>
                <button className="rounded-lg border border-[#123d83]/15 px-4 py-2"><Share2 className="mr-2 inline" size={15} />Share</button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-red-600"><Trash2 className="mr-2 inline" size={15} />Delete</button>
              </div>
            </div>
          </div>

          <div id="how" className="mt-9 rounded-2xl border border-[#123d83]/20 bg-[#fff9ed]/55 p-4">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-widest">How it works</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [Clipboard, "01", "Paste", "Paste anything from your browser into Notico. No formatting needed."],
                [Link, "02", "Use", "Copy the link and use it however you need. It works everywhere."],
                [Clock, "03", "Forget", "After 10 minutes, the note disappears forever."],
              ].map(([Icon, n, title, desc]) => (
                <div key={String(title)} className="flex gap-4 border-[#123d83]/15 p-3 md:border-r last:border-0">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#123d83]/15 bg-[#efe7d7]">
                    <Icon size={26} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-black"><span className="mr-3 font-mono">{String(n)}</span>{String(title)}</h3>
                    <p className="mt-2 text-sm font-semibold leading-snug">{String(desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="uses" className="mt-9">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-widest">Use Notico For</p>
            <div className="grid gap-4 md:grid-cols-5">
              {[
                [FileText, "Between devices", "Wi-Fi: BlueOak-Guest\nPassword: oak@2024\nFloor: 3"],
                [Search, "While researching", "The best way to predict the future is to invent it.\n- Alan Kay"],
                [Users, "During meetings", "Action items:\n- Review Q2 report\n- Sync with design\n- Follow up"],
                [KeyRound, "For developers", "API token placeholder\nExpires: 10 minutes\nTimeout: 30s"],
                [PenLine, "For creators", "Hook idea:\n\"Tiny things, big clarity.\""],
              ].map(([Icon, title, body]) => (
                <article key={String(title)} className="rounded-xl border border-[#123d83]/20 bg-[#fff9ed]/55 p-4">
                  <h3 className="flex items-center gap-2 font-serif text-base font-black"><Icon size={22} />{String(title)}</h3>
                  <p className="mt-4 whitespace-pre-line rounded-lg border border-[#123d83]/15 bg-[#fffdf6]/70 p-3 text-sm font-semibold leading-snug">{String(body)}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="privacy" className="mt-10 border-y border-[#123d83]/20 py-5">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-widest">Designed to disappear.</p>
            <div className="grid gap-5 md:grid-cols-4">
              {[
                [ShieldCheck, "Automatic expiration", "Every note is deleted after 10 minutes. No exceptions."],
                [Lock, "Encrypted transport", "Data is sent over HTTPS and never stored long-term."],
                [Trash2, "No permanent history", "We don't keep logs of your notes or links."],
                [Folder, "No clutter", "Nothing to organize. Nothing to clean up."],
              ].map(([Icon, title, desc]) => (
                <div key={String(title)} className="flex gap-3">
                  <Icon size={34} className="shrink-0" />
                  <div>
                    <h3 className="font-serif text-lg font-black">{String(title)}</h3>
                    <p className="text-sm font-semibold leading-snug">{String(desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="relative overflow-hidden px-5 py-16 text-center md:px-10">
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-55"
            style={{ backgroundImage: "url('/notico-coast-bg.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#f8f0df]/65" aria-hidden="true" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-serif text-4xl font-black md:text-5xl">Need it for ten minutes?</h2>
            <p className="mt-2 text-xl font-semibold">Capture it. Use it. Let it go.</p>
            <button onClick={() => setAuthOpen(true)} className="mt-5 rounded-full bg-[#123d83] px-10 py-3 text-base font-black text-white shadow-lg shadow-[#123d83]/20">
              Open Notico
            </button>
            <p className="mt-3 text-sm font-semibold">No account required.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
