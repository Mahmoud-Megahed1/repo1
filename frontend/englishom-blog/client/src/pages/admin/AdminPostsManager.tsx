import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";
import ArticlePreview from "@/components/ArticlePreview";
import { Loader2, Edit2, Trash2, Plus, Eye } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

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

  // Fetch posts
  const { data: postsData, isLoading, refetch } = trpc.blog.posts.list.useQuery({
    limit: 100,
    offset: 0,
  });
  const posts = postsData?.posts || [];

  // Fetch categories
  const { data: categories = [] } = trpc.blog.categories.list.useQuery();

  // Create post mutation
  const createPostMutation = trpc.blog.posts.create.useMutation({
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  // Update post mutation
  const updatePostMutation = trpc.blog.posts.update.useMutation({
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  // Delete post mutation
  const deletePostMutation = trpc.blog.posts.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

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
    setShowPreview(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleEn || !titleAr || !contentEn || !contentAr || !categoryId) {
      alert("Please fill in all required fields");
      return;
    }

    const postData = {
      titleEn,
      titleAr,
      excerptEn,
      excerptAr,
      contentEn,
      contentAr,
      categoryId,
      status,
      slug: titleEn.toLowerCase().replace(/\s+/g, "-"),
    };

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
    setExcerptEn(post.excerptEn);
    setExcerptAr(post.excerptAr);
    setContentEn(post.contentEn);
    setContentAr(post.contentAr);
    setCategoryId(post.categoryId);
    setStatus(post.status);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate({ id });
    }
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
            {editingId ? "Edit Post" : "Create New Post"}
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {createPostMutation.isPending || updatePostMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? "Update Post" : "Create Post"
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
          <h3 className="text-2xl font-bold">Blog Posts</h3>
          <Button
            onClick={() => setIsCreating(true)}
            style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No posts yet. Create your first post!
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <Card key={post.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{post.titleEn}</h4>
                  <p className="text-sm text-gray-500">{post.titleAr}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={16} />
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
