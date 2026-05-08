import useLocale from '@hooks/use-locale';
import { localizedNumber } from '@lib/utils';
import { Check, Lightbulb } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhrasalVerbLesson } from '../../types';
import { Card, CardContent, CardDescription, CardHeader } from '@ui/card';
import { accordionVariants } from '@components/custom-accordion';

type Props = {
    useCases: PhrasalVerbLesson['useCases']['en'];
};

const UseCasesCard: FC<Props> = ({ useCases }) => {
    const { t } = useTranslation();
    const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';

    return (
        <Card>
            <CardHeader className="w-full">
                <div className="flex items-center gap-4">
                    <div className={accordionVariants({ variant: 'amber' })}>
                        <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div className="rtl:space-y-1">
                        <h2 className="text-xl font-bold md:text-2xl">{t('Global.phrasalVerbs.useCasesCard.title')}</h2>
                        <CardDescription>{t('Global.phrasalVerbs.useCasesCard.description', {
                            number: localizedNumber(useCases.length, locale),
                        })}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {useCases.map((useCase, index) => (
                        <li
                            key={index}
                            className="bg-accent/50 text-accent-foreground/80 flex items-start gap-4 rounded-xl p-4"
                        >
                            <Check className="my-auto hidden size-4 shrink-0 sm:block" />
                            <p className="text-sm md:text-base">{useCase}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default UseCasesCard;
