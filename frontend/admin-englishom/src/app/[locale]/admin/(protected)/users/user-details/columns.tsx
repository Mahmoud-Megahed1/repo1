import { LEVELS_LABELS } from '@/constants';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const coursesColumns: ColumnDef<Course>[] = [
  {
    id: 'id',
    header: 'ID',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'levelName',
    header: 'Course',
    cell: ({ getValue }) => LEVELS_LABELS[getValue() as LevelId],
    enableSorting: false,
  },
  {
    accessorKey: 'isCompleted',
    header: 'Completed',
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-green-500">Yes</span>
      ) : (
        <span className="text-red-500">No</span>
      ),
    enableSorting: false,
  },
  {
    accessorKey: 'currentDay',
    header: 'Current Day',
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DeleteCourseButton course={row.original} />,
  },
];

type Course = {
  levelName: LevelId;
  currentDay: number;
  isCompleted: boolean;
  userId: string;
};

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserCourse } from '@/services/admins';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const DeleteCourseButton = ({ course }: { course: Course }) => {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUserCourse(course.userId, course.levelName),
    onSuccess: () => {
      setOpen(false);
      toast.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['userDetails', course.userId] });
    },
    onError: (error: any) => {
      toast.error('Failed to delete course', {
        description: error.response?.data?.message || 'Unknown error',
      });
    },
  });

  const handleDelete = () => {
    if (confirmText === 'DELETE') {
      mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{LEVELS_LABELS[course.levelName]}</b> for this user?
            <br />
            This action is massive and <b>IRREVERSIBLE</b>. It will delete:
            <ul className="list-disc pl-5 mt-2">
              <li>Active Orders (Payments)</li>
              <li>Learning Records (Progress, Tasks)</li>
              <li>Certificates</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">Type <b>DELETE</b> to confirm.</p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isPending}
          >
            {isPending ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const dummyCoursesData: Course[] = [
  {
    levelName: 'LEVEL_A1',
    currentDay: 1,
    isCompleted: true,
    userId: 'dummy',
  },
  {
    levelName: 'LEVEL_A2',
    currentDay: 3,
    isCompleted: false,
    userId: 'dummy',
  },
  {
    levelName: 'LEVEL_B1',
    currentDay: 5,
    isCompleted: true,
    userId: 'dummy',
  },
  {
    levelName: 'LEVEL_B2',
    currentDay: 6,
    isCompleted: false,
    userId: 'dummy',
  },
];
