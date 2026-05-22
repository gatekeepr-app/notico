import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface DraggableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
}

export function DraggableSplitPane({ left, right, defaultRatio = 0.5, minRatio = 0.25, maxRatio = 0.75 }: DraggableSplitPaneProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newRatio = Math.max(minRatio, Math.min(maxRatio, x / rect.width));
      setRatio(newRatio);
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minRatio, maxRatio]);

  return (
    <div ref={containerRef} className="flex h-full w-full" style={{ userSelect: dragging.current ? "none" : undefined }}>
      <div style={{ width: `${ratio * 100}%` }} className="min-w-0">
        {left}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-[5px] bg-[var(--color-border-subtle)] cursor-col-resize shrink-0 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors group relative"
      >
        <GripVertical size={12} className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div style={{ width: `${(1 - ratio) * 100}%` }} className="min-w-0">
        {right}
      </div>
    </div>
  );
}
