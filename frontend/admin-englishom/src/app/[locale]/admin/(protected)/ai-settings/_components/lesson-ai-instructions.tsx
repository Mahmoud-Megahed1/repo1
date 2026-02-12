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
  const [instructionsList, setInstructionsList] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
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
    if (lessonData?.data) {
      // First try to find instructions in the first item of the data array
      // Then try the root property aiInstructions (which backend sets)
      const rootInstructions = (lessonData.data as any).aiInstructions;
      const itemInstructions = lessonData.data.data?.[0]?.aiInstructions;

      // Parse instructions string into array (split by newlines and filter empty)
      const rawText = itemInstructions || rootInstructions || '';
      const list = rawText.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      setInstructionsList(list);
    } else {
      setInstructionsList([]);
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

  const handleAdd = () => {
    if (!newInstruction.trim()) return;
    const updated = [...instructionsList, newInstruction.trim()];
    setInstructionsList(updated);
    setNewInstruction('');
    saveInstructions(updated.join('\n'));
  };

  const handleDelete = (index: number) => {
    const updated = instructionsList.filter((_, i) => i !== index);
    setInstructionsList(updated);
    saveInstructions(updated.join('\n'));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(instructionsList[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...instructionsList];
    updated[editingIndex] = editValue.trim();
    setInstructionsList(updated);
    setEditingIndex(null);
    setEditValue('');
    saveInstructions(updated.join('\n'));
  };

  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-8" ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>Lesson AI Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

            <div className="space-y-4">
              <Label>Instructions List</Label>

              {/* Add New Instruction */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a new instruction (e.g. 'Focus on pronunciation')"
                  className="min-h-[80px]"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                />
                <Button
                  onClick={handleAdd}
                  disabled={isSaving || !newInstruction.trim()}
                  className="h-auto"
                >
                  Add
                </Button>
              </div>

              {/* List of Instructions */}
              <div className="space-y-3 mt-4">
                {instructionsList.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 group">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary mt-0.5">
                      {idx + 1}
                    </span>

                    {editingIndex === idx ? (
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex flex-col gap-2">
                          <Button size="sm" onClick={saveEdit}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap pt-0.5">{inst}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(idx)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {instructionsList.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 italic border rounded-lg border-dashed">
                    No specific instructions yet. Add one above.
                  </p>
                )}
              </div>

              {isSaving && (
                <div className="flex items-center justify-end text-xs text-muted-foreground animate-pulse">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Saving changes...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <InstructionsList
        onEdit={(level, day, lesson) => {
          setSelectedLevel(level as LevelId);
          setSelectedDay(day);

          const matchingLesson = LESSONS_LINKS.find(
            (l) => l.id.toLowerCase() === lesson.toLowerCase()
          );
          if (matchingLesson) {
            setSelectedLessonType(matchingLesson.id);
          }

          formRef.current?.scrollIntoView({ behavior: 'smooth' });
          toast.info('Instruction loaded. Make changes above and click Save.');
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
      updateLessonMetadata({ ...params, level_name: params.level_name as LevelId, lesson_name: params.lesson_name as LessonsId, aiInstructions: '' }),
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
                <TableCell className="max-w-[400px]" title={item.instructions}>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs text-muted-foreground">
                      {item.instructions.split('\n').filter(s => s.trim()).length} items
                    </span>
                    <span className="truncate text-sm">
                      {item.instructions.split('\n')[0]}
                    </span>
                  </div>
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
