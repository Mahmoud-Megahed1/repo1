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
import { WriteLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  write: WriteLesson;
  levelId: LevelId;
  day: string;
};

const WriteItem: FC<Props> = ({ write: { id, sentences }, day, levelId }) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteLesson({
    day,
    levelId,
    lessonName: 'WRITE',
    id,
    onSuccess() {
      setOpen(false);
    },
  });

  // Function to render a sentence with input placeholders for preview
  const renderSentenceWithPlaceholders = (sentence: string) => {
    const parts = sentence.split(/({[^}]*})/g).filter(Boolean);

    return (
      <div className="flex flex-wrap items-center gap-2">
        {parts.map((part, index) =>
          part.match(/{[^}]*}/) ? (
            <span
              key={index}
              className="inline-block rounded bg-primary/20 px-2 py-1 text-primary"
            >
              {part.replace(/[{}]/g, '')}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </div>
    );
  };

  return (
    <li
      className={cn(
        'flex flex-col gap-2 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      <div className="space-y-3">
        {sentences.map((sentence, idx) => (
          <div key={idx} className="mb-2">
            {renderSentenceWithPlaceholders(sentence)}
          </div>
        ))}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="ms-auto mt-auto w-fit"
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
              write exercise and remove the data from the servers.
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

export const WriteItemSkeleton = () => (
  <li className="flex h-40 flex-col rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
    </div>
    <Skeleton className="mt-auto h-12 w-full rounded-full bg-muted-foreground/20" />
  </li>
);

export default WriteItem;
