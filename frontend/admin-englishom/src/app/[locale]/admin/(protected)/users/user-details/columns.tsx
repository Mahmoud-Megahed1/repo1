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
    accessorKey: 'daysLeft',
    header: 'Days Left',
    cell: ({ row }) => {
      const daysLeft = row.original.daysLeft ?? 0;
      const isExpired = row.original.isExpired;
      if (isExpired) {
        return <span className="text-red-500 font-semibold">Expired</span>;
      }
      return (
        <span className={daysLeft <= 7 ? 'text-yellow-500 font-semibold' : 'text-green-500 font-semibold'}>
          {daysLeft} days
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <TerminateCourseButton course={row.original} />
        <DeleteCourseButton course={row.original} />
      </div>
    ),
  },
];

export type Course = {
  levelName: LevelId;
  currentDay: number;
  isCompleted: boolean;
  userId: string;
  daysLeft?: number;
  isExpired?: boolean;
  purchaseDate?: string;
  expiresAt?: string;
};

import { Button } from '@/components/ui/button';
import { Trash2, XCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserCourse, terminateUserCourse } from '@/services/admins';
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

const TerminateCourseButton = ({ course }: { course: Course }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => terminateUserCourse(course.userId),
    onSuccess: (res) => {
      setOpen(false);
      toast.success(`Course ${res.data.terminatedCourse} terminated successfully`);
      queryClient.invalidateQueries({ queryKey: ['userDetails', course.userId] });
    },
    onError: (error: any) => {
      toast.error('Failed to terminate course', {
        description: error.response?.data?.message || 'Unknown error',
      });
    },
  });

  // Only show for non-expired active courses
  if (course.isExpired) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" title="Terminate Course">
          <XCircle size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminate Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to terminate <b>{LEVELS_LABELS[course.levelName]}</b> for this user?
            <br /><br />
            This will <b>end their active subscription</b> immediately and allow them to purchase a new course.
            The user's progress will be preserved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? 'Terminating...' : 'Terminate Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" title="Delete Course">
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
