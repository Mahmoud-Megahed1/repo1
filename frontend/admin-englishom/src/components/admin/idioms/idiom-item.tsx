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
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { IdiomLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useLocale, useTranslations } from 'next-intl';
import { FC, useState } from 'react';

type Props = {
  idiom: IdiomLesson;
  levelId: LevelId;
  day: string;
};
const IdiomItem: FC<Props> = ({
  idiom: { id, examples, definitionAr, definitionEn, useCases },
  day,
  levelId,
}) => {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('Global');
  const definition = locale === 'ar' ? definitionAr : definitionEn;
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'IDIOMS',
    onSuccess() {
      setOpen(false);
    },
  });
  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      <h3 className="mx-auto mb-2 mt-4 rounded-lg bg-muted-foreground/10 p-4 text-xl font-semibold">
        {t('definition')}: {definition}
      </h3>
      <b>{t('useCases')}:</b>
      <ul className="mb-4 list-inside list-disc text-foreground">
        {useCases[locale].map((useCase, index) => (
          <li key={index}>{useCase}</li>
        ))}
      </ul>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <div
            key={index}
            className="flex flex-col rounded-md bg-muted-foreground/10"
          >
            {example.pictureSrc && (
              <img
                src={example.pictureSrc}
                alt={example.sentence}
                className="h-auto w-full rounded-md"
              />
            )}
            <article className="flex flex-1 flex-col gap-2 p-4">
              <p lang="en" className="break-words text-md">
                <b>Example (En):</b> {example.exampleEn}
              </p>
              <p className="font-cairo text-md">
                <b>Example (Ar):</b> {example.exampleAr}
              </p>
              <p lang="en" className="mb-8">
                <b>Sentence:</b> {example.sentence}
              </p>
              <AudioPlayer src={example.soundSrc} className="mt-auto" />
            </article>
          </div>
        ))}
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

export const IdiomSkeleton = () => (
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

export default IdiomItem;
