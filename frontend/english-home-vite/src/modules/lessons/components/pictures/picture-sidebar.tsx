import useLocale from '@hooks/use-locale';
import { cn, localizedNumber } from '@lib/utils';
import type { PictureLesson } from '@modules/lessons/types';
import { Card, CardContent } from '@ui/card';

const PictureSidebar = ({
  items,
  currentIndex,
  onSelect,
  title = 'Vocabulary',
}: {
  items: PictureLesson[];
  currentIndex: number;
  // eslint-disable-next-line no-unused-vars
  onSelect?: (index: number) => void;
  title?: string;
}) => {
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <Card className="shrink-0 rounded-md shadow-none">
      <CardContent>
        <h3 className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
          {title}
          <span className="text-xs font-medium">
            {localizedNumber(currentIndex + 1, locale)} /{' '}
            {localizedNumber(items.length, locale)}
          </span>
        </h3>
        <ul className="flex flex-wrap gap-2">
          {items.map(({ wordAr, wordEn, pictureSrc }, index) => (
            <li key={index}>
              <button
                onClick={() => onSelect?.(index)}
                className={cn(
                  'group flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors w-[72px] md:w-[80px]',
                  currentIndex === index
                    ? 'bg-primary/10 text-foreground ring-1 ring-primary/30'
                    : 'hover:bg-accent'
                )}
              >
                <img
                  src={`${pictureSrc}`}
                  alt={wordEn}
                  className="h-12 w-16 md:h-14 md:w-[72px] rounded object-cover"
                />
                <div className="min-w-0 w-full text-center">
                  <span
                    lang="en"
                    className="block truncate text-[10px] md:text-xs font-medium"
                  >
                    {wordEn}
                  </span>
                  <span
                    lang="ar"
                    className="text-muted-foreground block truncate text-[9px] md:text-[10px]"
                  >
                    {wordAr}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PictureSidebar;
