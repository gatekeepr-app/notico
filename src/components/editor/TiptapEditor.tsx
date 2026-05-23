import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ImageExt from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";
import { useEffect, useCallback, useState } from "react";
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Code, Quote, Undo, Redo,
  CheckSquare, Image,
} from "lucide-react";
import { SlashMenu } from "./SlashMenu";
import { useToast } from "../Toast";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const { toast } = useToast();
  const [editorReady, setEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder: "Start writing... / for commands" }),
      CodeBlockLowlight.configure({ lowlight }),
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
              const reader = new FileReader();
              reader.onload = (e) => {
                const url = e.target?.result as string;
                editor?.chain().focus().setImage({ src: url }).run();
              };
              reader.readAsDataURL(file);
              toast("Image pasted (stored inline)");
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
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              editor?.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
            toast("Image dropped (stored inline)");
            return true;
          }
        }
        return false;
      },
    },
    onCreate: () => setEditorReady(true),
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const wrapSelectedHeading = useCallback((level: 1 | 2 | 3) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  if (!editor) return null;

  const MenuButton = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`rounded-lg p-1.5 md:p-1 transition-colors ${
        active ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] shrink-0 flex-wrap">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={16} />
        </MenuButton>
        <span className="w-px h-4 bg-[var(--color-border)] mx-0.5" />
        <MenuButton onClick={() => wrapSelectedHeading(1)} active={editor.isActive("heading", { level: 1 })}>
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton onClick={() => wrapSelectedHeading(2)} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton onClick={() => wrapSelectedHeading(3)} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 size={16} />
        </MenuButton>
        <span className="w-px h-4 bg-[var(--color-border)] mx-0.5" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")}>
          <CheckSquare size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <Code size={16} />
        </MenuButton>
        <MenuButton onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const url = e.target?.result as string;
                editor.chain().focus().setImage({ src: url }).run();
                toast("Image inserted");
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        }}>
          <Image size={16} />
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
