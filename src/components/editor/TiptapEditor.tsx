import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ImageExt from "@tiptap/extension-image";
import { useEffect, useCallback, useState } from "react";
import {
  ChevronDown, Heading1, Heading2, Heading3,
  List, ListOrdered, Undo, Redo,
  CheckSquare, Image, Loader2,
} from "lucide-react";
import { SlashMenu } from "./SlashMenu";
import { useToast } from "../Toast";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch("/api/uploadthing/imageUploader", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.data?.[0]?.url || data.url;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const { toast } = useToast();
  const [editorReady, setEditorReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [headingsOpen, setHeadingsOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder: "Start writing... / for commands" }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      ImageExt.configure({ inline: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-3 md:px-5 py-2 md:py-4 min-h-full",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file);
              toast("Uploading pasted image...");
            }
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file);
            toast("Uploading dropped image...");
            return true;
          }
        }
        return false;
      },
    },
    onCreate: () => setEditorReady(true),
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
      toast("Image uploaded");
    } catch {
      toast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  }, [editor, toast]);

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const wrapSelectedHeading = useCallback((level: 1 | 2 | 3) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  if (!editor) return null;

  const MenuButton = ({ onClick, active, children, disabled }: { onClick: () => void; active?: boolean; children: React.ReactNode; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-1.5 md:p-1 transition-colors ${
        active ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] shrink-0 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setHeadingsOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Headings <ChevronDown size={13} />
          </button>
          {headingsOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 w-36 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
              <button onClick={() => { wrapSelectedHeading(1); setHeadingsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><Heading1 size={14} /> Heading 1</button>
              <button onClick={() => { wrapSelectedHeading(2); setHeadingsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><Heading2 size={14} /> Heading 2</button>
              <button onClick={() => { wrapSelectedHeading(3); setHeadingsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><Heading3 size={14} /> Heading 3</button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setListsOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Lists <ChevronDown size={13} />
          </button>
          {listsOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 w-36 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
              <button onClick={() => { editor.chain().focus().toggleBulletList().run(); setListsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><List size={14} /> Listed</button>
              <button onClick={() => { editor.chain().focus().toggleOrderedList().run(); setListsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><ListOrdered size={14} /> Numbered</button>
              <button onClick={() => { editor.chain().focus().toggleTaskList().run(); setListsOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"><CheckSquare size={14} /> Checkbox</button>
            </div>
          )}
        </div>
        <MenuButton
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) handleImageUpload(file);
            };
            input.click();
          }}
          disabled={uploading}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
        </MenuButton>
        <span className="flex-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </MenuButton>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      {editorReady && <SlashMenu editor={editor} />}
    </div>
  );
}
