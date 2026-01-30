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
import { PictureLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  picture: PictureLesson;
  levelId: LevelId;
  day: string;
};

const PictureItem: FC<Props> = ({
  picture: { definition, examples, pictureSrc, soundSrc, wordAr, wordEn, id },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'PICTURES',
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
      <div className="mb-4 flex h-64 w-full items-center justify-center rounded-md bg-muted/20">
        <img
          src={pictureSrc}
          alt={wordEn}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="mb-2 text-xl font-semibold">{wordEn}</h3>
        <p className="mb-2 font-cairo text-lg">{wordAr}</p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Definition:</span> {definition}
        </p>
        <div className="mt-2">
          <span className="font-bold">Examples:</span>
          <ul className="mt-2 list-inside list-disc ps-4 text-sm">
            {examples.map((example, idx) => (
              <li key={idx}>{example}</li>
            ))}
          </ul>
        </div>
      </div>
      <audio
        controls
        src={soundSrc}
        controlsList="nodownload"
        className="mt-4 w-full"
      >
        <track
          kind="captions"
          src={wordEn}
          srcLang="en"
          label="English captions"
        />
      </audio>
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

export const PictureItemSkeleton = () => {
  return (
    <li className="flex h-[600px] flex-col rounded-lg bg-secondary p-4">
      <Skeleton className="mb-4 h-64 w-full rounded-md bg-muted-foreground/20" />
      <div className="flex flex-col space-y-2">
        <div className="h-6 w-3/4 bg-muted-foreground/20" />
        <div className="h-4 w-1/2 bg-muted-foreground/20" />
        <div className="h-8 w-full bg-muted-foreground/20" />
      </div>
      <Skeleton className="mt-auto h-12 w-full rounded-full bg-muted-foreground/20" />
    </li>
  );
};

export default PictureItem;
