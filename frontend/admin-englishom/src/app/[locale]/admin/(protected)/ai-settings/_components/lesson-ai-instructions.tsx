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
import { getLesson, updateLessonMetadata, getAllLessonInstructions } from '@/services/lessons';
import { LessonsId } from '@/types/global.types';
import { LessonParams } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2, Edit } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function LessonAIInstructions() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>(LEVELS_ID[0]);
  const [selectedDay, setSelectedDay] = useState<string>('1');
  const [selectedLessonType, setSelectedLessonType] = useState<LessonsId>(
    LESSONS_LINKS[0].id,
  );
  const [instructions, setInstructions] = useState<string>('');
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);

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
      queryClient.invalidateQueries({ queryKey: ['all-instructions'] });
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
    <div className="space-y-8" ref={formRef}>
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

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving || isLoading}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Instructions'}
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={isSaving || isLoading || !instructions}
                onClick={() => {
                  setInstructions('');
                  saveInstructions('');
                }}
              >
                Delete Instructions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <InstructionsList
        onEdit={(level, day, lesson) => {
          setSelectedLevel(level as LevelId);
          setSelectedDay(day);
          setSelectedLessonType(lesson as LessonsId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

function InstructionsList({ onEdit }: { onEdit: (level: string, day: string, lesson: string) => void }) {
  const { data: allInstructions, isLoading } = useQuery({
    queryKey: ['all-instructions'],
    queryFn: getAllLessonInstructions,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteInstruction } = useMutation({
    mutationFn: (params: { level_name: string, day: string, lesson_name: string }) =>
      updateLessonMetadata({ ...params, lesson_name: params.lesson_name as LessonsId, aiInstructions: '' }),
    onSuccess: () => {
      toast.success('Instruction deleted');
      queryClient.invalidateQueries({ queryKey: ['all-instructions'] });
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
    },
    onError: () => toast.error('Failed to delete')
  });

  if (isLoading) return <div className="p-4 text-center">Loading instructions list...</div>;

  const list = allInstructions?.data || [];

  if (list.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Saved Instructions</CardTitle></CardHeader>
        <CardContent className="text-muted-foreground">No instructions found.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Saved Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead className="w-[400px]">Preview</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.level}</TableCell>
                <TableCell>Day {item.day}</TableCell>
                <TableCell>{item.lessonType}</TableCell>
                <TableCell className="truncate max-w-[400px]" title={item.instructions}>
                  {item.instructions.substring(0, 100)}...
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item.level, item.day, item.lessonType)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this instruction?')) {
                        deleteInstruction({ level_name: item.level, day: item.day, lesson_name: item.lessonType });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
