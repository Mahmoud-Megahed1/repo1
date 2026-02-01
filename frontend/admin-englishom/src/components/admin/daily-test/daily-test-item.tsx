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
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { DailyTestLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC, useState } from 'react';

type Props = {
  dailyTest: DailyTestLesson;
  levelId: LevelId;
  day: string;
};

const DailyTestItem: FC<Props> = ({
  dailyTest: { answers, question, type, id },
  day,
  levelId,
}) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    lessonName: 'DAILY_TEST',
    levelId,
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <div className="flex flex-col rounded-lg border border-border bg-secondary p-6 shadow-md">
      {type === 'text' && <h4 className="text-lg font-bold">{question}</h4>}
      {type === 'image' && (
        <img src={question} alt="" className="mb-4 w-full" />
      )}
      {type === 'audio' && (
        <audio
          crossOrigin="anonymous"
          controls
          src={question}
          controlsList="nodownload"
          className="w-full max-w-2xl"
        >
          <track
            kind="captions"
            src={question}
            srcLang="en"
            label="English captions"
            default
          />
        </audio>
      )}
      <ul className="mb-4 ml-5 list-disc text-foreground">
        {answers.map((answer, index) => (
          <li key={index} className={answer.isCorrect ? 'text-green-500' : ''}>
            {answer.text}
          </li>
        ))}
      </ul>
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
              grammar lesson.
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

export const DailyTestItemSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col rounded-lg border border-border bg-secondary p-6 shadow-md">
      <div className="mb-2 h-6 w-1/3 rounded bg-muted-foreground"></div>
      <div className="mb-4 h-4 w-2/3 rounded bg-muted-foreground"></div>
      <ul className="mb-4 ml-5 space-y-2">
        <li className="h-4 w-1/2 rounded bg-muted-foreground"></li>
        <li className="h-4 w-2/3 rounded bg-muted-foreground"></li>
        <li className="h-4 w-1/3 rounded bg-muted-foreground"></li>
      </ul>
      <div className="ms-auto mt-4 h-8 w-20 rounded bg-muted-foreground"></div>
    </div>
  );
};
export default DailyTestItem;
