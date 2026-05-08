import { BookOpen, Globe } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhrasalVerbLesson } from '../../types';
import { Card, CardContent, CardDescription, CardHeader } from '@ui/card';
import { accordionVariants } from '@components/custom-accordion';

type Props = Pick<PhrasalVerbLesson, 'definitionEn' | 'definitionAr'>;

const DefinitionCard: FC<Props> = ({ definitionEn, definitionAr }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="w-full">
                <div className="flex items-center gap-4">
                    <div className={accordionVariants({ variant: 'blue' })}>
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="rtl:space-y-1">
                        <h2 className="text-xl font-bold md:text-2xl">{t('Global.phrasalVerbs.definitionCard.title')}</h2>
                        <CardDescription>{t('Global.phrasalVerbs.definitionCard.description')}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 rtl:flex-col-reverse">
                <div lang="en">
                    <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Globe className="size-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">
                            English
                        </span>
                    </div>
                    <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5 dark:bg-blue-700/15">
                        <p className="text-sm md:text-base">{definitionEn}</p>
                    </div>
                </div>
                <div lang="ar">
                    <div className="mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Globe className="size-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">
                            العربية
                        </span>
                    </div>
                    <div className="rounded-xl border-s-4 border-green-500 bg-green-50 p-5 dark:bg-green-700/15">
                        <p className="text-sm md:text-base">{definitionAr}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DefinitionCard;
