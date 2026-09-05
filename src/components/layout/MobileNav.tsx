import { FileText, Settings, User } from "lucide-react";

type View = "notes" | "editor" | "search" | "settings" | "profile";

interface MobileNavProps {
  view: View;
  onViewChange: (v: View) => void;
}

export function MobileNav({ view, onViewChange }: MobileNavProps) {
    const items = [
    { id: "notes" as View, label: "Notes", icon: FileText },
    { id: "settings" as View, label: "Settings", icon: Settings },
    { id: "profile" as View, label: "Profile", icon: User },
  ];

  return (
    <nav
      className="md:hidden flex items-center justify-around shrink-0"
      style={{
        height: "var(--nav-height)",
        paddingBottom: "var(--safe-area-bottom)",
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        backdropFilter: "saturate(180%) blur(20px)",
        borderTop: "0.5px solid var(--color-border)",
      }}
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className="relative flex flex-col items-center justify-center gap-px min-w-0 flex-1 h-full transition-colors"
            style={{
              WebkitTapHighlightColor: "transparent",
              color: active ? "var(--color-accent)" : "var(--color-text-tertiary)",
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span
              className="text-[10px] leading-none"
              style={{ fontWeight: active ? 600 : 500 }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
