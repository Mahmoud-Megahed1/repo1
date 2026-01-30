import useLocale from '@hooks/use-locale';
import { cn, localizedNumber } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';
import { CheckCircle, Clock, Lock, Play } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  variant?: 'pending' | 'locked' | 'completed';
  dayNumber: number | string;
  duration?: string;
  levelId: string;
};

const DayCard: FC<Props> = ({
  variant = 'locked',
  dayNumber,
  duration = '15-30',
  levelId,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  return (
    <Card
      className={cn('text-muted-foreground py-4', {
        'border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-950':
          variant === 'completed',
        '': variant === 'locked',
        'bg-orange-100 dark:border-orange-400 dark:bg-orange-400/30':
          variant === 'pending',
      })}
    >
      <CardContent className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-foreground font-medium">
            {t('Global.day')} {localizedNumber(+dayNumber, locale)}
          </h3>
          {variant === 'completed' && (
            <CheckCircle className="size-4 text-green-600" />
          )}
          {variant === 'locked' && <Lock className="size-4" />}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="size-4" />
            <span className="text-xs">
              {duration} {t('Global.min')}
            </span>
          </div>
        </div>

        {variant !== 'locked' && (
          <Button
            size="sm"
            variant={variant === 'completed' ? 'success' : 'default'}
            className={`mt-3 w-full ${
              variant !== 'completed' && 'bg-orange-400/90 hover:bg-orange-400'
            }`}
            asChild
          >
            <Link
              to="/app/levels/$id/$day/$lessonName"
              params={{ id: levelId, day: `${dayNumber}`, lessonName: `READ` }}
            >
              {variant === 'completed' ? (
                <>{t('Global.review')}</>
              ) : (
                <>
                  <Play />
                  {t('Global.start')}
                </>
              )}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DayCard;
