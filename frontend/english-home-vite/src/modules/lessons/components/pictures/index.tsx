import useItemsPagination from '@hooks/use-items-pagination';
import { useEffect, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { PictureLesson } from '../../types';
import PictureCard from './picture-card';
import PictureSidebar from './picture-sidebar';
type Props = {
  lesson: PictureLesson[];
} & ComponentProps<'div'>;
const Pictures: FC<Props> = ({ lesson, ...props }) => {
  const { t } = useTranslation();

  const searchParams = new URLSearchParams(window.location.search);
  let pictureIndex = searchParams.get('picture') || 0;
  pictureIndex = isNaN(Number(pictureIndex)) ? 0 : Number(pictureIndex);

  const {
    currentItem,
    currentIndex,
    setCurrentIndex,
    prev,
    next,
    hasNextItems,
    hasPrevItems,
    isLast,
  } = useItemsPagination(lesson, pictureIndex);

  // Update search params when current index changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('picture', currentIndex.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${searchParams}`
    );
  }, [currentIndex]);
  if (!currentItem) return null;
  return (
    <div className="mx-auto w-full max-w-6xl" {...props}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {t('Global.pictureVocabulary.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('Global.pictureVocabulary.description')}
        </p>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-start">
        <PictureCard
          key={currentIndex}
          next={next}
          prev={prev}
          hasNextItems={hasNextItems}
          hasPrevItems={hasPrevItems}
          showNextLessonButton={isLast}
          {...currentItem}
        />
        <PictureSidebar
          items={lesson}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          title={t('Global.vocabulary')}
        />
      </div>
    </div>
  );
};
export default Pictures;
