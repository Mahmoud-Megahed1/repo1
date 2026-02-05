import useLocale from '@hooks/use-locale';
import type { FC } from 'react';
import DefinitionCard from './definition-card';
import ExamplesCard from './examples-card';
import UseCasesCard from './use-cases-card';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type LevelId } from '../../types';
export type IdiomLesson = {
  id: string;
  definitionEn: string;
  definitionAr: string;
  useCases: {
    en: string[];
    ar: string[];
  };
  examples: Array<{
    exampleAr: string; // Idiom in Arabic
    exampleEn: string; // Idiom in English
    sentence: string; // Sentence using the idiom
    soundSrc: string;
    pictureSrc: string;
  }>;
};

type Props = {
  lesson: IdiomLesson;
};
const Idioms: FC<Props> = ({ lesson }) => {
  const useCases =
    useLocale() === 'ar' ? lesson.useCases.ar : lesson.useCases.en;

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  const handleComplete = () => {
    if (levelId && day) {
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'IDIOMS',
        submission: { completed: true },
        score: 100,
        feedback: 'Idioms Completed',
      });
    }
  };
  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-8">
      <DefinitionCard
        definitionEn={lesson.definitionEn}
        definitionAr={lesson.definitionAr}
      />
      <UseCasesCard useCases={useCases} />
      <ExamplesCard examples={lesson.examples} />
      <NextLessonButton lessonName="DAILY_TEST" onClick={handleComplete} />
    </div>
  );
};

export default Idioms;
