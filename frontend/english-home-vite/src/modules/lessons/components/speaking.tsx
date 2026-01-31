import { AudioPlayback } from '@components/audio-playback';
import { accordionVariants } from '@components/custom-accordion';
import NextLessonButton from '@components/next-lesson-button';
import useItemsPagination from '@hooks/use-items-pagination';
import useLocale from '@hooks/use-locale';
import useRecorder from '@hooks/use-recorder';
import { cn, localizedNumber } from '@lib/utils';
import { useCompareAudio, useGetSentenceAudios } from '@modules/lessons/mutations';
import type { LevelId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Mic } from 'lucide-react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../../shared/components/analyzing-skeleton';
import { SpeakingFeedback } from '../../../shared/components/speaking-feedback';
import type { SpeakingResult, SpeakLesson } from '../types';

type UserRecord = {
  sentence: string;
  soundSrc: string;
  recordUrl: string | null;
  results?: SpeakingResult;
};
type Props = {
  lesson: SpeakLesson;
};
const Speaking: FC<Props> = ({ lesson: { sentences } }) => {
  const { t } = useTranslation();
  const { id: levelName, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate, isPending } = useCompareAudio({
    levelName: levelName as LevelId,
    day: +day,
  });
  const { data: savedAudios } = useGetSentenceAudios({
    levelName: levelName as LevelId,
  });
  const {
    currentItem,
    currentIndex,
    hasNextItems,
    hasPrevItems,
    isLast,
    next,
    prev,
  } = useItemsPagination(sentences);

  const [usersRecords, setUsersRecords] = useState<UserRecord[]>(
    sentences.map((sentence) => ({
      sentence: sentence.sentence,
      soundSrc: sentence.soundSrc,
      recordUrl: null,
    }))
  );

  // Hydrate saved recordings
  useEffect(() => {
    if (savedAudios?.data) {
      setUsersRecords((prev) =>
        prev.map((record) => {
          // Backend sanitization logic match
          const recordKey = record.sentence
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]/g, '_') // Keep alphanumeric and Arabic, replace others with _
            .replace(/_+/g, '_') // Collapse multiple underscores
            .substring(0, 100);

          const saved = savedAudios.data.find((s) => s.sentence === recordKey);

          if (saved) {
            return {
              ...record,
              recordUrl: saved.url,
              results: saved.metadata ? {
                similarityPercentage: saved.metadata.similarityPercentage,
                correctSentence: saved.metadata.correctSentence,
                userTranscript: saved.metadata.userTranscript,
                isPassed: saved.metadata.isPassed,
                audioUrl: saved.url
              } : undefined
            };
          }
          return record;
        })
      );
    }
  }, [savedAudios]);

  const handleRecordChange = async (file: File) => {
    const recordUrl = URL.createObjectURL(file);
    mutate(
      { audio: file, sentenceText: currentItem!.sentence },
      {
        onSuccess: (data) => {
          setUsersRecords((prev) =>
            prev.map((record, index) =>
              index === currentIndex
                ? { ...record, results: data.data, recordUrl: data.data.audioUrl ?? recordUrl }
                : record
            )
          );
        },
      }
    );
    setUsersRecords((prev) =>
      prev.map((record, index) =>
        index === currentIndex ? { ...record, recordUrl } : record
      )
    );
  };

  if (!currentItem) return null;
  const { sentence, soundSrc } = currentItem;
  const currentRecord = usersRecords[currentIndex];
  return (
    <div className="mx-auto flex max-w-2xl flex-col space-y-4">
      <Card>
        <CardHeader className="w-full">
          <div className="flex items-center gap-4">
            <div className={cn(accordionVariants({ variant: 'blue' }))}>
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div className="rtl:space-y-1">
              <h2 className="text-xl font-bold md:text-2xl">
                {t('Global.speaking.title')}
              </h2>
              <CardDescription>
                {t('Global.speaking.subDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {t('Global.speaking.description')}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader lang="en" className="flex items-center gap-4">
          <div className="dark:to-secondary to-primary flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#96796e] p-3 text-xl font-bold text-white shadow-lg">
            {currentIndex + 1}
          </div>
          <CardTitle className="text-xl font-bold md:text-2xl">
            {sentence}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AudioPlayback
            key={soundSrc}
            audioSrc={soundSrc}
            className="border-input/50 w-full border"
          />
          {currentRecord.recordUrl ? (
            isPending ? (
              <Loading />
            ) : (
              <div className="flex flex-col items-center gap-4">
                {currentRecord.results?.isPassed && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <span>✓</span> {t('Global.completed')}
                  </div>
                )}
                <SpeakingFeedback
                  result={currentRecord.results!}
                  onReset={() => {
                    setUsersRecords((prev) => {
                      const newData = [...prev];
                      newData[currentIndex].recordUrl = null;
                      return newData;
                    });
                  }}
                  recordUrl={currentRecord.recordUrl}
                  className="mt-4"
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    setUsersRecords((prev) => {
                      const newData = [...prev];
                      newData[currentIndex].recordUrl = null;
                      return newData;
                    });
                  }}
                >
                  {t('Global.tryAgain')}
                </Button>
              </div>
            )
          ) : (
            <Recorder
              key={currentIndex}
              onValueChange={(file) => handleRecordChange(file)}
              value={currentRecord?.recordUrl}
            />
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t mt-4 flex items-center justify-between z-10">
        <Button variant="outline" onClick={prev} disabled={!hasPrevItems}>
          {t('Global.prev')}
        </Button>
        <ul className="flex items-center gap-1">
          {Array(sentences.length)
            .fill(0)
            .map((_, i) => (
              <li
                key={i}
                className={cn('bg-accent size-2 rounded-full transition-all duration-300', {
                  'bg-primary scale-125': i === currentIndex,
                })}
              />
            ))}
        </ul>
        {isLast ? (
          <NextLessonButton lessonName="DAILY_TEST" className="px-8" />
        ) : (
          <Button variant="default" onClick={next} disabled={!hasNextItems} className="px-8">
            {t('Global.next')}
          </Button>
        )}
      </div>
    </div>
  );
};

const Recorder = ({
  onValueChange,
  value,
}: {
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (file: File) => void;
  value?: string | null;
}) => {
  const { t } = useTranslation();
  const { isRecording, audioURL, toggleRecording, timer } = useRecorder({
    maxDurationInSeconds: 20,
    onStop: (file) => {
      if (!file) return;
      onValueChange?.(file);
    },
  });

  const url = audioURL || value;

  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <Card className="border-input/50 bg-accent/20 mt-8 border">
      <CardHeader>
        <CardTitle className="text-center">
          {t('Global.todayLesson.recordYourself')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {!isRecording && url && (
          <AudioPlayback className="w-full md:max-w-lg" audioSrc={url} />
        )}
        <Button
          onClick={toggleRecording}
          className="w-52"
          variant={isRecording ? 'outline-primary' : 'default'}
        >
          {isRecording ? (
            t('Global.todayLesson.recording') + '...'
          ) : (
            <>
              <Mic /> {t('Global.todayLesson.startRecording')}
            </>
          )}
        </Button>
        <span className="text-muted-foreground inline-block text-sm">
          <span
            className="bg-destructive me-2 inline-block size-2 animate-pulse rounded-full"
            hidden={!isRecording}
          />
          {t('Global.todayLesson.recording')}: {localizedNumber(timer, locale)}{' '}
          / {localizedNumber(20, locale)}{' '}
          {locale === 'ar-EG' ? t('Global.second') : t('Global.seconds')}
        </span>
      </CardContent>
    </Card>
  );
};

export default Speaking;
