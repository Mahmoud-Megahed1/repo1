import { LEVELS_LABELS } from '@/constants';
import { Label } from '@/components/ui/label';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const coursesColumns: ColumnDef<Course>[] = [
  {
    id: 'id',
    header: 'رقم التعريف',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'levelName',
    header: 'الدورة',
    cell: ({ getValue }) => LEVELS_LABELS[getValue() as LevelId],
    enableSorting: false,
  },
  {
    accessorKey: 'isCompleted',
    header: 'مكتمل',
    cell: ({ getValue }) => (
      <span
        className={
          getValue()
            ? 'font-bold text-green-500'
            : 'font-bold text-destructive'
        }
      >
        {getValue() ? 'نعم' : 'لا'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'currentDay',
    header: 'اليوم الحالي',
    cell: ({ getValue }) => getValue() || 0,
    enableSorting: false,
  },
  {
    accessorKey: 'daysLeft',
    header: 'الأيام المتبقية',
    cell: ({ row }) => {
      if (row.original.isCompleted) return 'مكتمل';
      if (row.original.isExpired)
        return <span className="font-bold text-destructive">منتهي</span>;
      return <span className="font-bold text-green-500">{row.original.daysLeft}</span>;
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'الإجراءات',
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
      toast.success(`تم إنهاء الدورة ${res.data.terminatedCourse} بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['userDetails', course.userId] });
    },
    onError: (error: any) => {
      toast.error('فشل في إنهاء الدورة', {
        description: error.response?.data?.message || 'خطأ غير معروف',
      });
    },
  });

  // Only show for non-expired active courses
  if (course.isExpired) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" title="إنهاء الدورة">
          <XCircle size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنهاء الدورة</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد إنهاء الدورة <b>{LEVELS_LABELS[course.levelName]}</b> لهذا المستخدم؟
            <br /><br />
            سيؤدي هذا إلى <b>إنهاء اشتراكه النشط</b> على الفور والسماح له بشراء دورة جديدة.
            سيتم الاحتفاظ بتقدم المستخدم.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? 'جاري الإنهاء...' : 'إنهاء الدورة'}
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
      toast.success('تم حذف الدورة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['userDetails', course.userId] });
    },
    onError: (error: any) => {
      toast.error('فشل في حذف الدورة', {
        description: error.response?.data?.message || 'خطأ غير معروف',
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
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" title="حذف الدورة">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف الدورة</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد حذف الدورة <b>{LEVELS_LABELS[course.levelName]}</b> لهذا المستخدم؟
            <br />
            <span className="text-destructive font-bold mt-2 inline-block">
              تحذير: سيتم حذف جميع بيانات الدورة، والتقدم، والنتائج نهائياً. لا يمكن التراجع عن هذا الإجراء!
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 my-4">
          <Label htmlFor="confirmText" className="text-sm font-medium">
            اكتب <b>DELETE</b> للتأكيد
          </Label>
          <Input
            id="confirmText"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isPending}
          >
            {isPending ? 'جاري الحذف...' : 'حذف الدورة'}
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
