import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

type SaveState = "saving" | "saved" | "unsaved" | "idle";

interface SaveIndicatorProps {
  state: SaveState;
}

export function SaveIndicator({ state }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === "saving" || state === "saved") {
      setVisible(true);
    }
    if (state === "saved") {
      const t = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(t);
    }
    if (state === "unsaved") {
      setVisible(true);
    }
  }, [state]);

  if (!visible) return null;

  return (
    <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]">
      {state === "saving" && (
        <>
          <Loader2 size={12} className="animate-spin" />
          Saving...
        </>
      )}
      {state === "saved" && (
        <>
          <Check size={12} className="text-green-500" />
          Saved
        </>
      )}
      {state === "unsaved" && (
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" title="Unsaved changes" />
      )}
    </span>
  );
}

export type { SaveState };
