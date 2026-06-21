"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table as TableIcon,
  Undo,
} from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing your article…",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap prose-article px-4 py-3 focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "H3",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet list",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Ordered list",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      label: "Quote",
    },
    {
      icon: LinkIcon,
      action: setLink,
      active: editor.isActive("link"),
      label: "Link",
    },
    {
      icon: ImageIcon,
      action: addImage,
      active: false,
      label: "Image",
    },
    {
      icon: TableIcon,
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      active: editor.isActive("table"),
      label: "Table",
    },
  ];

  return (
    <div className="rounded-lg border border-charcoal/20 bg-white shadow-elegant">
      <div className="flex flex-wrap gap-1 border-b border-charcoal/10 p-2">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            variant={tool.active ? "secondary" : "ghost"}
            size="sm"
            onClick={tool.action}
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className={cn("min-h-[320px]")} />
    </div>
  );
}
