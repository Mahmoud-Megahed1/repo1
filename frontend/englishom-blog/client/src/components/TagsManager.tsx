import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  usageCount: number;
}

interface TagsManagerProps {
  selectedTags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  availableTags?: Tag[];
  isLoading?: boolean;
}

export default function TagsManager({
  selectedTags = [],
  onTagsChange,
  availableTags = [],
  isLoading = false,
}: TagsManagerProps) {
  const { language } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newTagEn, setNewTagEn] = useState("");
  const [newTagAr, setNewTagAr] = useState("");

  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.find((st) => st.id === tag.id) &&
      (tag.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.nameAr.includes(searchQuery))
  );

  const handleAddTag = (tag: Tag) => {
    const newTags = [...selectedTags, tag];
    onTagsChange?.(newTags);
    setSearchQuery("");
    setShowSuggestions(false);
    toast.success(language === "ar" ? "تم إضافة الوسم" : "Tag added");
  };

  const handleRemoveTag = (tagId: number) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);
    onTagsChange?.(newTags);
    toast.success(language === "ar" ? "تم حذف الوسم" : "Tag removed");
  };

  const handleCreateTag = () => {
    if (!newTagEn.trim() || !newTagAr.trim()) {
      toast.error(language === "ar" ? "الرجاء ملء جميع الحقول" : "Please fill all fields");
      return;
    }

    // In a real app, this would call an API to create the tag
    const newTag: Tag = {
      id: Math.random(),
      nameEn: newTagEn,
      nameAr: newTagAr,
      slug: newTagEn.toLowerCase().replace(/\s+/g, "-"),
      usageCount: 0,
    };

    handleAddTag(newTag);
    setNewTagEn("");
    setNewTagAr("");
    toast.success(language === "ar" ? "تم إنشاء وسم جديد" : "New tag created");
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "ar" ? "الوسوم المختارة" : "Selected Tags"}
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${ENGLISHOM_COLORS.primary}20`,
                color: ENGLISHOM_COLORS.primary,
              }}
            >
              <span>{language === "ar" ? tag.nameAr : tag.nameEn}</span>
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:opacity-70"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedTags.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {language === "ar" ? "لا توجد وسوم مختارة" : "No tags selected"}
            </p>
          )}
        </div>
      </div>

      {/* Search and Add Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "ar" ? "إضافة وسم" : "Add Tag"}
        </label>
        <div className="relative">
          <Input
            placeholder={language === "ar" ? "ابحث عن وسم..." : "Search tags..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            disabled={isLoading}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredTags.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleAddTag(tag)}
                  className="w-full text-left px-4 py-2 hover:bg-muted flex items-center justify-between"
                >
                  <span>{language === "ar" ? tag.nameAr : tag.nameEn}</span>
                  <span className="text-xs text-muted-foreground">({tag.usageCount})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create New Tag */}
      <div className="space-y-2 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium">
          {language === "ar" ? "إنشاء وسم جديد" : "Create New Tag"}
        </p>
        <div className="space-y-2">
          <Input
            placeholder={language === "ar" ? "الاسم بالإنجليزية" : "Name in English"}
            value={newTagEn}
            onChange={(e) => setNewTagEn(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder={language === "ar" ? "الاسم بالعربية" : "Name in Arabic"}
            value={newTagAr}
            onChange={(e) => setNewTagAr(e.target.value)}
            disabled={isLoading}
            dir="rtl"
          />
          <Button
            onClick={handleCreateTag}
            disabled={isLoading || !newTagEn.trim() || !newTagAr.trim()}
            className="w-full"
            style={{ backgroundColor: ENGLISHOM_COLORS.success }}
          >
            <Plus size={16} className="mr-2" />
            {language === "ar" ? "إنشاء" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
