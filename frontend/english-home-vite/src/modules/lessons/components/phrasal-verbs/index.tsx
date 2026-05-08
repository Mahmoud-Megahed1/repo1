import useItemsPagination from '@hooks/use-items-pagination';
import { cn } from '@lib/utils';
import { useEffect, useState, type ComponentProps, type FC } from 'react';
import type { PhrasalVerbLesson } from '../../types';
import useLocale from '@hooks/use-locale';
import { useTranslation } from 'react-i18next';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type LevelId } from '../../types';
import DefinitionCard from './definition-card';
import UseCasesCard from './use-cases-card';
import ExamplesCard from './examples-card';
import { BookOpen, MessageCircle, HelpCircle } from 'lucide-react';

type Props = {
  lesson: PhrasalVerbLesson[];
} & ComponentProps<'div'>;

type TabId = 'definition' | 'examples' | 'useCases';

const PhrasalVerbs: FC<Props> = ({ lesson, className, ...props }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const searchParams = new URLSearchParams(window.location.search);
  let defaultIndex = searchParams.get('index') || 0;
  defaultIndex = isNaN(Number(defaultIndex)) ? 0 : Number(defaultIndex);

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  const handleComplete = async () => {
    if (levelId && day) {
      await markTaskCompletedAsync({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'PHRASAL_VERBS',
        submission: { completed: true },
        score: 100,
        feedback: 'Phrasal Verbs Completed',
      });
    }
  };

  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const handleAudioPlay = () => {
    if (!hasPlayedAudio) {
      setHasPlayedAudio(true);
    }
  };

  const { currentItem, currentIndex, isLast } = useItemsPagination(
    lesson,
    defaultIndex
  );

  const [activeTab, setActiveTab] = useState<TabId>('definition');

  const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
    { id: 'definition', label: t('Global.phrasalVerbs.definitionCard.title'), icon: BookOpen },
    { id: 'examples', label: t('Global.phrasalVerbs.examplesCard.title'), icon: MessageCircle },
    { id: 'useCases', label: t('Global.phrasalVerbs.useCasesCard.title'), icon: HelpCircle },
  ];

  // Update search params when current index changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('index', currentIndex.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${searchParams}`
    );
  }, [currentIndex]);

  if (!currentItem) return null;

  const useCases = locale === 'ar' ? currentItem.useCases.ar : currentItem.useCases.en;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-col space-y-4 pb-6',
        className
      )}
      {...props}
    >
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
            definitionAr={currentItem.definitionAr}
            definitionEn={currentItem.definitionEn}
          />
        )}
        {activeTab === 'examples' && (
          <ExamplesCard examples={currentItem.examples} onAudioPlay={handleAudioPlay} />
        )}
        {activeTab === 'useCases' && (
          <UseCasesCard useCases={useCases} />
        )}
      </div>

      {isLast && (
        <div className="flex justify-end mt-4">
          <NextLessonButton lessonName="IDIOMS" disabled={!hasPlayedAudio} onClick={handleComplete} />
        </div>
      )}
    </div>
  );
};

export default PhrasalVerbs;
