import { useState } from "react";
import {
  ArrowRight,
  Clipboard,
  Clock,
  Copy,
  Download,
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
    <div className="min-h-screen bg-[#f8f0df] text-[#123d83] bg-[radial-gradient(#123d8318_1px,transparent_1px)] bg-size-[5px_5px]">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#f8f0df]/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
          <button
            onClick={() => setAuthOpen(false)}
            className="flex items-center gap-3"
            aria-label="Notico home"
          >
            <img
              src="/icons/notico.svg"
              alt=""
              className="h-10 w-10 rounded-xl shadow-sm"
            />
            <span className="text-2xl font-black tracking-tight">Notico</span>
          </button>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a href="#uses" className="hover:opacity-70">
              Use cases
            </a>
            <a href="#privacy" className="hover:opacity-70">
              Privacy
            </a>
            <a href="#extension" className="hover:opacity-70">
              Extension
            </a>
            <a href="#faq" className="hover:opacity-70">
              FAQ
            </a>
            <div className="flex gap-3">
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full border border-[#123d83] px-6 py-2 hover:bg-[#123d83] hover:text-[#fff9ed]"
              >
                Get Started
              </button>
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-white px-6 py-2 shadow-sm hover:bg-[#123d83] hover:text-[#fff9ed]"
              >
                Login
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-full border border-[#123d83]/25 p-2 md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="mx-5 mb-4 space-y-2 rounded-2xl border border-[#123d83]/20 bg-[#fff9ed] p-4 text-sm font-bold md:hidden">
            <a
              href="#uses"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use cases
            </a>
            <a
              href="#extension"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Extension
            </a>
            <button
              onClick={() => {
                setAuthOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-full bg-[#123d83] px-5 py-3 text-white"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-155 overflow-hidden px-5 pt-24 text-center md:min-h-180 md:px-10">
          <div
            className="absolute inset-x-0 bottom-0 h-[76%] bg-cover bg-center opacity-95 md:h-[82%]"
            style={{ backgroundImage: "url('/notico-coast-bg.jpg')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-linear-to-b from-[#f8f0df] via-[#f8f0df]/50 to-transparent"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto mt-6 max-w-4xl">
            <h1 className="text-balance text-5xl font-black leading-[0.92] tracking-tighter sm:text-7xl md:text-8xl">
              Quick notes,
              <br />
              10-minute lifetime.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-snug md:text-xl">
              Paste anything from your browser. Notes live for 10 minutes, then
              vanish. Perfect for quick captures you don't need to organize.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setAuthOpen(true)}
                className="flex min-w-52 items-center justify-center gap-2 rounded-full bg-[#123d83] px-8 py-3 text-base font-black text-white shadow-lg shadow-[#123d83]/20 hover:translate-y-[-1px]"
              >
                Start a note <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setAuthOpen(true)}
                className="min-w-52 rounded-full border border-[#123d83] bg-[#fff9ed]/55 px-8 py-3 text-base font-black backdrop-blur hover:bg-white"
              >
                Login
              </button>
            </div>
            <div className="hidden mx-auto mt-4 items-center gap-2 rounded-full border border-[#123d83]/70 bg-[#fff9ed]/70 px-6 py-2 text-lg font-black backdrop-blur">
              <Clock size={19} /> <span>09:59</span>{" "}
              <span className="text-sm font-semibold">remaining</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
          <div className="">
            <div>
              <h2 className="font-serif text-4xl text-center pb-10 font-black leading-none md:text-5xl">
                Not everything needs a folder.
              </h2>
            </div>
          </div>

          <div className="mt-9 grid gap-5 rounded-2xl border border-[#123d83]/20 bg-[#fff9ed]/55 p-4 shadow-xl shadow-[#123d83]/5 md:grid-cols-[0.34fr_0.66fr] md:p-6">
            <div className="rounded-xl p-2 md:p-5">
              <p className="text-xs font-black uppercase tracking-widest">
                Try it now
              </p>
              <h3 className="mt-4 font-serif text-3xl font-black leading-tight">
                Create a temporary note in seconds.
              </h3>
              <p className="mt-4 max-w-xs font-semibold">
                Paste anything. Copy the link. It lives for 10 minutes.
              </p>
              <p className="mt-10 rotate-[-8deg] font-serif text-2xl italic">
                Give it a try &rarr;
              </p>
            </div>
            <div className="rounded-2xl border border-[#123d83]/20 bg-[#fffdf6]/80 p-5 shadow-xl shadow-[#123d83]/10">
              <div className="flex flex-wrap items-center gap-3 border-b border-[#123d83]/20 pb-4">
                <FileText size={24} />
                <span className="font-mono text-xl font-black">
                  note-8f3a2c
                </span>
                <Link size={15} />
                <span className="ml-auto flex items-center gap-2 font-mono font-black">
                  <Clock size={18} />
                  09:54 remaining
                </span>
              </div>
              <div className="mt-5 rounded-xl border border-[#123d83]/25 bg-[#fffaf0] p-5 text-base font-semibold leading-relaxed">
                Figma is a collaborative interface design tool used by teams.
                <br />
                It helps design, prototype, and handoff all in one place.
                <br />
                <br />
                <span className="underline">https://www.figma.com</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold">
                <span className="mr-auto text-[#123d83]/55">
                  Created just now
                </span>
                <button className="rounded-lg border border-[#123d83]/15 px-4 py-2">
                  <Copy className="mr-2 inline" size={15} />
                  Copy
                </button>
                <button className="rounded-lg border border-[#123d83]/15 px-4 py-2">
                  <Share2 className="mr-2 inline" size={15} />
                  Share
                </button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-red-600">
                  <Trash2 className="mr-2 inline" size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div
            id="how"
            className="hidden mt-16 overflow-hidden rounded-[2rem] border border-[#123d83]/15 bg-[#fff9ed]/60 p-5 shadow-xl shadow-[#123d83]/5 md:p-8"
          >
            <div className="grid gap-8 md:grid-cols-[0.42fr_0.58fr] md:gap-12">
              <div className="flex flex-col justify-between gap-10">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#123d83]/55">
                    How it works
                  </p>
                  <h2 className="mt-4 font-serif text-5xl font-black leading-[0.95] tracking-tight text-[#071b3d] md:text-6xl">
                    Three moves, then it disappears.
                  </h2>
                </div>
                <p className="max-w-sm text-lg font-semibold leading-snug text-[#123d83]/60">
                  Notico is for the messy middle: paste the thing, use it where you need it, and let the app clean it up for you.
                </p>
              </div>

              <div className="relative rounded-[1.5rem] border border-[#123d83]/15 bg-[#fffdf6] p-4 md:p-5">
                <div
                  className="absolute inset-0 rounded-[1.5rem] opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(#123d8318 1px, transparent 1px), linear-gradient(90deg, #123d8318 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                  aria-hidden="true"
                />
                <div className="relative grid gap-3">
                  {[
                    ["01", "Paste", "Drop in a password, link, meeting line, or anything too small for a real document."],
                    ["02", "Use", "Open it from another device, copy it, share it, or keep editing while the timer runs."],
                    ["03", "Gone", "After ten minutes, the note expires so your workspace stays light."],
                  ].map(([n, title, desc], index) => (
                    <article
                      key={title}
                      className={`grid gap-4 rounded-2xl border border-[#123d83]/15 bg-[#fff9ed]/80 p-4 shadow-sm shadow-[#123d83]/5 sm:grid-cols-[4.5rem_1fr] ${
                        index === 1 ? "sm:ml-8" : index === 2 ? "sm:ml-16" : ""
                      }`}
                    >
                      <div className="font-serif text-4xl font-black leading-none text-[#ff6bb0]">
                        {n}
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-black text-[#071b3d]">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm font-semibold leading-snug text-[#123d83]/60">
                          {desc}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="uses" className="mt-9">
            <div className="grid items-center gap-10 py-10 md:grid-cols-[0.46fr_0.54fr] md:gap-16 md:py-16">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#123d83]/60">
                  Use Notico For
                </p>
                <h2 className="font-serif text-4xl font-black leading-[0.98] tracking-tight md:text-5xl">
                  Built for what you only need briefly
                </h2>

                <div className="mt-12 space-y-9">
                  <div>
                    <h3 className="flex items-center gap-3 font-serif text-2xl font-black text-[#071b3d]">
                      <span className="text-[#123d83]">✦</span> Between devices
                    </h3>
                    <p className="mt-4 max-w-md text-md font-regular leading-snug text-[#123d83]/55">
                      Send a Wi-Fi password, address, or tiny instruction from one phone to another without making a permanent note.
                    </p>
                  </div>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-black text-[#071b3d]">
                    <span className="text-[#123d83]">✦</span> While researching
                  </h3>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-black text-[#071b3d]">
                    <span className="text-[#123d83]">✦</span> During meetings
                  </h3>
                  <h3 className="flex items-center gap-3 font-serif text-2xl font-black text-[#071b3d]">
                    <span className="text-[#123d83]">✦</span> For quick links
                  </h3>
                </div>
              </div>

              <div className="relative mx-auto min-h-125 w-full max-w-lg overflow-hidden border border-[#123d83]/10 bg-[#fffdf6] p-8 shadow-2xl shadow-[#123d83]/10">
                <div
                  className="absolute inset-0 opacity-45"
                  style={{
                    backgroundImage:
                      "linear-gradient(#123d8320 1px, transparent 1px), linear-gradient(90deg, #123d8320 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                  aria-hidden="true"
                />
                <div className="relative mx-auto mt-8 h-58 max-w-sm">
                  <div className="absolute left-18 top-6 h-22 w-44 rotate-[-4deg] rounded-b-[50%] border-b-4 border-[#123d83]" />
                  <div className="absolute left-24 top-11 rotate-[-3deg] font-mono text-2xl font-black text-[#123d83]">
                    09:58
                  </div>
                  <div className="absolute left-2 top-0 h-10 w-12 rotate-[-24deg] rounded-[48%] bg-[#123d83]" />
                  <div className="absolute right-8 top-0 h-10 w-12 rotate-[22deg] rounded-[48%] bg-[#123d83]" />
                  <div className="absolute left-28 top-32 h-24 w-24 rounded-[48%_52%_44%_56%] border-4 border-[#123d83] bg-[#ff6bb0]" />
                  <div className="absolute left-19 top-25 h-36 w-18 rotate-[12deg] rounded-full border-4 border-[#123d83] bg-[#fff9ed]" />
                  <div className="absolute right-21 top-25 h-36 w-18 rotate-[-12deg] rounded-full border-4 border-[#123d83] bg-[#fff9ed]" />
                  <div className="absolute bottom-0 left-18 right-8 h-12 rounded-[50%] border-b-4 border-[#123d83]" />
                </div>
                <blockquote className="relative mt-12 max-w-sm font-serif text-3xl font-black leading-[1.05] text-[#071b3d]">
                  “I use it for the stuff I do not want living in my notes app forever.”
                </blockquote>
                <p className="relative mt-5 text-lg font-bold text-[#123d83]/50">
                  One of your future phones
                </p>
              </div>
            </div>
          </div>

          <div id="privacy" className="mt-10 hidden border-y border-[#123d83]/20 py-5">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-widest">
              Designed to disappear.
            </p>
            <div className="grid gap-5 md:grid-cols-4">
              {[
                [
                  ShieldCheck,
                  "Automatic expiration",
                  "Every note is deleted after 10 minutes. No exceptions.",
                ],
                [
                  Lock,
                  "Encrypted transport",
                  "Data is sent over HTTPS and never stored long-term.",
                ],
                [
                  Trash2,
                  "No permanent history",
                  "We don't keep logs of your notes or links.",
                ],
                [
                  Folder,
                  "No clutter",
                  "Nothing to organize. Nothing to clean up.",
                ],
              ].map(([Icon, title, desc]) => (
                <div key={String(title)} className="flex gap-3">
                  <Icon size={34} className="shrink-0" />
                  <div>
                    <h3 className="font-serif text-lg font-black">
                      {String(title)}
                    </h3>
                    <p className="text-sm font-semibold leading-snug">
                      {String(desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="extension"
            className="mt-16 grid gap-6 rounded-[2rem] border border-[#123d83]/15 bg-[#fff9ed]/70 p-5 shadow-xl shadow-[#123d83]/5 md:grid-cols-[0.58fr_0.42fr] md:p-8"
          >
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#123d83]/55">
                Browser extension
              </p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-[0.98] text-[#071b3d] md:text-5xl">
                Clip from the web, open on your phone.
              </h2>
              <p className="mt-5 max-w-xl text-base font-semibold leading-snug text-[#123d83]/60 md:text-lg">
                Download the Notico extension, load it in your browser, pair it from Profile, and send temporary notes straight from a page to every connected device.
              </p>
              <a
                href="/notico-extension.zip"
                download
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#123d83] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#123d83]/20 transition hover:translate-y-[-1px]"
              >
                <Download size={17} />
                Download extension
              </a>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#123d83]/15 bg-[#fffdf6] p-5">
              <div className="rounded-2xl border border-[#123d83]/15 bg-[#fff9ed] p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#123d83]/15 pb-3 font-black">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ff6bb0] text-white">N</span>
                  Notico clipper
                </div>
                <div className="mt-4 space-y-3 text-sm font-semibold text-[#123d83]/70">
                  <p className="rounded-xl bg-white/65 p-3">Selected text from this page...</p>
                  <p className="rounded-xl bg-white/65 p-3">Pair code: 7KQ2FA</p>
                  <p className="text-[#123d83]/45">Saved as a 10-minute note.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="relative overflow-hidden px-5 py-16 text-center md:px-10"
        >
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-55"
            style={{ backgroundImage: "url('/notico-coast-bg.jpg')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[#f8f0df]/65"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-serif text-4xl font-black md:text-5xl">
              Need it for ten minutes?
            </h2>
            <p className="mt-2 text-xl font-semibold">
              Capture it. Use it. Let it go.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-5 rounded-full bg-[#123d83] px-10 py-3 text-base font-black text-white shadow-lg shadow-[#123d83]/20"
            >
              Open Notico
            </button>
            <p className="mt-3 text-sm font-semibold">No account required.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
