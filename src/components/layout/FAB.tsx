import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-all duration-200 active:scale-95 md:hidden"
      style={{
        right: "1rem",
        bottom: "calc(var(--nav-height) + var(--safe-area-bottom) + 0.75rem)",
        width: "3.25rem",
        height: "3.25rem",
        boxShadow: "0 4px 20px color-mix(in srgb, var(--color-accent) 35%, transparent)",
      }}
    >
      <Plus size={22} strokeWidth={2.5} />
    </button>
  );
}
