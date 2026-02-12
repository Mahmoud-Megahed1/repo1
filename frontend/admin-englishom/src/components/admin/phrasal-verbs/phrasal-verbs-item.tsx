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
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { PhrasalVerb } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: PhrasalVerb | any; // using any to handle potential backend mismatches during migration
  levelId: string;
  day: string;
};

const PhrasalVerbItem: FC<Props> = ({
  data: { id, examples, definitionAr, definitionEn, useCases },
  levelId,
  day,
}) => {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('Global');
  const definition = locale === 'ar' ? definitionAr : definitionEn;
  const [open, setOpen] = useState(false);
  // Default values to prevent crash if data is missing during migration
  const safeExamples = examples || [];
  const safeUseCases = useCases || { en: [], ar: [] };

  const { mutate, isPending } = useDeleteLesson({
    day,
    id,
    levelId: levelId as LevelId,
    lessonName: 'PHRASAL_VERBS',
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <li
      className={cn(
        'flex flex-col gap-6 rounded-xl bg-card border border-border/50 p-6 text-card-foreground shadow-lg transition-all hover:shadow-xl',
        {
          'animate-pulse duration-700': isPending,
        },
      )}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center bg-muted/30 rounded-lg p-5 border border-border/30">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('definition')}</span>
          <h3 className="text-2xl font-bold">
            {definition}
          </h3>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase ring-1 ring-primary/20">
            {definitionEn}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Use Cases (English)
          </h4>
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="p-4">
              <ul className="list-inside list-disc space-y-2">
                {safeUseCases.en?.map((useCase: string, index: number) => (
                  <li key={index} className="text-sm leading-relaxed text-muted-foreground">
                    {useCase}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold flex items-center justify-end gap-2">
            Use Cases (Arabic)
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </h4>
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="p-4">
              <ul className="list-inside list-disc space-y-2 text-right" dir="rtl">
                {safeUseCases.ar?.map((useCase: string, index: number) => (
                  <li key={index} className="text-sm leading-relaxed text-muted-foreground">
                    {useCase}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="examples" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3 px-4 bg-secondary/30 rounded-lg group">
            <span className="flex items-center gap-2 font-bold">
              {t('examples')}
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px]">
                {safeExamples.length}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              {safeExamples.map((example: any, index: number) => (
                <Card key={index} className="overflow-hidden border-border/40 shadow-sm transition-hover hover:shadow-md">
                  <div className="relative aspect-video w-full bg-muted/20">
                    {example.pictureSrc && (
                      <Image
                        src={example.pictureSrc}
                        alt={example.sentence || 'Example image'}
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <div className="border-l-4 border-primary pl-4 py-1">
                      <p className="font-bold text-lg">{example.exampleEn}</p>
                      <p className="text-sm font-medium text-muted-foreground/80">
                        {example.exampleAr}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-4 text-sm font-medium leading-relaxed italic border border-border/50">
                      "{example.sentence}"
                    </div>
                    <div className="pt-2">
                      <AudioPlayer src={example.soundSrc} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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


export const PhrasalVerbSkeleton = () => {
  return (
    <li className="flex h-64 w-full flex-col justify-between rounded-lg bg-secondary p-4 shadow-md animate-pulse">
      <div className="h-6 w-3/4 rounded bg-muted-foreground/20" />
      <div className="my-4 h-[1px] w-full bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
        <div className="h-20 w-full rounded bg-muted-foreground/20" />
        <div className="h-20 w-full rounded bg-muted-foreground/20" />
      </div>
    </li>
  );
};

export default PhrasalVerbItem;
