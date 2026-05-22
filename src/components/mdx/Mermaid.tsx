import { useEffect, useRef } from "react";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<pre class="text-xs text-[var(--color-text-secondary)]">${chart}</pre>`;
    }
  }, [chart]);

  return <div ref={ref} className="my-2 rounded-lg border border-[var(--color-border-subtle)] bg-white p-3" />;
}
