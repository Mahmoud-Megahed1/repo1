import useLocale from '@hooks/use-locale';
import { localizedNumber } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Lock } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  day: number;
  levelId: LevelId;
  currentDay: number | string;
  lessonName: string;
};
const DayAccessError: FC<Props> = ({
  day,
  levelId,
  currentDay,
  lessonName,
}) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  const localizedDay = localizedNumber(day, locale);
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl text-center">
        <CardHeader>
          <div className="bg-destructive/10 text-destructive mx-auto mb-4 flex size-8 h-16 w-16 items-center justify-center rounded-full">
            <Lock />
          </div>
          <CardTitle className="text-lg md:text-xl lg:text-2xl">
            {t('Global.dayAccessError.title', { day: localizedDay })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {t('Global.dayAccessError.description', { day: localizedDay })}
          </CardDescription>
        </CardContent>
        <CardFooter className="mx-auto">
          <CardAction>
            <Button asChild>
              <Link
                to={
                  `/app/levels/${levelId}/${currentDay}/${lessonName}` as never
                }
              >
                {t('Global.dayAccessError.goToCurrentDay')}
              </Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DayAccessError;
