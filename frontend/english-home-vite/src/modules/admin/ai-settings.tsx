import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '@lib/axios-client';
import { Checkbox } from '@ui/checkbox';
import { Label } from '@ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Input } from '@ui/input';
import { toast } from 'sonner';
import { Loader2, MessageSquare, FileText, Settings, BookOpen, Bot } from 'lucide-react';
import LessonAIInstructions from './components/lesson-ai-instructions';

export default function AdminAISettings() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [themeId, setThemeId] = useState<string>('');
    const [settings, setSettings] = useState({
        showSupportChat: true,
        showAIReviewChat: true,
        aiKnowledgeContext: ''
    });
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'global' | 'lessons'>('global');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Fetch current theme
            const res = await axiosClient.get('/themes/current');
            if (res.data) {
                setThemeId(res.data._id);
                setSettings({
                    showSupportChat: res.data.showSupportChat ?? true,
                    showAIReviewChat: res.data.showAIReviewChat ?? true,
                    aiKnowledgeContext: res.data.aiKnowledgeContext || ''
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast.error(t('Admin.errors.fetchFailed', 'Failed to load settings'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key: 'showSupportChat' | 'showAIReviewChat', checked: boolean) => {
        if (!themeId) return;

        const newSettings = { ...settings, [key]: checked };
        setSettings(newSettings); // Optimistic update

        try {
            await axiosClient.patch(`/themes/${themeId}`, {
                [key]: checked
            });
            toast.success(t('Admin.success.updated', 'Settings updated successfully'));
        } catch (error) {
            console.error("Failed to update settings", error);
            setSettings(settings); // Revert
            toast.error(t('Admin.errors.updateFailed', 'Failed to update settings'));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !themeId) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axiosClient.post(`/themes/${themeId}/upload-knowledge`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Assuming response returns updated theme
            if (res.data && res.data.aiKnowledgeContext) {
                setSettings(prev => ({ ...prev, aiKnowledgeContext: res.data.aiKnowledgeContext }));
            }
            toast.success(t('Admin.success.upload', 'Knowledge base updated successfully'));
            // Reset input
            e.target.value = '';
        } catch (error) {
            console.error("Upload failed", error);
            toast.error(t('Admin.errors.uploadFailed', 'Failed to upload document'));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <Bot className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">{t('Admin.aiSettings.title', 'AI Assistant Settings')}</h1>
            </div>

            <div className="w-full">
                <div className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'global' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                    >
                        <Settings className="w-4 h-4" />
                        Global Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('lessons')}
                        className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'lessons' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Lesson Instructions
                    </button>
                </div>

                {activeTab === 'global' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Chat Visibility Controls */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        {t('Admin.aiSettings.visibility', 'Chat Visibility')}
                                    </CardTitle>
                                    <CardDescription>
                                        Control which AI features are visible to students.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="showSupportChat"
                                            checked={settings.showSupportChat}
                                            onCheckedChange={(c) => handleToggle('showSupportChat', c as boolean)}
                                        />
                                        <Label htmlFor="showSupportChat" className="cursor-pointer">
                                            {t('Admin.aiSettings.showSupport', 'Enable Global Support Chat')}
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="showAIReviewChat"
                                            checked={settings.showAIReviewChat}
                                            onCheckedChange={(c) => handleToggle('showAIReviewChat', c as boolean)}
                                        />
                                        <Label htmlFor="showAIReviewChat" className="cursor-pointer">
                                            {t('Admin.aiSettings.showReview', 'Enable Lesson Review AI')}
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Knowledge Base Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        {t('Admin.aiSettings.knowledge', 'Knowledge Base')}
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
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{t('Admin.aiSettings.uploading', 'Processing document...')}</span>
                                        </div>
                                    )}

                                    <div className="bg-muted p-4 rounded-md mt-4">
                                        <h4 className="font-semibold text-sm mb-2">Current Knowledge Context Size:</h4>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {settings.aiKnowledgeContext.length} characters
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'lessons' && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson-Specific Instructions</CardTitle>
                                <CardDescription>
                                    Configure custom instructions for the AI for specific lessons. These instructions will guide the AI's behavior when interacting with students during these lessons.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LessonAIInstructions />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
