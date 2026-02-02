import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import RichTextViewer from '@components/rich-text-viewer';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { FileText } from 'lucide-react';
import { type ComponentProps, type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LevelId } from '../../types';
import type { ListenLesson } from '../../types';
import { useMarkTaskAsCompleted } from '../../mutations';
import { DefinitionCard } from './definition-card';

type Props = {
  lesson: ListenLesson;
} & ComponentProps<'div'>;
const Listening: FC<Props> = ({ lesson, ...props }) => {
  const { t } = useTranslation();
  const [isTranscriptVisible, setTranscriptVisible] = useState(false);
  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  useEffect(() => {
    if (levelId && day) {
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'LISTEN',
        submission: { completed: true },
        score: 100,
        feedback: 'Listening Completed',
      });
    }
  }, [day, levelId, markTaskCompleted]);

  return (
    <div className="mx-auto flex size-full max-w-2xl flex-col gap-4" {...props}>
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
          <h4 className="mb-2 flex items-center gap-2 text-xl font-bold">
            <span className="size-2 rounded-full bg-amber-400" />
            {t('Global.sidebarItems.LISTEN')}
          </h4>
          {/* Show transcript */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTranscriptVisible((prev) => !prev)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isTranscriptVisible ? t('Global.hide') : t('Global.show')}{' '}
            {t('Global.transcript')}
          </Button>
        </div>
        <AudioPlayback
          audioSrc={lesson.soundSrc}
          title={t('Global.sidebarItems.LISTEN')}
        />
      </div>
      {isTranscriptVisible && (
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>{t('Global.transcript')}</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextViewer lang="en">
              {lesson.transcript.replace(/{(.*?)}/g, '<b>$1</b>')}
            </RichTextViewer>
          </CardContent>
        </Card>
      )}
      <div className="flex flex-col gap-8">
        <div className="mt-8 space-y-2">
          <h4 className="flex items-center gap-2 text-xl font-bold">
            <span className="size-2 rounded-full bg-green-600" />
            {t('Global.definitions')}
          </h4>
          <ul lang="en" className="font-inter space-y-4">
            {lesson.definitions.map(({ definition, word, soundSrc }, index) => (
              <li key={index}>
                <DefinitionCard
                  word={word}
                  definition={definition}
                  soundSrc={soundSrc}
                  index={index + 1}
                />
              </li>
            ))}
          </ul>
        </div>
        <NextLessonButton lessonName="WRITE" />
      </div>
    </div>
  );
};

export default Listening;
