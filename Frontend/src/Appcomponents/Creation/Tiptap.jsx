import React from "react";
import { EditorProvider, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Heading,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

const Tiptap = ({ value }) => {
  const { setValue } = useFormContext();
  ///tip tap ka form yk part py mk usecontext nk from t khhu lone ko pyn u tr
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
        heading: {
          HTMLAttributes: { class: "text-2xl font-bold" },
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[80px] w-[50%] rounded-md border border-input  px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      if (editor) {
        const content = editor.getHTML();
        setValue("overview", content, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
  });

  return (
    <div>
      {editor && (
        <div className="space-y-2">
          <Toggle
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading className="w-4 h-4" />
          </Toggle>{" "}
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
