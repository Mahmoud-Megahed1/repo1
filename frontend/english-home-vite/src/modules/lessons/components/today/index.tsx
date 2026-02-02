import { AudioPlayback } from '@components/audio-playback';
import { useTodayAudio } from '@modules/lessons/queries';
import type { TodayLesson } from '@modules/lessons/types';
import type { LessonId, LevelId } from '@shared/types/entities';
import {
  Card,
  CardContent,
  CardDescription,
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
  lesson: { description, instructions, sentences, soundSrc, title },
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
    <div className="mx-auto flex max-w-5xl flex-col space-y-8">
      <Card lang="ar" className="gap-2">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="md:text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
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

      <SentencesCard sentences={sentences} />
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
  );
};

export default Today;
