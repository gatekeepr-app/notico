import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/25 transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-xl hover:scale-105 active:scale-95"
    >
      <Plus size={22} />
    </button>
  );
}
