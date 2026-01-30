import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { EarIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const Idioms = () => {
  const locale = useLocale() as 'en' | 'ar';
  const [{ day, levelId }] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty } = useLesson({
    day,
    levelId,
    lessonName: 'IDIOMS',
  });
  const idioms = lesson.at(0);
  const tGlobal = useTranslations('Global');
  const t = useTranslations('IdiomsPage');
  const definition =
    locale === 'ar' ? idioms?.definitionAr : idioms?.definitionEn;
  if (isLoading) return 'Loading...';
  if (isEmpty || !idioms) return 'Coming Soon';
  return (
    <div className="flex size-full flex-col gap-8 text-primary">
      <h3 className="text-lg font-bold md:text-xl">{t('title')}</h3>
      <article className="flex max-w-2xl flex-col gap-8 md:mx-auto">
        <p className="rounded bg-secondary p-4 text-center text-xl font-semibold shadow-md">
          {definition}
        </p>
        <ul className="list-disc space-y-4 px-8 md:mx-auto">
          {idioms.useCases[locale].map((item, index) => (
            <li key={index} className="text-lg font-semibold">
              {item}
            </li>
          ))}
        </ul>
      </article>
      <h3 className="text-lg font-bold md:text-xl">{tGlobal('examples')}</h3>
      <ul className="grid gap-4 lg:grid-cols-3">
        {idioms.examples.map(
          ({ exampleAr, exampleEn, pictureSrc, soundSrc }, index) => (
            <li
              key={index}
              className="relative rounded bg-secondary p-4 text-center text-xl font-semibold shadow-md"
            >
              <button
                onClick={() => {
                  const audioElement = document.getElementById(
                    `audio-${index}`,
                  ) as HTMLAudioElement;
                  if (audioElement.paused) {
                    audioElement.play();
                  } else {
                    audioElement.pause();
                  }
                }}
                className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground"
              >
                <EarIcon size={24} />
              </button>
              <audio
                src={soundSrc}
                controlsList="nodownload"
                id={`audio-${index}`}
                hidden
              >
                <track
                  kind="captions"
                  src={exampleEn}
                  srcLang="en"
                  label="English captions"
                  default
                />
              </audio>
              <img
                src={pictureSrc}
                alt="idioms"
                className="mx-auto mb-4 mt-8 w-full rounded-sm md:w-[300px]"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 font-bold">
                <p lang="en">{exampleEn}</p>
                <p lang="ar">{exampleAr}</p>
              </div>
            </li>
          ),
        )}
      </ul>
      <ul lang="en" className="list-disc px-8 pb-8">
        {idioms.examples.map(({ sentence }, i) => (
          <li key={i} className="text-lg font-semibold">
            {sentence}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Idioms;
