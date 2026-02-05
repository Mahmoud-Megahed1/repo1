import RichTextViewer from '@components/rich-text-viewer';
import useLocale from '@hooks/use-locale';
import { cn } from '@lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {
  Book,
  File,
  List,
  Minus,
  Plus,
  SwatchBook,
  type LucideIcon,
} from 'lucide-react';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { GrammarLesson } from '../types';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { type LevelId } from '../types';
import { useMarkTaskAsCompleted } from '../mutations';

type Props = {
  lesson: GrammarLesson;
} & ComponentProps<'div'>;
const Grammar: FC<Props> = ({
  lesson: {
    nameAr,
    nameEn,
    definitionAr,
    definitionEn,
    words,
    examples,
    notes,
    ...rest
  },
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const title = locale === 'ar' ? nameAr : nameEn;

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  const handleComplete = () => {
    if (levelId && day) {
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'GRAMMAR',
        submission: { completed: true },
        score: 100,
        feedback: 'Grammar Completed',
      });
    }
  };

  const definition = locale === 'ar' ? definitionAr : definitionEn;
  const useCases = locale === 'ar' ? rest.useCases.ar : rest.useCases.en;

  let accordionValues = [];

  try {
    accordionValues = JSON.parse(
      localStorage.getItem('accordionValues') || '[]'
    );
  } catch (error) {
    accordionValues = [];
    console.error('Error parsing accordion values from localStorage', error);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <Card className={cn('border-none', className)} {...props}>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-8">{definition}</CardDescription>
          <Accordion
            type="multiple"
            className="w-full space-y-4 *:border-none"
            defaultValue={accordionValues}
            onValueChange={(value) =>
              localStorage.setItem('accordionValues', JSON.stringify(value))
            }
          >
            <CustomAccordion
              title={t('Global.useCases')}
              icon={List}
              value="item-1"
            >
              <ul className="list-inside list-decimal space-y-1">
                {useCases.map((useCase, index) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </CustomAccordion>
            <CustomAccordion
              title={t('Global.examples')}
              icon={Book}
              value="item-2"
            >
              <ul lang="en" className="space-y-2">
                {examples.map((example, index) => (
                  <li key={index} className="bg-muted/50 rounded-md px-3 py-2">
                    {example}
                  </li>
                ))}
              </ul>
            </CustomAccordion>
            {words && (
              <CustomAccordion
                title={t('Global.words')}
                icon={SwatchBook}
                value="item-3"
              >
                <ul
                  lang="en"
                  className="grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2"
                >
                  {words.map((word, index) => (
                    <li
                      key={index}
                      className="bg-accent/50 w-full rounded-md p-2 font-medium capitalize"
                    >
                      <span className="me-2 font-bold">•</span>
                      {word}
                    </li>
                  ))}
                </ul>
              </CustomAccordion>
            )}
            {notes && (
              <CustomAccordion
                title={t('Global.notes')}
                icon={File}
                value="item-4"
              >
                <div className="bg-accent/40 rounded-md px-3 py-4">
                  <RichTextViewer lang="en">{notes}</RichTextViewer>
                </div>
              </CustomAccordion>
            )}
          </Accordion>
        </CardContent>
      </Card>
      <NextLessonButton lessonName="PHRASAL_VERBS" onClick={handleComplete} />
    </div>
  );
};

type CustomAccordionProps = {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  value?: string;
  className?: string;
};
const CustomAccordion: FC<CustomAccordionProps> = ({
  title,
  icon: Icon,
  children,
  value = 'item-1',
  className,
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="bg-accent/50 hover:bg-accent/70 cursor-pointer px-4 transition-all duration-200 ease-in-out hover:no-underline [&[data-state=open]>#close-icon]:block [&[data-state=open]>#open-icon]:hidden [&_#default-icon]:hidden">
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-4" />}
          {title}
        </span>
        <Plus
          id="open-icon"
          className="bg-primary text-primary-foreground size-5 rounded-full p-px"
        />
        <Minus
          id="close-icon"
          className="bg-secondary/40 text-secondary-foreground hidden size-5 rounded-full p-px"
        />
      </AccordionTrigger>
      <AccordionContent
        className={cn('flex flex-col gap-4 text-balance p-4', className)}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Grammar;
