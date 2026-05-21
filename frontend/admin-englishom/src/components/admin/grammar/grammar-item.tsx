import RichTextViewer from '@/components/shared/rich-text-viewer';
import DeleteButton from '@/components/shared/delete-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { GrammarLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useLocale, useTranslations } from 'next-intl';
import { FC } from 'react';

type Props = {
  grammar: GrammarLesson;
  levelId: LevelId;
  day: string;
};

const GrammarItem: FC<Props> = ({
  grammar: {
    definitionAr,
    definitionEn,
    examples,
    words,
    nameAr,
    nameEn,
    useCases,
    id,
    notes,
  },
  day,
  levelId,
}) => {
  const locale = useLocale() as 'en' | 'ar';
  const tGlobal = useTranslations('Global');
  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId,
    lessonName: 'GRAMMAR',
    onSuccess: () => {
      setOpen(false);
    },
  });
  const definition = locale === 'ar' ? definitionAr : definitionEn;
  return (
    <div className="mx-auto flex max-w-md flex-col rounded-lg border border-border bg-secondary p-6 shadow-md">
      <h3 className="mb-2 text-xl font-bold text-foreground">
        {nameEn} - <span className="font-cairo">{nameAr}</span>
      </h3>
      <p lang="en" className="mb-4 text-muted-foreground">
        {definition}
      </p>
      <section className="mb-4">
        <h4 className="text-lg font-semibold text-foreground">Use Cases</h4>
        <ul lang="en" className="mb-4 ml-5 list-disc text-foreground">
          {Array.isArray(useCases?.[locale]) &&
            useCases[locale].map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
        </ul>
      </section>
      <div className="space-y-4">
        <section>
          <h4 className="text-lg font-semibold text-foreground">
            {tGlobal('words')}
          </h4>
          <ul className="ml-6 list-decimal text-foreground">
            {Array.isArray(words) &&
              words.map((word, index) => <li key={index}>{word}</li>)}
          </ul>
        </section>
        <section>
          <h4 className="text-lg font-semibold text-foreground">
            {tGlobal('examples')}
          </h4>
          <ul lang="en" className="ml-6 list-decimal text-foreground">
            {Array.isArray(examples) &&
              examples.map((example, index) => <li key={index}>{example}</li>)}
          </ul>
        </section>
        {notes && (
          <section>
            <h4 className="text-lg font-semibold text-foreground">Notes</h4>
            <RichTextViewer className="mt-2 rounded-md bg-card p-2">
              {notes}
            </RichTextViewer>
          </section>
        )}
      </div>
      <DeleteButton onDelete={() => mutate()} isPending={isPending} />
    </div>
  );
};

export const GrammarItemSkeleton = () => {
  return (
    <div className="mx-auto w-[400px] max-w-md rounded-lg border border-border bg-secondary p-6 shadow-md">
      <div className="mb-4">
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </div>
      <div className="mb-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default GrammarItem;
