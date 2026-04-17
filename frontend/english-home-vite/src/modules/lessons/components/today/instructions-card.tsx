import CustomAccordion from '@components/custom-accordion';
import { localizedNumber } from '@lib/utils';
import type { TodayLesson } from '@modules/lessons/types';
import { Badge } from '@ui/badge';
import { Card, CardContent, CardDescription } from '@ui/card';
import { List } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  instructions: TodayLesson['instructions'];
  asPanel?: boolean;
};
const InstructionsCard: FC<Props> = ({ instructions, asPanel = false }) => {
  const { t } = useTranslation();

  const content = (
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
  );

  if (asPanel) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6 max-h-[400px] overflow-y-auto">
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <CustomAccordion
      variant={'amber'}
      icon={List}
      title={t('Global.todayLesson.instructions')}
    >
      {content}
    </CustomAccordion>
  );
};

export default InstructionsCard;
