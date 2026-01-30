'use client';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { useTranslations } from 'next-intl';
import EarSound from '../shared/ear-sound';
import RichTextViewer from '../shared/rich-text-viewer';

const Listen = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty } = useLesson({
    day,
    levelId,
    lessonName: 'LISTEN',
  });
  const listen = lesson.at(0);
  const tGlobal = useTranslations('Global');
  if (isLoading) return 'Loading...';
  if (isEmpty || !listen) return 'Coming soon';
  return (
    <div>
      <h3 className="text-lg font-bold md:text-xl">
        {tGlobal('sidebar.lessons.LISTEN')}
      </h3>
      <audio
        controls
        src={listen.soundSrc}
        controlsList="nodownload"
        className="mt-4 w-full max-w-[900px]"
      >
        <track
          kind="captions"
          src={listen.transcript}
          srcLang="en"
          label="English captions"
          default
        />
      </audio>
      <RichTextViewer lang="en" className="mt-8">
        {listen.transcript}
      </RichTextViewer>
      <h4 className="mt-10 text-xl font-bold">{tGlobal('definition')}</h4>
      <div lang="en" className="font-inter">
        {listen.definitions.map(({ definition, word, soundSrc }, index) => (
          <p key={index} className="mt-4 max-w-[800px] text-lg md:px-4">
            <EarSound soundSrc={soundSrc} className="me-2 [&_svg]:size-3" />
            <span className="font-bold capitalize">{word}</span>
            <span>: {definition}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Listen;
