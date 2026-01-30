'use client';
import { Button } from '@/components/ui/button';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { formatTime } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import EarSound from '../shared/ear-sound';

const Speak = () => {
  const t = useTranslations('Global.sidebar.lessons');
  const [{ day, levelId }] = useLessonQueryParams();
  const { lesson, isEmpty, isLoading } = useLesson({
    day,
    levelId,
    lessonName: 'SPEAK',
  });
  const speaks = lesson.at(0)?.sentences || [];
  if (isLoading) return 'Loading...';
  if (isEmpty) return 'Coming Soon';
  return (
    <div className="flex size-full flex-col">
      <h3 className="mb-4 text-lg font-bold md:text-xl">{t('SPEAK')}</h3>
      <ul
        lang="en"
        className="mx-auto inline-flex w-full max-w-2xl flex-col gap-8 ps-4"
      >
        {speaks.map((speak, index) => (
          <SpeakItem key={index} {...speak} />
        ))}
      </ul>
    </div>
  );
};

const SpeakItem = ({
  sentence,
  soundSrc,
}: {
  sentence: string;
  soundSrc: string;
}) => {
  const { audioURL, timer, isRecording, startRecording, stopRecording } =
    useVoiceRecorder({ maxDurationInSeconds: 60 * 1000 });
  const t = useTranslations('Global');
  const locale = useLocale();
  return (
    <li className="flex w-full flex-col">
      <div lang="en" className="flex items-start gap-2">
        <EarSound soundSrc={soundSrc} className="[&_svg]:size-4" />
        <p className="font-inter text-xl font-medium lg:max-w-[900px]">
          {sentence}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-col items-center gap-4 md:flex-row">
        {audioURL ? (
          <audio
            controls
            src={audioURL}
            controlsList="nodownload"
            className="w-full max-w-[600px]"
          >
            <track
              kind="captions"
              src={''}
              srcLang="en"
              label="English captions"
              default
            />
          </audio>
        ) : (
          <div className="h-12 w-full max-w-[600px] rounded-full bg-secondary" />
        )}
        <div lang={locale}>
          {isRecording ? (
            <div>
              <Button
                variant={'outline'}
                onClick={stopRecording}
                className="bg-transparent capitalize"
              >
                {t('stop')}
              </Button>
              <span className="ms-2">{formatTime(timer)}</span>
            </div>
          ) : (
            <Button
              variant={'outline'}
              onClick={startRecording}
              className="capitalize"
            >
              {t('record')}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};

export default Speak;
