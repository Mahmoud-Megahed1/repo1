import useLocale from '@hooks/use-locale';
import { useState, type FC } from 'react';
import DefinitionCard from './definition-card';
import ExamplesCard from './examples-card';
import UseCasesCard from './use-cases-card';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type IdiomLesson, type LevelId } from '../../types';
import { useTranslation } from 'react-i18next';
import { cn } from '@lib/utils';
import { BookOpen, MessageCircle, HelpCircle } from 'lucide-react';

type Props = {
  lesson: IdiomLesson;
};

type TabId = 'definition' | 'examples' | 'useCases';

const Idioms: FC<Props> = ({ lesson }) => {
  const { t } = useTranslation();
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
    }
  };

  const [activeTab, setActiveTab] = useState<TabId>('definition');

  const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
    { id: 'definition', label: t('Global.phrasalVerbs.definitionCard.title'), icon: BookOpen },
    { id: 'examples', label: t('Global.phrasalVerbs.examplesCard.title'), icon: MessageCircle },
    { id: 'useCases', label: t('Global.phrasalVerbs.useCasesCard.title'), icon: HelpCircle },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-4">
      {/* Tab buttons — same style as Today lesson */}
      <div className="flex flex-row gap-1 rounded-xl bg-accent/50 p-1.5 shrink-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200',
              activeTab === id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content — full width */}
      <div>
        {activeTab === 'definition' && (
          <DefinitionCard
            definitionEn={lesson.definitionEn}
            definitionAr={lesson.definitionAr}
          />
        )}
        {activeTab === 'examples' && (
          <ExamplesCard examples={lesson.examples} onAudioPlay={handleAudioPlay} />
        )}
        {activeTab === 'useCases' && (
          <UseCasesCard useCases={useCases} />
        )}
      </div>

      <NextLessonButton lessonName="DAILY_TEST" disabled={!hasPlayedAudio} onClick={handleComplete} />
    </div>
  );
};

export type { IdiomLesson };
export default Idioms;
