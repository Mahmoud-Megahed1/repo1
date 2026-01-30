import RichTextViewer from '@/components/shared/rich-text-viewer';
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
import { ReadLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';
type Props = {
  read: ReadLesson;
  levelId: LevelId;
  day: string;
};
const ReadItem: FC<Props> = ({
  read: { id, soundSrc, transcript },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'READ',
    onSuccess() {
      setOpen(false);
    },
  });
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-md flex-col gap-2 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      <RichTextViewer lang="en">{transcript}</RichTextViewer>
      <audio
        controls
        src={soundSrc}
        controlsList="nodownload"
        className="w-full"
      >
        <track
          kind="captions"
          src={transcript}
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
    </div>
  );
};

export const ReadItemSkeleton = () => (
  <div className="mx-auto flex h-60 w-full max-w-md flex-col rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
    </div>
    <Skeleton className="mt-auto h-12 w-full rounded-full bg-muted-foreground/20" />
  </div>
);

export default ReadItem;
