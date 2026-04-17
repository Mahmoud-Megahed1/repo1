import useLocale from '@hooks/use-locale';
import { useState, type FC } from 'react';
import DefinitionCard from './definition-card';
import ExamplesCard from './examples-card';
import UseCasesCard from './use-cases-card';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type IdiomLesson, type LevelId } from '../../types';

type Props = {
  lesson: IdiomLesson;
};
const Idioms: FC<Props> = ({ lesson }) => {
  const useCases =
    useLocale() === 'ar' ? lesson.useCases.ar : lesson.useCases.en;

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  const handleComplete = async () => {
    if (levelId && day) {
      await markTaskCompletedAsync({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'IDIOMS',
        submission: { completed: true },
        score: 100,
        feedback: 'Idioms Completed',
      });
    }
  };

  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const handleAudioPlay = () => {
    if (!hasPlayedAudio) {
      setHasPlayedAudio(true);
      handleComplete();
    }
  };
  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-4">
      {/* 2-column: Definition+UseCases first (RTL=right), Examples second (RTL=left) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <DefinitionCard
            definitionEn={lesson.definitionEn}
            definitionAr={lesson.definitionAr}
          />
          <UseCasesCard useCases={useCases} />
        </div>
        <div>
          <ExamplesCard examples={lesson.examples} onAudioPlay={handleAudioPlay} />
        </div>
      </div>
      <NextLessonButton lessonName="DAILY_TEST" />
    </div>
  );
};

export type { IdiomLesson };
export default Idioms;
