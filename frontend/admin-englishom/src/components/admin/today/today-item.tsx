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
import AudioPlayer from '@/components/ui/audio-player';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { TodayLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  today: TodayLesson;
  levelId: LevelId;
  day: string;
};

const TodayItem: FC<Props> = ({
  today: { id, description, instructions, sentences, title, soundSrc },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'TODAY',
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <Card
      lang="ar"
      className={cn({
        'animate-pulse duration-700': isPending,
      })}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <b className="mb-2 text-lg">التعليمات:</b>
          <ul className="list-inside list-disc pl-4">
            {instructions.map(({ definition, word }, i) => (
              <li key={i}>
                <b className="me-2">{word}:</b> {definition}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <b className="mb-2">الجمل:</b>
          <ul lang="en" className="list-inside list-disc pl-4">
            {sentences.map((sentence, i) => (
              <li key={i}>{sentence}</li>
            ))}
          </ul>
        </div>
        <AudioPlayer className="mt-4" src={soundSrc} />
      </CardContent>
      <CardFooter lang="en">
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
      </CardFooter>
    </Card>
  );
};

export const TodayItemSkeleton = () => (
  <li className="flex flex-col gap-2 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4 rounded-lg bg-muted-foreground/20" />

      <Skeleton className="h-4 w-full rounded-lg bg-muted-foreground/20" />

      <Skeleton className="h-8 w-full rounded-lg bg-muted-foreground/20" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2 rounded-lg bg-muted-foreground/20" />
        <Skeleton className="h-4 w-3/4 rounded-lg bg-muted-foreground/20" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg bg-muted-foreground/20" />
        <Skeleton className="h-4 w-5/6 rounded-lg bg-muted-foreground/20" />
        <Skeleton className="h-4 w-4/5 rounded-lg bg-muted-foreground/20" />
      </div>
    </div>

    {/* Delete Button Skeleton */}
    <Skeleton className="ml-auto mt-auto h-8 w-20 rounded-full bg-muted-foreground/20" />
  </li>
);

export default TodayItem;
