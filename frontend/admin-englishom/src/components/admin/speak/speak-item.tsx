import EarSound from '@/components/shared/ear-sound';
import DeleteButton from '@/components/shared/delete-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { SpeakLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC } from 'react';

type Props = {
  speak: SpeakLesson;
  levelId: LevelId;
  day: string;
};

const SpeakItem: FC<Props> = ({ speak: { id, sentences }, day, levelId }) => {
  const { mutate, isPending } = useDeleteLesson({
    day,
    levelId,
    lessonName: 'SPEAK',
    id,
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
      <ul lang="en" className="space-y-6">
        {sentences.map(({ sentence, soundSrc }, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <EarSound className="[&_svg]:size-4" soundSrc={soundSrc} />
            <p>{sentence}</p>
          </li>
        ))}
      </ul>
      <DeleteButton onDelete={() => mutate()} isPending={isPending} />
    </li>
  );
};

export const SpeakItemSkeleton = () => (
  <li className="flex h-40 flex-col rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
      <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
    </div>
    <Skeleton className="mt-auto h-12 w-full rounded-full bg-muted-foreground/20" />
  </li>
);

export default SpeakItem;
