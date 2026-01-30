import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import usePagination from '@/hooks/use-pagination';
import { ChevronLeftIcon, ChevronRightIcon, EarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const Pictures = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const {
    isLoading,
    lesson: pictures,
    isEmpty,
  } = useLesson({
    day,
    levelId,
    lessonName: 'PICTURES',
  });
  const tGlobal = useTranslations('Global');
  const t = useTranslations('PicturesPage');
  const { currentItem, hasNextItems, hasPrevItems, next, prev, nextItems } =
    usePagination(pictures);
  if (isLoading) return 'Loading...';
  if (isEmpty) return 'Coming Soon';
  return (
    <div className="flex size-full flex-col gap-4 text-primary md:flex-row md:gap-16">
      <section className="flex flex-col gap-4 md:w-3/5">
        <div className="space-y-2">
          <h3 className="text-lg font-bold md:text-xl">{t('title')}</h3>
          <div className="w-full rounded-xl bg-secondary pb-6 shadow-md">
            <div className="relative h-[300px] w-full rounded-[inherit] shadow-md md:h-[400px]">
              <img
                src={currentItem.pictureSrc}
                alt={currentItem.wordEn}
                className="absolute size-full rounded-[inherit] object-cover"
              />

              {/* Navigation arrows */}
              <Button
                variant="ghost"
                size="icon"
                className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white disabled:opacity-0`}
                onClick={prev}
                disabled={!hasPrevItems}
                aria-label={tGlobal('prev')}
              >
                <ChevronLeftIcon size={24} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white disabled:opacity-0`}
                onClick={next}
                disabled={!hasNextItems}
                aria-label={tGlobal('next')}
              >
                <ChevronRightIcon size={24} />
              </Button>
            </div>
            <div
              lang="en"
              className="mb-2 mt-4 flex items-center justify-between gap-4 px-8 text-3xl font-bold leading-6"
            >
              <div className="flex items-center gap-4">
                <h2 lang="en" className="text-lg md:text-xl">
                  {currentItem.wordEn}
                </h2>
                <button
                  onClick={() => {
                    const audioElement = document.getElementById(
                      'audio',
                    ) as HTMLAudioElement;
                    if (audioElement.paused) {
                      audioElement.play();
                    } else {
                      audioElement.pause();
                    }
                  }}
                  className="rounded-full bg-primary p-1 text-primary-foreground"
                >
                  <EarIcon size={24} />
                </button>
                <audio
                  src={currentItem.soundSrc}
                  controlsList="nodownload"
                  id="audio"
                  hidden
                >
                  <track
                    kind="captions"
                    src={currentItem.wordEn}
                    srcLang="en"
                    label="English captions"
                    default
                  />
                </audio>
              </div>
              <h2 lang="ar" className="text-lg md:text-xl">
                {currentItem.wordAr}
              </h2>
            </div>
          </div>
        </div>
        <article>
          <h3 className="text-xl font-medium">{tGlobal('definition')}:</h3>
          <div className="px-8">
            <p lang="en" className="list-item">
              {currentItem.definition}
            </p>
          </div>
        </article>
        <article>
          <h3 className="text-xl font-medium">{tGlobal('examples')}:</h3>
          <ul lang="en" className="list-disc px-8 font-inter">
            {currentItem.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </article>
      </section>
      <section className="flex-1 border-t border-primary/50 md:mt-0 md:border-none">
        {nextItems.length > 0 && (
          <h2 className="mb-8 mt-4 text-xl font-bold md:mt-0 md:text-2xl">
            {t('haveTasks', {
              tasksNumber: nextItems.length,
            })}
          </h2>
        )}
        <h4 className="mb-2 mt-4 text-lg font-medium md:mt-0 md:text-xl">
          {tGlobal('nextTasks')}
        </h4>
        <ScrollArea className="h-[70vh]">
          <ul className="flex flex-1 flex-col divide-y divide-primary/50">
            {hasNextItems ? (
              nextItems.map((picture, index) => (
                <div key={index} className="w-full pb-6 pt-4">
                  <div className="relative h-[250px] rounded-xl shadow-md">
                    <img
                      src={picture.pictureSrc}
                      alt={picture.wordEn}
                      className="absolute size-full rounded-[inherit] object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-2xl font-bold">
                    <h2 lang="en" className="text-lg md:text-xl">
                      {picture.wordEn}
                    </h2>
                    <h2 lang="ar" className="text-lg md:text-xl">
                      {picture.wordAr}
                    </h2>
                  </div>
                </div>
              ))
            ) : (
              <div className="my-auto flex items-center justify-center">
                <p className="text-lg">{tGlobal('noTasks')}</p>
              </div>
            )}
          </ul>
        </ScrollArea>
      </section>
    </div>
  );
};

export default Pictures;
