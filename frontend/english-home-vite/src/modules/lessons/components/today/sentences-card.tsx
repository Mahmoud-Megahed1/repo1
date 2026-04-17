import CustomAccordion from '@components/custom-accordion';
import type { TodayLesson } from '@modules/lessons/types';
import { Badge } from '@ui/badge';
import { Card, CardContent } from '@ui/card';
import { Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  sentences: TodayLesson['sentences'];
  asPanel?: boolean;
};
const SentencesCard = ({ sentences, asPanel = false }: Props) => {
  const { t } = useTranslation();

  const content = (
    <ul lang="en" className="grid grid-cols-2 gap-4">
      {sentences.map((sentence, index) => (
        <li
          key={index}
          className="border-input/50 bg-accent/30 flex gap-2 rounded-xl border px-4 py-6 text-sm font-medium"
        >
          <Badge
            className="aspect-square shrink-0 rounded-full"
            variant={'info-blue'}
          >
            {index + 1}
          </Badge>
          <p>{sentence}</p>
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
      variant={'blue'}
      icon={Book}
      title={t('Global.todayLesson.practiceSentences')}
      opened={true}
      className="max-h-[60vh] overflow-y-auto"
    >
      {content}
    </CustomAccordion>
  );
};

export default SentencesCard;
