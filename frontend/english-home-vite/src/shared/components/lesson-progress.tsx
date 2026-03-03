import { Progress } from '@ui/progress';
import { localizedNumber } from '@lib/utils';
import useLocale from '@hooks/use-locale';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';

type Props = {
    currentIndex: number;
    total: number;
};

const LessonProgress: FC<Props> = ({ currentIndex, total }) => {
    const { t } = useTranslation();
    const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
    return (
        <div className="flex flex-1 items-center gap-4">
            <div className="shrink-0">
                {localizedNumber(currentIndex + 1, locale)} {t('Global.of')}{' '}
                {localizedNumber(total, locale)}
            </div>
            <Progress
                value={((currentIndex + 1) / total) * 100}
                className="flex-1 md:max-w-52"
            />
        </div>
    );
};

export default LessonProgress;
