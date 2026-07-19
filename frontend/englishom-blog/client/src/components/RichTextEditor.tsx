import { useEditor, EditorContent, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Youtube as YoutubeIcon,
  Upload,
  Trash2,
} from "lucide-react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl" | "auto";
}

// Custom TipTap Extension for raw <video> tags
const VideoExtension = Node.create({
  name: "videoNode",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: "controls" },
      class: { default: "w-full aspect-video rounded-xl my-4 shadow-lg" },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes, { controls: "controls" })];
  },
});

// Custom TipTap Extension for raw <iframe> tags
const IframeExtension = Node.create({
  name: "iframeNode",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      frameborder: { default: "0" },
      allowfullscreen: { default: "true" },
      allow: { default: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" },
      class: { default: "w-full aspect-video rounded-xl my-4 shadow-lg" },
    };
  },

  parseHTML() {
    return [{ tag: "iframe" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)];
  },
});

export function parseYoutubeUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }
  return null;
}

export default function RichTextEditor({ value, onChange, placeholder, dir }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLocalization();
  const isAr = language === "ar";

  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState("");

  // Video Dialog State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoMode, setVideoMode] = useState<"youtube" | "upload">("youtube");
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");
  const [youtubePreviewEmbed, setYoutubePreviewEmbed] = useState<string | null>(null);

  const defaultDir = dir || (isAr ? "rtl" : "ltr");

  const uploadMediaMutation = trpc.blog.posts.uploadMedia.useMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      VideoExtension,
      IframeExtension,
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
    const url = window.prompt(isAr ? "أدخل الرابط:" : "Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  // Delete selected node (Image, Video, Iframe, Youtube, etc.)
  const deleteSelectedMedia = () => {
    editor.chain().focus().deleteSelection().run();
    toast.success(isAr ? "تم حذف العنصر المحدد" : "Selected media deleted");
  };

  const isMediaSelected =
    editor.isActive("image") ||
    editor.isActive("youtube") ||
    editor.isActive("videoNode") ||
    editor.isActive("iframeNode");

  // Image Upload with Clean Progress & Single Toast
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error(isAr ? "حجم الصورة يجب أن يكون أقل من 20MB" : "Image size must be less than 20MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusText(isAr ? "جاري قراءة الصورة..." : "Reading image file...");

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 40);
        setUploadProgress(percent);
      }
    };

    reader.onload = async () => {
      setUploadStatusText(isAr ? "جاري رفع الصورة..." : "Uploading image...");
      setUploadProgress(60);
      const base64String = (reader.result as string).split(",")[1];

      let progressInterval: any = null;

      try {
        progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev < 94 ? prev + 4 : prev));
        }, 120);

        const data = await uploadMediaMutation.mutateAsync({
          fileName: file.name,
          fileData: base64String,
        });

        if (progressInterval) clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadStatusText(isAr ? "تم الرفع بنجاح!" : "Upload complete!");

        if (data?.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success(isAr ? "تم إدراج الصورة بنجاح!" : "Image inserted successfully!");
        }
      } catch (err: any) {
        if (progressInterval) clearInterval(progressInterval);
        toast.error(isAr ? `خطأ في رفع الصورة: ${err.message}` : `Image upload failed: ${err.message}`);
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatusText("");
        }, 500);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(isAr ? "فشل قراءة ملف الصورة" : "Failed to read image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.readAsDataURL(file);
  };

  // Video File Upload Handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error(isAr ? "حجم ملف الفيديو يجب أن يكون أقل من 50MB" : "Video file must be less than 50MB");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    setIsVideoModalOpen(false);
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusText(isAr ? "جاري قراءة ملف الفيديو..." : "Reading video file...");

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 40);
        setUploadProgress(percent);
      }
    };

    reader.onload = async () => {
      setUploadStatusText(isAr ? "جاري رفع الفيديو..." : "Uploading video...");
      setUploadProgress(60);
      const base64String = (reader.result as string).split(",")[1];

      let progressInterval: any = null;

      try {
        progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev < 94 ? prev + 3 : prev));
        }, 150);

        const data = await uploadMediaMutation.mutateAsync({
          fileName: file.name,
          fileData: base64String,
        });

        if (progressInterval) clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadStatusText(isAr ? "تم رفع الفيديو بنجاح!" : "Video upload complete!");

        if (data?.url) {
          editor.chain().focus().insertContent({
            type: "videoNode",
            attrs: { src: data.url },
          }).run();
          toast.success(isAr ? "تم إدراج الفيديو بنجاح!" : "Video inserted successfully!");
        }
      } catch (err: any) {
        if (progressInterval) clearInterval(progressInterval);
        toast.error(isAr ? `فشل رفع الفيديو: ${err.message}` : `Video upload failed: ${err.message}`);
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatusText("");
        }, 500);
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  // YouTube Link Insert
  const handleInsertYoutube = () => {
    if (!youtubePreviewEmbed && !youtubeUrlInput) {
      toast.error(isAr ? "يرجى أدخال رابط يوتيوب صحيح" : "Please enter a valid YouTube URL");
      return;
    }

    const embedUrl = youtubePreviewEmbed || parseYoutubeUrl(youtubeUrlInput);

    if (embedUrl) {
      // 1. Try TipTap YouTube Extension
      const setSuccess = editor.chain().focus().setYoutubeVideo({ src: youtubeUrlInput }).run();
      
      // 2. If TipTap youtube extension didn't run, use custom IframeExtension
      if (!setSuccess) {
        editor.chain().focus().insertContent({
          type: "iframeNode",
          attrs: { src: embedUrl },
        }).run();
      }
    } else {
      toast.error(isAr ? "تعذر استخراج فيديو اليوتيوب" : "Could not parse YouTube URL");
      return;
    }

    setIsVideoModalOpen(false);
    setYoutubeUrlInput("");
    setYoutubePreviewEmbed(null);
    toast.success(isAr ? "تم إدراج فيديو اليوتيوب بنجاح!" : "YouTube video embedded successfully!");
  };

  const handleYoutubeUrlChange = (val: string) => {
    setYoutubeUrlInput(val);
    const embed = parseYoutubeUrl(val);
    setYoutubePreviewEmbed(embed);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden relative">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
      />
      <input 
        type="file" 
        accept="video/*" 
        className="hidden" 
        ref={videoInputRef} 
        onChange={handleVideoUpload} 
      />

      {/* Toolbar */}
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b border-border items-center">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title={isAr ? "عريض" : "Bold"}
        >
          <Bold size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title={isAr ? "مائل" : "Italic"}
        >
          <Italic size={16} />
        </Button>

        <div className="w-px bg-border mx-1 h-5" />

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title={isAr ? "عنوان فرعي 2" : "Heading 2"}
        >
          <Heading2 size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title={isAr ? "عنوان فرعي 3" : "Heading 3"}
        >
          <Heading3 size={16} />
        </Button>

        <div className="w-px bg-border mx-1 h-5" />

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title={isAr ? "محاذاة لليسار" : "Align Left"}
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title={isAr ? "محاذاة للوسط" : "Align Center"}
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title={isAr ? "محاذاة لليمين" : "Align Right"}
        >
          <AlignRight size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'justify' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title={isAr ? "ضبط المحاذاة (Justify)" : "Justify"}
        >
          <AlignJustify size={16} />
        </Button>

        <div className="w-px bg-border mx-1 h-5" />

        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title={isAr ? "تنسيق اقتباس" : "Quote"}
        >
          <Quote size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title={isAr ? "قائمة نقطية" : "Bullet List"}
        >
          <List size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title={isAr ? "قائمة رقمية" : "Ordered List"}
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px bg-border mx-1 h-5" />

        <Button
          size="sm"
          variant="outline"
          onClick={addLink}
          title={isAr ? "إضافة رابط" : "Add Link"}
        >
          <LinkIcon size={16} />
        </Button>

        {/* Video Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVideoModalOpen(true)}
          title={isAr ? "إدراج فيديو (يوتيوب أو رفع)" : "Insert Video"}
          className="gap-1 text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
        >
          <Video size={16} />
        </Button>

        {/* Image Upload Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          title={isAr ? "رفع صورة" : "Upload Image"}
          disabled={isUploading}
        >
          <ImageIcon size={16} />
        </Button>

        {/* Delete Selected Media Button */}
        {isMediaSelected && (
          <Button
            size="sm"
            variant="destructive"
            onClick={deleteSelectedMedia}
            title={isAr ? "حذف العنصر المحدد" : "Delete Selected Media"}
            className="gap-1 animate-in fade-in"
          >
            <Trash2 size={15} />
            <span className="text-xs font-semibold">{isAr ? "حذف" : "Delete"}</span>
          </Button>
        )}

        <div className="w-px bg-border mx-1 h-5" />

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title={isAr ? "تراجع" : "Undo"}
        >
          <Undo2 size={16} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title={isAr ? "إعادة" : "Redo"}
        >
          <Redo2 size={16} />
        </Button>
      </div>

      {/* Upload Progress Indicator Bar (0% -> 100%) */}
      {isUploading && (
        <div className="bg-blue-50 dark:bg-slate-900 border-b border-blue-200 dark:border-slate-700 p-3 flex flex-col gap-2 animate-in fade-in">
          <div className="flex justify-between items-center text-xs font-bold text-blue-600 dark:text-blue-400">
            <span className="flex items-center gap-2">
              <Loader2 size={15} className="animate-spin" />
              {uploadStatusText || (isAr ? "جاري رفع الملف..." : "Uploading file...")}
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono text-xs">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="prose dark:prose-invert prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-lg" dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="text-red-500" size={20} />
              {isAr ? "إدراج فيديو في المقالة" : "Insert Video in Post"}
            </DialogTitle>
          </DialogHeader>

          {/* Mode Selector */}
          <div className="flex border border-border rounded-lg overflow-hidden my-2">
            <button
              type="button"
              className={`flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                videoMode === "youtube"
                  ? "bg-red-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setVideoMode("youtube")}
            >
              <YoutubeIcon size={16} />
              {isAr ? "رابط يوتيوب" : "YouTube Link"}
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                videoMode === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setVideoMode("upload")}
            >
              <Upload size={16} />
              {isAr ? "رفع ملف فيديو" : "Upload Video File"}
            </button>
          </div>

          {videoMode === "youtube" ? (
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">
                  {isAr ? "ضع رابط فيديو اليوتيوب هنا:" : "Paste YouTube Video Link:"}
                </label>
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrlInput}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  dir="ltr"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  {isAr
                    ? "يدعم روابط watch و youtu.be و shorts"
                    : "Supports watch, short links & shorts"}
                </span>
              </div>

              {/* YouTube Video Live Preview */}
              {youtubePreviewEmbed ? (
                <div className="rounded-lg overflow-hidden border border-border shadow-md">
                  <span className="text-xs font-semibold p-2 bg-muted block text-muted-foreground">
                    {isAr ? "معاينة الفيديو قبل الإدراج:" : "Video Live Preview:"}
                  </span>
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={youtubePreviewEmbed}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : youtubeUrlInput ? (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded text-xs">
                  {isAr ? "الرابط غير صحيح أو متعذر التعرف عليه" : "Invalid YouTube URL format"}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4 py-4 text-center border-2 border-dashed border-border rounded-xl p-6">
              <Upload size={32} className="mx-auto text-blue-500 mb-2" />
              <div>
                <h4 className="text-sm font-bold mb-1">
                  {isAr ? "اختر ملف فيديو لرفعه" : "Choose a video file to upload"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isAr ? "يدعم صيغ MP4, WebM حتى 50MB" : "Supports MP4, WebM up to 50MB"}
                </p>
              </div>

              <Button
                type="button"
                variant="default"
                onClick={() => videoInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAr ? "اختيار فيديو من الجهاز" : "Browse Video"}
              </Button>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setIsVideoModalOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            {videoMode === "youtube" && (
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!youtubePreviewEmbed}
                onClick={handleInsertYoutube}
              >
                {isAr ? "إدراج الفيديو في المقال" : "Insert Video"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
