import CustomAccordion from '@components/custom-accordion';
import useLocale from '@hooks/use-locale';
import { localizedNumber } from '@lib/utils';
import { Check, Lightbulb } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { IdiomLesson } from '.';

type Props = {
  useCases: IdiomLesson['useCases']['en'];
};
const UseCasesCard: FC<Props> = ({ useCases }) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <CustomAccordion
      className="mt-8"
      title={t('Global.idioms.useCasesCard.title')}
      description={t('Global.idioms.useCasesCard.description', {
        number: localizedNumber(useCases.length, locale),
      })}
      icon={Lightbulb}
      variant="amber"
    >
      <ul className="space-y-4">
        {useCases.map((useCase: string, index: number) => (
          <li
            key={index}
            className="bg-accent/50 text-accent-foreground/80 flex items-start gap-4 rounded-xl p-4"
          >
            <Check className="my-auto hidden size-4 shrink-0 sm:block" />
            <p className="text-sm md:text-base">{useCase}</p>
          </li>
        ))}
      </ul>
    </CustomAccordion>
  );
};

export default UseCasesCard;
