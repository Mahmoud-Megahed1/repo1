import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '@lib/axios-client';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { toast } from 'sonner';
import { Loader2, Save, BookOpen } from 'lucide-react';
import { LEVEL_IDS, LESSONS_IDS } from '@shared/constants';
import { getLesson } from '@modules/lessons/services';
import type { LessonId, LevelId } from '@shared/types/entities';

export default function LessonAIInstructions() {
    const { t } = useTranslation();
    const [level, setLevel] = useState<LevelId>('LEVEL_A1');
    const [day, setDay] = useState<string>('1');
    const [lessonType, setLessonType] = useState<LessonId>('READ');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchInstructions();
    }, [level, day, lessonType]);

    const fetchInstructions = async () => {
        setLoading(true);
        try {
            // Fetch the lesson content
            // getLesson expects LessonParams: { lesson_name, level_name, day }
            const res = await getLesson<any>({
                level_name: level,
                day: day,
                lesson_name: lessonType
            });

            // The response data structure from getLesson is { data: T[] } or similar depending on service
            // But wait, getLesson return type in service is: axiosClient.get<{ data: T[] }>
            // And controller returns: { data: any[] } OR if it's new JsonFile structure it returns the file content?
            // "getContentByName" returns "jsonData?.data ? jsonData : { data: [] }"
            // So if jsonData has aiInstructions, it will be at the root of the response.data object (which is the jsonData).
            // Actually request returns Res.data which IS the jsonData.

            // Let's check the service again.
            // export const getLesson = ... return axiosClient.get<{ data: T[] }> ...
            // If the backend returns { data: [...], aiInstructions: "..." }, then typescript might complain if I don't cast.

            const data = res.data as any;
            setInstructions(data.aiInstructions || '');
        } catch (error) {
            console.error("Failed to fetch lesson", error);
            // It's possible the lesson file doesn't exist yet
            setInstructions('');
            // Optional: toast.error if we want to be noisy, but for admin maybe just clear it is fine.
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!level || !day || !lessonType) return;

        setSaving(true);
        try {
            await axiosClient.post('/files/metadata', {
                level_name: level,
                day: day,
                lesson_name: lessonType,
                aiInstructions: instructions
            });
            toast.success(t('Admin.success.saved', 'Instructions saved successfully'));
        } catch (error) {
            console.error("Failed to save instructions", error);
            toast.error(t('Admin.errors.saveFailed', 'Failed to save instructions'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label>Level</Label>
                    <Select value={level} onValueChange={(v) => setLevel(v as LevelId)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LEVEL_IDS.map((l) => (
                                <SelectItem key={l} value={l}>{l.replace('LEVEL_', '')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Day</Label>
                    <Input
                        type="number"
                        min="1"
                        max="50"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Lesson Type</Label>
                    <Select value={lessonType} onValueChange={(v) => setLessonType(v as LessonId)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LESSONS_IDS.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    AI Instructions
                </Label>
                <div className="relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : null}
                    <Textarea
                        placeholder="Enter specific instructions for the AI regarding this lesson (e.g., 'Focus on pronunciation of 'th' sounds', 'Explain grammar rule X in detail')..."
                        className="min-h-[200px]"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    These instructions will be appended to the system prompt when the student uses the AI features for this specific lesson.
                </p>
            </div>

            <Button onClick={handleSave} disabled={saving || loading} className="w-full md:w-auto">
                {saving ? (
                    <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 w-4 h-4" />
                        Save Instructions
                    </>
                )}
            </Button>
        </div>
    );
}
