import useLocale from '@hooks/use-locale';
import { useState, type FC } from 'react';
import DefinitionCard from './definition-card';
import ExamplesCard from './examples-card';
import UseCasesCard from './use-cases-card';
import NextLessonButton from '@components/next-lesson-button';
import { useAuth } from '@components/contexts/auth-context';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type IdiomLesson, type LevelId } from '../../types';
import { useTranslation } from 'react-i18next';
import { cn } from '@lib/utils';
import { BookOpen, MessageCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@ui/button';

type Props = {
  lesson: IdiomLesson;
};

type TabId = 'definition' | 'examples' | 'useCases';

const Idioms: FC<Props> = ({ lesson }) => {
  const { t } = useTranslation();
  const { levelsDetails } = useAuth();
  const useCases =
    useLocale() === 'ar' ? lesson.useCases.ar : lesson.useCases.en;

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  // Check if user owns this level (not a trial user)
  const canAccessLevel = levelsDetails?.some(
    ({ levelName, isExpired }) => levelName === levelId && !isExpired
  );

  const [isCompleted, setIsCompleted] = useState(false);

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
      if (!canAccessLevel) {
        setIsCompleted(true);
      }
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

      {/* For paid users: show normal Next button to DAILY_TEST */}
      {/* For trial users: show a Complete button without navigating to DAILY_TEST */}
      {canAccessLevel ? (
        <NextLessonButton lessonName="DAILY_TEST" disabled={!hasPlayedAudio} onClick={handleComplete} />
      ) : (
        <div className="flex flex-col items-end gap-2">
          {isCompleted && (
            <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-800 shadow-sm animate-in fade-in zoom-in duration-300 dark:bg-green-900/50 dark:text-green-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{t('Global.lessonCompleted')}</span>
            </div>
          )}
          <Button
            variant={'outline-primary'}
            disabled={!hasPlayedAudio || isCompleted}
            className="self-end"
            onClick={handleComplete}
          >
            {isCompleted ? t('Global.lessonCompleted') : t('Global.completeLesson')}
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export type { IdiomLesson };
export default Idioms;
