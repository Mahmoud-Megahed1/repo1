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
    <Card className="flex-1 shrink-0 rounded-md shadow-none">
      <CardContent className="flex-1 overflow-y-auto">
        <h3 className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
          {title}
          <span className="text-xs font-medium">
            {localizedNumber(currentIndex + 1, locale)} /{' '}
            {localizedNumber(items.length, locale)}
          </span>
        </h3>
        <ul className="space-y-1">
          {items.map(({ wordAr, wordEn, pictureSrc }, index) => (
            <li key={index}>
              <button
                onClick={() => onSelect?.(index)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
                  currentIndex === index
                    ? 'bg-primary/10 text-foreground'
                    : 'hover:bg-accent'
                )}
              >
                <img
                  src={`${pictureSrc}`}
                  alt={wordEn}
                  className="h-10 w-14 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span
                    lang="en"
                    className="block truncate font-medium rtl:text-end"
                  >
                    {wordEn}
                  </span>
                  <span
                    lang="ar"
                    className="text-muted-foreground block truncate text-xs rtl:text-start"
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
