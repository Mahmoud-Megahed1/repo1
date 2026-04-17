import { AudioPlayback } from '@components/audio-playback';
import { useTodayAudio } from '@modules/lessons/queries';
import type { TodayLesson } from '@modules/lessons/types';
import type { LessonId, LevelId } from '@shared/types/entities';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { AudioLines, Book, List } from 'lucide-react';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import InstructionsCard from './instructions-card';
import PracticeSpeaking from './practice-speaking';
import SentencesCard from './sentences-card';
import NextLessonButton from '@components/next-lesson-button';
import { cn } from '@lib/utils';
type Props = {
  lesson: Omit<TodayLesson, 'id'>;
  day: number | string;
  lessonName: LessonId;
  levelId: LevelId;
};

type TabId = 'instructions' | 'audio' | 'sentences';

const Today: FC<Props> = ({
  lesson: { title, description, instructions, sentences, soundSrc },
  day,
  lessonName,
  levelId,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { data, isFetching } = useTodayAudio({
    day,
    levelId,
  });

  const [activeTab, setActiveTab] = useState<TabId>('instructions');

  const tabs: { id: TabId; label: string; icon: typeof List }[] = [
    { id: 'instructions', label: t('Global.todayLesson.instructions'), icon: List },
    { id: 'audio', label: t('Global.todayLesson.lessonAudio'), icon: AudioLines },
    { id: 'sentences', label: t('Global.todayLesson.practiceSentences'), icon: Book },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Lesson title (question) + description */}
      {title && (
        <h3 dir="rtl" lang="ar" className="text-lg md:text-xl font-bold text-right">{title}</h3>
      )}
      <p dir="rtl" lang="ar" className="text-muted-foreground text-sm md:text-base text-right">{description}</p>

      {/* 2-column layout: Tabs panel (left/right) + Practice Speaking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left: Tabbed content panel */}
        <div className="space-y-3">
          {/* Tab buttons */}
          <div className="flex gap-1 rounded-xl bg-accent/50 p-1.5">
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

          {/* Tab content — fixed height to prevent layout shift */}
          <div className="min-h-[300px] lg:min-h-[400px]">
            {activeTab === 'instructions' && (
              <InstructionsCard instructions={instructions} asPanel />
            )}
            {activeTab === 'audio' && (
              <Card className="gap-2 h-full">
                <CardHeader className="flex items-center gap-4">
                  <div className="to-primary dark:to-secondary rounded-xl bg-gradient-to-br from-[#96796e] p-3 shadow-lg">
                    <AudioLines className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold md:text-2xl">
                    {t('Global.todayLesson.lessonAudio')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioPlayback
                    audioSrc={soundSrc}
                    className="dark:border-input/60 dark:border"
                  />
                </CardContent>
              </Card>
            )}
            {activeTab === 'sentences' && (
              <SentencesCard sentences={sentences} asPanel />
            )}
          </div>
        </div>

        {/* Right: Practice Speaking + Next */}
        <div className="space-y-6">
          <PracticeSpeaking
            day={day}
            lessonName={lessonName}
            levelId={levelId}
            defaultResult={data?.data}
            isLoading={isFetching}
            sentenceText={sentences.join(' ')}
          />
          <NextLessonButton lessonName="Q_A" />
        </div>
      </div>
    </div>
  );
};

export default Today;
