import CustomAccordion from '@components/custom-accordion';
import type { TodayLesson } from '@modules/lessons/types';
import { Badge } from '@ui/badge';
import { Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  sentences: TodayLesson['sentences'];
};
const SentencesCard = ({ sentences }: Props) => {
  const { t } = useTranslation();
  return (
    <CustomAccordion
      variant={'blue'}
      icon={Book}
      title={t('Global.todayLesson.practiceSentences')}
    >
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
    </CustomAccordion>
  );
};

export default SentencesCard;
