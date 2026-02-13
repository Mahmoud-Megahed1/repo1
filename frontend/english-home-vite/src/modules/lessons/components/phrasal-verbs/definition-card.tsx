import CustomAccordion from '@components/custom-accordion';
import { BookOpen, Globe } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhrasalVerbLesson } from '../../types';

type Props = Pick<PhrasalVerbLesson, 'definitionEn' | 'definitionAr'>;

const DefinitionCard: FC<Props> = ({ definitionEn, definitionAr }) => {
    const { t } = useTranslation();

    return (
        <CustomAccordion
            title={t('Global.idioms.definitionCard.title')}
            description={t('Global.idioms.definitionCard.title')}
            icon={BookOpen}
            variant="blue"
            className="flex flex-col gap-6 rtl:flex-col-reverse"
            opened
        >
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
        </CustomAccordion>
    );
};

export default DefinitionCard;
