import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function AdminCategoriesManager() {
  const { language } = useLocalization();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  // Fetch categories
  const { data: categories = [], isLoading, refetch } = trpc.blog.categories.list.useQuery();

  // Create category mutation
  const createCategoryMutation = trpc.blog.categories.create.useMutation({
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  // Update category mutation
  const updateCategoryMutation = trpc.blog.categories.update.useMutation({
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = trpc.blog.categories.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setNameEn("");
    setNameAr("");
    setDescriptionEn("");
    setDescriptionAr("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameEn || !nameAr) {
      alert("Please fill in all required fields");
      return;
    }

    const categoryData = {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      slug: nameEn.toLowerCase().replace(/\s+/g, "-"),
    };

    if (editingId) {
      updateCategoryMutation.mutate({
        id: editingId,
        ...categoryData,
      });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setNameEn(category.nameEn);
    setNameAr(category.nameAr);
    setDescriptionEn(category.descriptionEn || "");
    setDescriptionAr(category.descriptionAr || "");
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate({ id });
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
            {editingId ? "Edit Category" : "Create New Category"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* English Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Category Name (English)</label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Enter English category name"
                required
              />
            </div>

            {/* Arabic Name */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم الفئة (العربية)</label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="أدخل اسم الفئة بالعربية"
                dir="rtl"
                required
              />
            </div>

            {/* English Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description (English)</label>
              <Input
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Enter English description (optional)"
              />
            </div>

            {/* Arabic Description */}
            <div>
              <label className="block text-sm font-medium mb-2">الوصف (العربية)</label>
              <Input
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="أدخل الوصف بالعربية (اختياري)"
                dir="rtl"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">All Categories</h3>
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              style={{ backgroundColor: ENGLISHOM_COLORS.success }}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Category
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No categories yet</p>
          ) : (
            (categories as any[]).map((category: any) => (
              <Card key={category.id} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-semibold">{language === "ar" ? category.nameAr : category.nameEn}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.descriptionEn || category.descriptionAr || "No description"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
