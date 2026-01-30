import EarSound from '@/components/shared/ear-sound';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { QuestionAnswerLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  questionAnswer: QuestionAnswerLesson;
  levelId: LevelId;
  day: string;
};

const QuestionAnswerItem: FC<Props> = ({
  questionAnswer: { answer, question, answerSrc, questionSrc, id },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'Q_A',
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-border bg-secondary p-6 shadow-md',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-lg font-semibold leading-none text-foreground">
            Question:
          </h3>
          <EarSound className="[&_svg]:size-4" soundSrc={questionSrc} />
        </div>
        <p className="text-muted-foreground">{question}</p>
      </div>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-lg font-semibold leading-none text-foreground">
            Answer:
          </h3>
          <EarSound className="[&_svg]:size-4" soundSrc={answerSrc} />
        </div>
        <p className="text-muted-foreground">{answer}</p>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="ms-auto mt-4 w-fit"
            size="sm"
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              Q&A item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none">
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setOpen(false);
                mutate();
              }}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
};

export const QuestionAnswerItemSkeleton = () => {
  return (
    <li className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-md">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="mt-4 h-12 w-full rounded-full" />
    </li>
  );
};

export default QuestionAnswerItem;
