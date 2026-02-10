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
};

const PhrasalVerbItem: FC<Props> = ({
  data: { id, examples, definitionAr, definitionEn, useCases },
}) => {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('Global');
  const definition = locale === 'ar' ? definitionAr : definitionEn;
  const [open, setOpen] = useState(false);
  // Default values to prevent crash if data is missing during migration
  const safeExamples = examples || [];
  const safeUseCases = useCases || { en: [], ar: [] };

  const { mutate, isPending } = useDeleteLesson({
    day: '1', // These props might need to be passed from parent if they vary
    id,
    levelId: 'LEVEL_A1', // These props might need to be passed from parent if they vary
    lessonName: 'PHRASAL_VERBS', // Changed to PHRASAL_VERBS
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
      <div className="flex justify-between items-start">
        <h3 className="mb-2 mt-4 rounded-lg bg-muted-foreground/10 p-4 text-xl font-semibold flex-1">
          {t('definition')}: {definition}
        </h3>
      </div>

      <div className="my-4 h-[1px] w-full bg-border" />

      <b>{t('useCases')}:</b>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Use Cases (EN)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1">
              {safeUseCases.en?.map((useCase: string, index: number) => (
                <li key={index} className="text-sm">
                  {useCase}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-right">
              Use Cases (AR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-right" dir="rtl">
              {safeUseCases.ar?.map((useCase: string, index: number) => (
                <li key={index} className="text-sm">
                  {useCase}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Examples Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="examples">
          <AccordionTrigger>
            {t('examples')} ({safeExamples.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 pt-4 md:grid-cols-2">
              {safeExamples.map((example: any, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video w-full">
                    {example.pictureSrc && (
                      <Image
                        src={example.pictureSrc}
                        alt={example.sentence || 'Example image'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="space-y-4 p-4">
                    <div>
                      <p className="font-medium">{example.exampleEn}</p>
                      <p className="text-sm text-muted-foreground">
                        {example.exampleAr}
                      </p>
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm italic">
                      "{example.sentence}"
                    </div>
                    <AudioPlayer src={example.soundSrc} />
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

export default PhrasalVerbItem;
