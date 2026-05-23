import { useState, useEffect, useRef, useCallback } from "react";
import type { Editor } from "@tiptap/core";
import {
  Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, Quote, Code, Minus,
} from "lucide-react";

const COMMANDS = [
  { id: "h1", label: "Heading 1", icon: Heading1, type: "heading", level: 1, keywords: "h1 heading" },
  { id: "h2", label: "Heading 2", icon: Heading2, type: "heading", level: 2, keywords: "h2 heading" },
  { id: "h3", label: "Heading 3", icon: Heading3, type: "heading", level: 3, keywords: "h3 heading" },
  { id: "bullet", label: "Bullet List", icon: List, type: "bulletList", keywords: "ul list bullet" },
  { id: "ordered", label: "Numbered List", icon: ListOrdered, type: "orderedList", keywords: "ol list numbered" },
  { id: "task", label: "Task List", icon: CheckSquare, type: "taskList", keywords: "task checklist todo" },
  { id: "quote", label: "Blockquote", icon: Quote, type: "blockquote", keywords: "quote blockquote" },
  { id: "code", label: "Code Block", icon: Code, type: "codeBlock", keywords: "code block pre" },
  { id: "hr", label: "Divider", icon: Minus, type: "horizontalRule", keywords: "hr divider" },
];

interface SlashMenuProps {
  editor: Editor | null;
}

export function SlashMenu({ editor }: SlashMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const slashPosRef = useRef<number | null>(null);

  const filtered = COMMANDS.filter(
    (c) => c.label.toLowerCase().includes(query) || c.keywords.includes(query)
  );

  const execute = useCallback((cmd: typeof COMMANDS[0]) => {
    if (!editor) return;
    const tr = editor.state.tr;
    const from = slashPosRef.current;
    if (from !== null) {
      tr.delete(from, editor.state.selection.from);
      editor.view.dispatch(tr);
    }
    editor.chain().focus().run();
    if (cmd.type === "heading" && cmd.level) {
      editor.chain().focus().toggleHeading({ level: cmd.level as 1 | 2 | 3 }).run();
    } else if (cmd.type === "horizontalRule") {
      editor.chain().focus().setHorizontalRule().run();
    } else if (cmd.type === "bulletList") {
      editor.chain().focus().toggleBulletList().run();
    } else if (cmd.type === "orderedList") {
      editor.chain().focus().toggleOrderedList().run();
    } else if (cmd.type === "taskList") {
      editor.chain().focus().toggleTaskList().run();
    } else if (cmd.type === "blockquote") {
      editor.chain().focus().toggleBlockquote().run();
    } else if (cmd.type === "codeBlock") {
      editor.chain().focus().toggleCodeBlock().run();
    }
    setOpen(false);
    setQuery("");
    slashPosRef.current = null;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(Math.max(0, from - 1), from);
        if (textBefore === "/") {
          e.preventDefault();
          const coords = editor.view.coordsAtPos(from);
          setPos({ x: coords.left, y: coords.bottom + 4 });
          setQuery("");
          setSelectedIdx(0);
          slashPosRef.current = from;
          setOpen(true);
          return;
        }
      }

      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && filtered[selectedIdx]) {
        e.preventDefault();
        execute(filtered[selectedIdx]);
        return;
      }
      if (e.key === "Backspace" && slashPosRef.current !== null) {
        const from = editor.state.selection.from;
        const typed = editor.state.doc.textBetween(slashPosRef.current, from);
        setQuery(typed.slice(1));
        if (typed === "/") {
          setOpen(false);
        }
        return;
      }

      if (e.key.length === 1 && slashPosRef.current !== null) {
        const from = editor.state.selection.from;
        const typed = editor.state.doc.textBetween(slashPosRef.current, from);
        setQuery(typed.slice(1));
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);
    return () => editor.view.dom.removeEventListener("keydown", handleKeyDown);
  }, [editor, open, query, selectedIdx, filtered, execute]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("pointerdown", handler);
      return () => document.removeEventListener("pointerdown", handler);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl py-1 overflow-hidden"
      style={{ left: pos.x, top: pos.y }}
    >
      {filtered.length === 0 && (
        <div className="px-3 py-4 text-xs text-center text-[var(--color-text-tertiary)]">No commands found</div>
      )}
      {filtered.map((cmd, i) => {
        const Icon = cmd.icon;
        return (
          <button
            key={cmd.id}
            onPointerDown={(e) => { e.preventDefault(); execute(cmd); }}
            onPointerEnter={() => setSelectedIdx(i)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
              i === selectedIdx
                ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
            }`}
          >
            <Icon size={14} />
            <span>{cmd.label}</span>
          </button>
        );
      })}
    </div>
  );
}
