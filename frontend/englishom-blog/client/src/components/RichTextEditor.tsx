import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Quote,
  Video,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl" | "auto";
}

export default function RichTextEditor({ value, onChange, placeholder, dir }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLocalization();
  const [isUploading, setIsUploading] = useState(false);

  const defaultDir = dir || (language === "ar" ? "rtl" : "ltr");

  const uploadMediaMutation = trpc.blog.posts.uploadMedia.useMutation({
    onSuccess: (data) => {
      editor?.chain().focus().setImage({ src: data.url }).run();
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(language === "ar" ? `خطأ في رفع الصورة: ${error.message}` : `Upload failed: ${error.message}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'blockquote'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    editorProps: {
      attributes: {
        dir: defaultDir,
        class: defaultDir === "rtl" ? "rtl-editor" : "ltr-editor",
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setOptions({
        editorProps: {
          attributes: {
            dir: defaultDir,
            class: defaultDir === "rtl" ? "rtl-editor" : "ltr-editor",
          },
        },
      });
    }
  }, [defaultDir, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt(language === "ar" ? "أدخل الرابط:" : "Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt(
      language === "ar"
        ? "أدخل رابط فيديو اليوتيوب:"
        : "Enter YouTube Video URL:"
    );

    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === "ar" ? "حجم الصورة يجب أن يكون أقل من 5MB" : "Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      uploadMediaMutation.mutate({
        fileName: file.name,
        fileData: base64String,
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error(language === "ar" ? "فشل قراءة الملف" : "Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden relative">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
      />
      {/* Toolbar */}
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b border-border">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title={language === "ar" ? "عريض" : "Bold"}
        >
          <Bold size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title={language === "ar" ? "مائل" : "Italic"}
        >
          <Italic size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title={language === "ar" ? "عنوان فرعي 2" : "Heading 2"}
        >
          <Heading2 size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title={language === "ar" ? "عنوان فرعي 3" : "Heading 3"}
        >
          <Heading3 size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title={language === "ar" ? "محاذاة لليسار" : "Align Left"}
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title={language === "ar" ? "محاذاة للوسط" : "Align Center"}
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title={language === "ar" ? "محاذاة لليمين" : "Align Right"}
        >
          <AlignRight size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'justify' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title={language === "ar" ? "ضبط المحاذاة (Justify)" : "Justify"}
        >
          <AlignJustify size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title={language === "ar" ? "تنسيق اقتباس" : "Quote"}
        >
          <Quote size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title={language === "ar" ? "قائمة نقطية" : "Bullet List"}
        >
          <List size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title={language === "ar" ? "قائمة رقمية" : "Ordered List"}
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          size="sm"
          variant="outline"
          onClick={addLink}
          title={language === "ar" ? "إضافة رابط" : "Add Link"}
        >
          <LinkIcon size={16} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={addYoutubeVideo}
          title={language === "ar" ? "إدراج فيديو يوتيوب" : "Insert YouTube Video"}
        >
          <Video size={16} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          title={language === "ar" ? "رفع صورة" : "Upload Image"}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title={language === "ar" ? "تراجع" : "Undo"}
        >
          <Undo2 size={16} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title={language === "ar" ? "إعادة" : "Redo"}
        >
          <Redo2 size={16} />
        </Button>
      </div>

      {/* Editor */}
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
