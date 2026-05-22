import { FileText, Calendar, Settings } from "lucide-react";

type View = "notes" | "editor" | "search" | "settings" | "calendar";

interface MobileNavProps {
  view: View;
  onViewChange: (v: View) => void;
}

export function MobileNav({ view, onViewChange }: MobileNavProps) {
  const items = [
    { id: "notes" as View, label: "Notes", icon: FileText },
    { id: "calendar" as View, label: "Calendar", icon: Calendar },
    { id: "settings" as View, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden flex items-center justify-around h-14 bg-[var(--color-surface)] border-t border-[var(--color-border)] pb-[var(--safe-area-bottom)] shrink-0">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors relative ${
            view === id
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-tertiary)]"
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium leading-none">{label}</span>
          {view === id && (
            <span className="absolute top-0 left-[20%] right-[20%] h-0.5 rounded-full bg-[var(--color-accent)]" />
          )}
        </button>
      ))}
    </nav>
  );
}
