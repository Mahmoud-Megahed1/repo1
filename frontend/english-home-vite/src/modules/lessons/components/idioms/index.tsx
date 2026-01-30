import useLocale from '@hooks/use-locale';
import type { FC } from 'react';
import DefinitionCard from './definition-card';
import ExamplesCard from './examples-card';
import UseCasesCard from './use-cases-card';
import NextLessonButton from '@components/next-lesson-button';
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
  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-8">
      <DefinitionCard
        definitionEn={lesson.definitionEn}
        definitionAr={lesson.definitionAr}
      />
      <UseCasesCard useCases={useCases} />
      <ExamplesCard examples={lesson.examples} />
      <NextLessonButton lessonName="DAILY_TEST" />
    </div>
  );
};

export default Idioms;
