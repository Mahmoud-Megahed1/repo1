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
import { AudioLines } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import InstructionsCard from './instructions-card';
import PracticeSpeaking from './practice-speaking';
import SentencesCard from './sentences-card';
import NextLessonButton from '@components/next-lesson-button';
type Props = {
  lesson: Omit<TodayLesson, 'id'>;
  day: number | string;
  lessonName: LessonId;
  levelId: LevelId;
};
const Today: FC<Props> = ({
  lesson: { title, description, instructions, sentences, soundSrc },
  day,
  lessonName,
  levelId,
}) => {
  const { t } = useTranslation();
  const { data, isFetching } = useTodayAudio({
    day,
    levelId,
  });
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Lesson title (question) + description */}
      {title && (
        <h3 dir="rtl" lang="ar" className="text-lg md:text-xl font-bold text-right">{title}</h3>
      )}
      <p dir="rtl" lang="ar" className="text-muted-foreground text-sm md:text-base text-right">{description}</p>

      {/* 2-column grid on desktop/iPad */}
      <div className="space-y-6">
        {/* Top Row: Instructions & Audio */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <InstructionsCard instructions={instructions} />

          <Card className="gap-2">
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
        </div>

        {/* Bottom Row: Sentences & Practice Speaking */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          {/* Practice Sentences */}
          <div id="practice-sentences">
            <SentencesCard sentences={sentences} />
          </div>

          {/* Right Column: Practice Speaking + Next */}
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
    </div>
  );
};

export default Today;
