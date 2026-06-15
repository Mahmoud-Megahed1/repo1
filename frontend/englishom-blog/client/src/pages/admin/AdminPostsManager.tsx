import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";
import ArticlePreview from "@/components/ArticlePreview";
import { Loader2, Edit2, Trash2, Plus, Eye, ImagePlus, Clock } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { toast } from "sonner";

export default function AdminPostsManager() {
  const { language } = useLocalization();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<number>(5);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingSlug, setExistingSlug] = useState<string>("");

  // Fetch ALL posts (admin endpoint - includes drafts)
  const { data: postsData, isLoading, refetch } = trpc.blog.posts.listAdmin.useQuery({
    limit: 100,
  });
  const posts = postsData?.posts || [];

  // Fetch categories
  const { data: categories = [] } = trpc.blog.categories.list.useQuery();

  // Create post mutation
  const createPostMutation = trpc.blog.posts.create.useMutation({
    onSuccess: (data: any) => {
      toast.success(language === "ar" ? "تم إنشاء المقال بنجاح" : "Post created successfully");
      // If there's a featured image, upload it
      if (featuredImageFile && data?.[0]?.insertId) {
        handleUploadImage(data[0].insertId);
      }
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(language === "ar" ? `خطأ في إنشاء المقال: ${error.message}` : `Failed to create post: ${error.message}`);
    },
  });

  // Update post mutation
  const updatePostMutation = trpc.blog.posts.update.useMutation({
    onSuccess: () => {
      toast.success(language === "ar" ? "تم تحديث المقال بنجاح" : "Post updated successfully");
      // If there's a new featured image, upload it
      if (featuredImageFile && editingId) {
        handleUploadImage(editingId);
      }
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(language === "ar" ? `خطأ في تحديث المقال: ${error.message}` : `Failed to update post: ${error.message}`);
    },
  });

  // Delete post mutation
  const deletePostMutation = trpc.blog.posts.delete.useMutation({
    onSuccess: () => {
      toast.success(language === "ar" ? "تم حذف المقال بنجاح" : "Post deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(language === "ar" ? `خطأ في حذف المقال: ${error.message}` : `Failed to delete post: ${error.message}`);
    },
  });

  // Upload image mutation
  const uploadImageMutation = trpc.blog.posts.uploadImage.useMutation({
    onSuccess: () => {
      toast.success(language === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(language === "ar" ? `خطأ في رفع الصورة: ${error.message}` : `Failed to upload image: ${error.message}`);
    },
  });

  const handleUploadImage = async (postId: number) => {
    if (!featuredImageFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      uploadImageMutation.mutate({
        postId,
        fileName: featuredImageFile.name,
        fileData: base64String,
      });
    };
    reader.onerror = () => {
      toast.error(language === "ar" ? "فشل قراءة الملف" : "Failed to read file");
    };
    reader.readAsDataURL(featuredImageFile);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === "ar" ? "حجم الصورة يجب أن يكون أقل من 5MB" : "Image must be less than 5MB");
        return;
      }
      setFeaturedImageFile(file);
      const url = URL.createObjectURL(file);
      setFeaturedImagePreview(url);
    }
  };

  // Calculate reading time from content
  const calculateReadingTime = () => {
    const text = contentAr || contentEn;
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadingTimeMinutes(minutes);
    toast.success(language === "ar" ? `مدة القراءة: ${minutes} دقيقة (${wordCount} كلمة)` : `Reading time: ${minutes} min (${wordCount} words)`);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitleEn("");
    setTitleAr("");
    setExcerptEn("");
    setExcerptAr("");
    setContentEn("");
    setContentAr("");
    setCategoryId(undefined);
    setStatus("draft");
    setReadingTimeMinutes(5);
    setFeaturedImageFile(null);
    setFeaturedImagePreview("");
    setShowPreview(false);
    setExistingSlug("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleEn || !titleAr || !contentEn || !contentAr || !categoryId) {
      toast.error(language === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    const generatedSlug = titleEn.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "") || `post-${Date.now()}`;

    const postData: any = {
      titleEn,
      titleAr,
      excerptEn,
      excerptAr,
      contentEn,
      contentAr,
      categoryId,
      status,
      readingTimeMinutes,
      slug: existingSlug || generatedSlug,
    };

    // If there is an external URL and no file selected, save it directly
    if (!featuredImageFile && featuredImagePreview && !featuredImagePreview.startsWith("blob:")) {
      postData.featuredImageUrl = featuredImagePreview;
    }

    if (editingId) {
      updatePostMutation.mutate({
        id: editingId,
        ...postData,
      });
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitleEn(post.titleEn);
    setTitleAr(post.titleAr);
    setExcerptEn(post.excerptEn || "");
    setExcerptAr(post.excerptAr || "");
    setContentEn(post.contentEn);
    setContentAr(post.contentAr);
    setCategoryId(post.categoryId);
    setStatus(post.status || "draft");
    setReadingTimeMinutes(post.readingTimeMinutes || 5);
    setFeaturedImagePreview(post.featuredImageUrl || "");
    setFeaturedImageFile(null);
    setExistingSlug(post.slug || "");
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(language === "ar" ? "هل أنت متأكد من حذف هذا المقال؟" : "Are you sure you want to delete this post?")) {
      deletePostMutation.mutate({ id });
    }
  };

  const getStatusBadge = (postStatus: string) => {
    const styles: Record<string, string> = {
      published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
    const labels: Record<string, string> = {
      published: language === "ar" ? "منشور" : "Published",
      draft: language === "ar" ? "مسودة" : "Draft",
      scheduled: language === "ar" ? "مجدول" : "Scheduled",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[postStatus] || styles.draft}`}>
        {labels[postStatus] || postStatus}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-6 border-2" style={{ borderColor: ENGLISHOM_COLORS.primary }}>
          <h3 className="text-xl font-bold mb-6">
            {editingId ? (language === "ar" ? "تعديل المقال" : "Edit Post") : (language === "ar" ? "إنشاء مقال جديد" : "Create New Post")}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* English Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title (English)</label>
                  <Input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter English title"
                    required
                  />
                </div>

                {/* Arabic Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                  <Input
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="أدخل العنوان بالعربية"
                    required
                    dir="rtl"
                  />
                </div>

                {/* English Excerpt */}
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (English)</label>
                  <Input
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>

                {/* Arabic Excerpt */}
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (Arabic)</label>
                  <Input
                    value={excerptAr}
                    onChange={(e) => setExcerptAr(e.target.value)}
                    placeholder="وصف موجز"
                    dir="rtl"
                  />
                </div>

                {/* Slug (URL) */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "رابط المقالة (Slug)" : "Post URL (Slug)"}
                  </label>
                  <Input
                    value={existingSlug}
                    onChange={(e) => setExistingSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder={language === "ar" ? "مثال: my-new-post" : "e.g. my-new-post"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "ar" 
                      ? "اختياري: اتركه فارغاً ليتم توليده تلقائياً. تأكد من عدم استخدام مسافات أو رموز معقدة." 
                      : "Optional: Leave empty to auto-generate. Avoid spaces and special characters."}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {language === "ar" ? cat.nameAr : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="draft">{language === "ar" ? "مسودة" : "Draft"}</option>
                    <option value="published">{language === "ar" ? "منشور" : "Published"}</option>
                  </select>
                </div>

                {/* Reading Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock size={14} className="inline-block mr-1" />
                    {language === "ar" ? "مدة القراءة (بالدقائق)" : "Reading Time (minutes)"}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={readingTimeMinutes}
                      onChange={(e) => setReadingTimeMinutes(Number(e.target.value))}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={calculateReadingTime}
                      title={language === "ar" ? "حساب تلقائي من المحتوى" : "Auto-calculate from content"}
                    >
                      {language === "ar" ? "حساب تلقائي" : "Auto"}
                    </Button>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <ImagePlus size={14} className="inline-block mr-1" />
                    {language === "ar" ? "الصورة المميزة" : "Featured Image"}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <ImagePlus size={16} />
                        {language === "ar" ? "اختر صورة" : "Choose Image"}
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground px-2">
                        {language === "ar" ? "أو" : "OR"}
                      </span>
                      <Input
                        type="url"
                        placeholder={language === "ar" ? "أدخل رابط الصورة..." : "Enter image URL..."}
                        value={!featuredImageFile && featuredImagePreview ? featuredImagePreview : ""}
                        onChange={(e) => {
                          setFeaturedImageFile(null);
                          setFeaturedImagePreview(e.target.value);
                        }}
                        className="flex-1"
                      />
                    </div>
                    {(featuredImagePreview || featuredImageFile) && (
                      <span className="text-sm text-green-600">
                        {featuredImageFile ? featuredImageFile.name : (language === "ar" ? "تم استخدام رابط خارجي" : "Using external URL")}
                      </span>
                    )}
                  </div>
                  {featuredImagePreview && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border h-40">
                      <img
                        src={featuredImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* English Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content (English)</label>
                  <RichTextEditor
                    value={contentEn}
                    onChange={setContentEn}
                    placeholder="Write your content in English..."
                  />
                </div>

                {/* Arabic Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content (Arabic)</label>
                  <RichTextEditor
                    value={contentAr}
                    onChange={setContentAr}
                    placeholder="اكتب محتواك بالعربية..."
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {createPostMutation.isPending || updatePostMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === "ar" ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      editingId 
                        ? (language === "ar" ? "تحديث المقال" : "Update Post")
                        : (language === "ar" ? "إنشاء المقال" : "Create Post")
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Preview Section */}
            {showPreview && (
              <div className="border-l-2 pl-6" style={{ borderColor: ENGLISHOM_COLORS.primary }}>
                <h4 className="text-lg font-semibold mb-4">Live Preview</h4>
                <ArticlePreview
                  titleEn={titleEn}
                  titleAr={titleAr}
                  contentEn={contentEn}
                  contentAr={contentAr}
                  excerptEn={excerptEn}
                  excerptAr={excerptAr}
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </Card>
      )}

      {/* Posts List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{language === "ar" ? "المقالات" : "Blog Posts"}</h3>
          <Button
            onClick={() => setIsCreating(true)}
            style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {language === "ar" ? "مقال جديد" : "New Post"}
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            {language === "ar" ? "لا توجد مقالات بعد. أنشئ أول مقال!" : "No posts yet. Create your first post!"}
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <Card key={post.id} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{post.titleEn}</h4>
                    {getStatusBadge(post.status)}
                    {post.readingTimeMinutes && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTimeMinutes} min
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{post.titleAr}</p>
                  {post.category && (
                    <span className="text-xs text-muted-foreground">
                      {language === "ar" ? post.category.nameAr : post.category.nameEn}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                    title={language === "ar" ? "تعديل" : "Edit"}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletePostMutation.isPending}
                    title={language === "ar" ? "حذف" : "Delete"}
                  >
                    {deletePostMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
