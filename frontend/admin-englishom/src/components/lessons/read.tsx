'use client';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { useTranslations } from 'next-intl';
import RichTextViewer from '../shared/rich-text-viewer';

const Read = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const {
    isLoading,
    lesson: reads,
    isEmpty,
  } = useLesson({ day, levelId, lessonName: 'READ' });
  const t = useTranslations('ReadPage');
  const read = reads.at(0);
  if (isLoading) return 'Loading...';
  if (isEmpty || !read) return 'Coming Soon';
  return (
    <div className="mx-auto flex size-full max-w-2xl flex-col gap-8">
      <article className="space-y-2">
        <h3 className="text-lg font-bold md:text-xl">{t('reading')}</h3>
        <RichTextViewer
          lang="en"
          className="rounded-lg bg-secondary p-4 shadow-md"
        >
          {read.transcript}
        </RichTextViewer>
      </article>
      <div className="my-auto flex flex-col gap-2">
        <h3 className="text-lg font-bold md:text-xl">{t('listening')}</h3>
        <audio
          controls
          src={read.soundSrc}
          controlsList="nodownload"
          className="w-full"
        >
          <track
            kind="captions"
            src={read.transcript}
            srcLang="en"
            label="English captions"
            default
          />
        </audio>
      </div>
    </div>
  );
};

export default Read;
