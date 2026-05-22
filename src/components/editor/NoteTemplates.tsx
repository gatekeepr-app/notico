import { useState, useRef, useEffect } from "react";
import { FileText, Calendar, Users, X } from "lucide-react";

const TEMPLATES = [
  {
    id: "daily",
    label: "Daily Note",
    icon: Calendar,
    description: "Plan your day and track progress",
    getContent: () => {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      return `## ${today}

### Goals
- 

### Schedule
- 

### Notes
- 

### Tomorrow
- 
`;
    },
  },
  {
    id: "meeting",
    label: "Meeting Notes",
    icon: Users,
    description: "Capture meeting discussions and action items",
    getContent: () => `## Meeting Notes

**Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
**Attendees:** 
**Topic:** 

### Agenda
1. 

### Notes
- 

### Action Items
- [ ] 
`,
  },
  {
    id: "general",
    label: "Blank Note",
    icon: FileText,
    description: "Start with a blank page",
    getContent: () => "",
  },
];

interface NoteTemplatesProps {
  onSelect: (title: string, content: string) => void;
}

export function NoteTemplates({ onSelect }: NoteTemplatesProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors"
      >
        <FileText size={12} />
        Template
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl py-1 overflow-hidden z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Templates</span>
            <button onClick={() => setOpen(false)} className="rounded p-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-subtle)]">
              <X size={12} />
            </button>
          </div>
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.id}
                onClick={() => { onSelect(tpl.id === "daily" ? `Daily Note — ${new Date().toISOString().slice(0, 10)}` : tpl.label, tpl.getContent()); setOpen(false); }}
                className="w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <Icon size={14} className="mt-0.5 text-[var(--color-accent)]" />
                <div>
                  <div className="text-xs font-medium text-[var(--color-text)]">{tpl.label}</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)]">{tpl.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
