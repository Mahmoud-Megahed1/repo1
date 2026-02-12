'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getThemes, updateTheme, uploadThemeKnowledge } from '@/services/themes';
import { Theme, UpdateThemeDto } from '@/types/themes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, MessageSquare, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function GlobalAISettings() {
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isEditingKnowledge, setIsEditingKnowledge] = useState(false);
    const [editedKnowledge, setEditedKnowledge] = useState('');
    const queryClient = useQueryClient();

    // Fetch themes to find the active one
    const { data: themes, isLoading } = useQuery({
        queryKey: ['themes'],
        queryFn: getThemes,
    });

    useEffect(() => {
        if (themes) {
            let themesArray: Theme[] = [];
            // Handle various response structures
            if (Array.isArray(themes)) {
                themesArray = themes;
            } else if (themes.data && Array.isArray(themes.data)) {
                themesArray = themes.data;
            }

            if (themesArray.length > 0) {
                // Find active theme or just take the first one
                const active = themesArray.find((t) => t.isActive) || themesArray[0];
                setCurrentTheme(active);
            }
        }
    }, [themes]);

    const { mutate: updateSettings } = useMutation({
        mutationFn: (data: UpdateThemeDto) => {
            if (!currentTheme) throw new Error('No active theme');
            return updateTheme(currentTheme._id, data);
        },
        onSuccess: () => {
            toast.success('Settings updated successfully');
            queryClient.invalidateQueries({ queryKey: ['themes'] });
        },
        onError: () => {
            toast.error('Failed to update settings');
        },
    });

    const handleToggle = (
        key: 'showSupportChat' | 'showAIReviewChat',
        checked: boolean,
    ) => {
        if (!currentTheme) return;
        // Optimistic update local state for UI responsiveness
        setCurrentTheme({ ...currentTheme, [key]: checked });
        updateSettings({ [key]: checked } as UpdateThemeDto);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !currentTheme) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await uploadThemeKnowledge(currentTheme._id, formData);
            if (res.data && res.data.aiKnowledgeContext) {
                setCurrentTheme({
                    ...currentTheme,
                    aiKnowledgeContext: res.data.aiKnowledgeContext,
                });
                toast.success('Knowledge base updated successfully');
            }
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleSaveKnowledgeEdit = () => {
        if (!currentTheme) return;
        updateSettings({ aiKnowledgeContext: editedKnowledge } as UpdateThemeDto);
        setCurrentTheme({ ...currentTheme, aiKnowledgeContext: editedKnowledge });
        setIsEditingKnowledge(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentTheme) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center text-muted-foreground">
                <p>No active theme found. Please configure a theme first.</p>
                <Link href="/admin/cms/themes">
                    <Button variant="outline">Go to Themes</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Chat Visibility Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Chat Visibility
                        </CardTitle>
                        <CardDescription>
                            Control which AI features are visible to students.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="showSupportChat" className="cursor-pointer">
                                Enable Global Support Chat
                            </Label>
                            <Switch
                                id="showSupportChat"
                                checked={currentTheme.showSupportChat ?? true}
                                onCheckedChange={(c) => handleToggle('showSupportChat', c)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="showAIReviewChat" className="cursor-pointer">
                                Enable Lesson Review AI
                            </Label>
                            <Switch
                                id="showAIReviewChat"
                                checked={currentTheme.showAIReviewChat ?? true}
                                onCheckedChange={(c) => handleToggle('showAIReviewChat', c)}
                            />
                        </div>
                    </CardContent>
                </Card>



                {/* Knowledge Base Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Knowledge Base
                        </CardTitle>
                        <CardDescription>
                            Upload curriculum documents (PDF/Word) for the AI to learn from.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="knowledge-upload">Upload Document</Label>
                            <Input
                                id="knowledge-upload"
                                type="file"
                                accept=".pdf,.docx,.doc"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </div>

                        {uploading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Processing document...</span>
                            </div>
                        )}

                        <div className="mt-4 rounded-md bg-muted p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Knowledge Context
                                </h4>
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {(currentTheme.aiKnowledgeContext || '').length.toLocaleString()} characters
                                </span>
                            </div>

                            {isEditingKnowledge ? (
                                <div className="space-y-3">
                                    <Textarea
                                        value={editedKnowledge}
                                        onChange={(e) => setEditedKnowledge(e.target.value)}
                                        className="min-h-[200px] font-mono text-xs"
                                        placeholder="Enter knowledge base text here..."
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleSaveKnowledgeEdit}
                                            disabled={uploading}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsEditingKnowledge(false)}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : currentTheme.aiKnowledgeContext ? (
                                <>
                                    <div className="rounded border bg-background p-3 max-h-[200px] overflow-y-auto">
                                        <p className="whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed">
                                            {currentTheme.aiKnowledgeContext.substring(0, 500)}
                                            {currentTheme.aiKnowledgeContext.length > 500 && '...'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditedKnowledge(currentTheme.aiKnowledgeContext || '');
                                                setIsEditingKnowledge(true);
                                            }}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Context
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to clear the entire knowledge base? This cannot be undone.')) {
                                                    updateSettings({ aiKnowledgeContext: '' } as UpdateThemeDto);
                                                    setCurrentTheme({ ...currentTheme, aiKnowledgeContext: '' });
                                                }
                                            }}
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">
                                    No knowledge base content uploaded yet. Upload a PDF or Word document above.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
