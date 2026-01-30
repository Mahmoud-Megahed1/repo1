import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { cn, formatTime } from '@/lib/utils';
import { getDayAudio, uploadAudio } from '@/services/user-audios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import AudioPlayer from '../ui/audio-player';
import { Button } from '../ui/button';

const Today = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty } = useLesson({
    day,
    levelId,
    lessonName: 'TODAY',
  });
  const today = lesson.at(0);
  if (isLoading) return 'Loading...';
  if (isEmpty || !today) return 'Coming Soon';
  return (
    <div lang="ar" className="flex flex-col gap-4 text-lg md:text-xl">
      <h3 className="text-xl font-bold md:text-2xl">{today.title}</h3>
      <p>{today.description}</p>
      <ul className="flex list-inside list-decimal flex-col gap-2">
        {today.instructions.map(({ definition, word }, index) => (
          <li key={index}>
            <b className="me-2">{word}:</b>
            {definition}
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-[900px] font-medium">
        أقرأ هذه الجمل ببطء، ثم حاول تكرارها بصوت عالٍ. يُرجى تسجيل صوتك لمدة 15
        ثانية واستخدم هذه الجمل في محادثاتك اليومية مع أصدقائك أو عائلتك. تذكر
        أن الممارسة المستمرة هي المفتاح لتحسين مهاراتك في اللغة الإنجليزية.
      </p>
      <AudioPlayer src={today.soundSrc} className="mx-auto max-w-[600px]" />
      <ul
        lang="en"
        className="grid list-inside list-disc grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2"
      >
        {today.sentences.map((sentence, i) => (
          <li key={i}>{sentence}</li>
        ))}
      </ul>
      <UserRecording />
    </div>
  );
};

const UserRecording = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: ['get-audio', day, levelId],
    queryFn: () => getDayAudio({ day: `${day}`, level_name: levelId }),
  });
  const {
    audioURL,
    timer,
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
  } = useVoiceRecorder({ maxDurationInSeconds: 16 * 1000 });
  const t = useTranslations('Global');
  const { mutate } = useMutation({
    mutationKey: ['upload-audio'],
    mutationFn: uploadAudio,
  });
  const url = useMemo(
    () => audioURL || data?.data.url,
    [audioURL, data?.data.url],
  );

  useEffect(() => {
    if (audioBlob) {
      const soundSrc = new File([audioBlob], `${crypto.randomUUID()}.wav`, {
        type: audioBlob.type,
      });
      mutate({
        day: `${day}`,
        lesson_name: 'TODAY',
        level_name: levelId,
        file: soundSrc,
      });
    }
  }, [audioBlob, day, levelId, mutate]);

  return (
    <div
      lang="en"
      className="mx-auto mt-4 flex w-full flex-col items-center justify-center gap-4 md:flex-row"
    >
      {url ? (
        <AudioPlayer src={url} className="max-w-[600px]" />
      ) : (
        <div
          className={cn('h-12 w-full max-w-[600px] rounded-full bg-secondary', {
            'animate-pulse duration-1000': isLoading,
          })}
        />
      )}
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
  );
};

export default Today;
