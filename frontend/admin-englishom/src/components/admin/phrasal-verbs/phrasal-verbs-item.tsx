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
import { PhrasalVerbLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  phrasalVerb: PhrasalVerbLesson;
  levelId: LevelId;
  day: string;
};
const PhrasalVerbItem: FC<Props> = ({
  phrasalVerb: { id, exampleAr, exampleEn, pictureSrc, sentence, soundSrc },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    lessonName: 'PHRASAL_VERBS',
    levelId,
    onSuccess() {
      setOpen(false);
    },
  });
  return (
    <li
      className={cn(
        'flex flex-col gap-2 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      {pictureSrc && (
        <img
          src={pictureSrc}
          alt={sentence}
          className="mb-4 h-48 w-full rounded-md object-cover"
        />
      )}
      <div className="flex flex-col">
        <h3 className="mb-2 text-xl font-semibold">{sentence}</h3>
        <p lang="en" className="mb-2 break-words text-sm">
          Example (English): {exampleEn}
        </p>
        <p className="mb-2 font-cairo text-sm">Example (Arabic): {exampleAr}</p>
      </div>
      <audio
        controls
        src={soundSrc}
        controlsList="nodownload"
        className="mt-2 w-full"
      >
        <track
          kind="captions"
          src={sentence}
          srcLang="en"
          label="English captions"
        />
      </audio>

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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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

export const PhrasalVerbSkeleton = () => (
  <li className="flex flex-col rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
    <Skeleton className="mb-4 h-48 w-full rounded-md bg-muted-foreground/20" />
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-6 w-3/4 rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
    </div>
    <Skeleton className="mt-4 h-12 w-full rounded-full bg-muted-foreground/20" />
    <Skeleton className="ms-auto mt-4 h-8 w-24 rounded-full bg-muted-foreground/20" />
  </li>
);

export default PhrasalVerbItem;
