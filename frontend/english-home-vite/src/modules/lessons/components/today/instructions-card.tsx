import CustomAccordion from '@components/custom-accordion';
import { localizedNumber } from '@lib/utils';
import type { TodayLesson } from '@modules/lessons/types';
import { Badge } from '@ui/badge';
import { CardDescription } from '@ui/card';
import { List } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  instructions: TodayLesson['instructions'];
};
const InstructionsCard: FC<Props> = ({ instructions }) => {
  const { t } = useTranslation();
  return (
    <CustomAccordion
      variant={'amber'}
      icon={List}
      title={t('Global.todayLesson.instructions')}
    >
      <ul lang="ar" className="grid gap-4 md:grid-cols-2">
        {instructions.map(({ definition, word }, index) => (
          <li
            key={index}
            className="bg-accent/30 border-input/50 flex flex-col gap-1 rounded-xl border px-4 py-3"
          >
            <span className="flex items-center gap-2 text-lg font-medium">
              <Badge
                className="aspect-square rounded-full"
                variant={'amber-gradient'}
              >
                {localizedNumber(index + 1, 'ar-EG')}
              </Badge>
              {word}
            </span>
            <CardDescription>{definition}</CardDescription>
          </li>
        ))}
      </ul>
    </CustomAccordion>
  );
};

export default InstructionsCard;
