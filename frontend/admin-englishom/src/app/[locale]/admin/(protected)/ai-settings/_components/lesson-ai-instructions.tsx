'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LESSONS_LINKS, LEVELS_ID } from '@/constants';
import { getLesson, updateLessonMetadata } from '@/services/lessons';
import { LessonsId } from '@/types/global.types';
import { LessonParams } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LessonAIInstructions() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>(LEVELS_ID[0]);
  const [selectedDay, setSelectedDay] = useState<string>('1');
  const [selectedLessonType, setSelectedLessonType] = useState<LessonsId>(
    LESSONS_LINKS[0].id,
  );
  const [instructions, setInstructions] = useState<string>('');
  const queryClient = useQueryClient();

  const lessonParams: LessonParams = {
    level_name: selectedLevel,
    day: selectedDay,
    lesson_name: selectedLessonType,
  };

  // Fetch existing lesson data
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lesson', lessonParams],
    queryFn: () => getLesson<{ aiInstructions?: string }>(lessonParams),
  });

  // Update local state when data is fetched
  useEffect(() => {
    // The API returns { data: [{...}] } inside the axios response.
    // So access path is lessonData.data.data
    if (lessonData?.data?.data && lessonData.data.data.length > 0) {
      // The API returns an array, we take the first item
      // @ts-ignore
      setInstructions(lessonData.data.data[0]?.aiInstructions || '');
    } else {
      setInstructions('');
    }
  }, [lessonData]);

  // Mutation to save instructions
  const { mutate: saveInstructions, isPending: isSaving } = useMutation({
    mutationFn: (newInstructions: string) =>
      updateLessonMetadata({
        ...lessonParams,
        aiInstructions: newInstructions,
      }),
    onSuccess: () => {
      toast.success('AI Instructions saved successfully');
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonParams] });
    },
    onError: () => {
      toast.error('Failed to save instructions');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveInstructions(instructions);
  };

  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson AI Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={selectedLevel}
                onValueChange={(val) => setSelectedLevel(val as LevelId)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS_ID.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      Day {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lesson Type</Label>
              <Select
                value={selectedLessonType}
                onValueChange={(val) => setSelectedLessonType(val as LessonsId)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Lesson Type" />
                </SelectTrigger>
                <SelectContent>
                  {LESSONS_LINKS.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>AI Instructions</Label>
            <div className="relative">
              <Textarea
                placeholder="Enter specific instructions for the AI reviewer (e.g., 'Focus on pronunciation', 'Roleplay as a doctor')."
                className="min-h-[200px] resize-y"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              These instructions will be injected into the AI system prompt when
              the user reviews this specific lesson.
            </p>
          </div>

          <Button type="submit" disabled={isSaving || isLoading}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Instructions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
