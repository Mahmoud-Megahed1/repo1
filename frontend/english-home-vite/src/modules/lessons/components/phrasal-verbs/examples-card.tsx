import { AudioPlayback } from '@components/audio-playback';
import CustomAccordion from '@components/custom-accordion';
import useItemsPagination from '@hooks/use-items-pagination';
import useLocale from '@hooks/use-locale';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { ArrowLeft, ArrowRight, Globe, MessageCircle } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhrasalVerbLesson } from '../../types';

type Props = Pick<PhrasalVerbLesson, 'examples'>;

const ExamplesCard: FC<Props> = ({ examples }) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const { currentItem, next, prev, hasNextItems, hasPrevItems, currentIndex } =
        useItemsPagination(examples);

    if (!currentItem) return null;

    return (
        <CustomAccordion
            title={t('Global.idioms.examplesCard.title')}
            description={t('Global.idioms.examplesCard.description')}
            icon={MessageCircle}
            variant="purple"
            className="mt-8 space-y-10"
            opened
        >
            <ul className="flex h-4 items-center justify-center gap-2">
                {Array.from({ length: examples.length }).map((_, index) => (
                    <li
                        key={index}
                        className={cn(
                            'size-2 rounded-full transition-all duration-300 ease-in-out',
                            {
                                'size-3 bg-purple-600': index === currentIndex,
                                'bg-muted-foreground/40': index !== currentIndex,
                            }
                        )}
                    />
                ))}
            </ul>

            <div className="space-y-4">
                {currentItem.pictureSrc && (
                    <img
                        src={currentItem.pictureSrc}
                        alt={currentItem.exampleEn}
                        className="mx-auto aspect-auto max-h-80 w-full rounded-xl object-contain shadow-md"
                    />
                )}
                <div className="mx-auto flex w-fit gap-2 *:border-none">
                    <Button
                        variant="outline"
                        size={'sm'}
                        className="rtl:rotate-180 transition-all hover:bg-primary/10 active:scale-95 shadow-sm"
                        onClick={prev}
                        disabled={!hasPrevItems}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size={'sm'}
                        className="rtl:rotate-180 transition-all hover:bg-primary/10 active:scale-95 shadow-sm"
                        onClick={next}
                        disabled={!hasNextItems}
                    >
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {locale === 'en' ? (
                    <div lang="en">
                        <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Globe className="size-4" />
                            <span className="text-sm font-semibold uppercase tracking-wider">
                                English Example
                            </span>
                        </div>
                        <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5 dark:bg-blue-700/15">
                            <p className="leading-relaxed font-bold text-lg">{currentItem.exampleEn}</p>
                        </div>
                    </div>
                ) : (
                    <div lang="ar">
                        <div className="mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Globe className="size-4" />
                            <span className="text-sm font-semibold uppercase tracking-wider text-right w-full block">
                                المثال بالعربية
                            </span>
                        </div>
                        <div className="rounded-xl border-s-4 border-green-500 bg-green-50 p-5 dark:bg-green-700/15 text-right" dir="rtl">
                            <p className="leading-relaxed font-bold text-lg">{currentItem.exampleAr}</p>
                        </div>
                    </div>
                )}

                <div>
                    <div className="mb-3 text-sm font-semibold tracking-wider text-purple-600 dark:text-purple-400">
                        {t('Global.idioms.examplesCard.exampleInSituation')}
                    </div>
                    <div
                        lang="en"
                        className="rounded-xl border-l-4 border-purple-500 bg-purple-50 p-5 dark:bg-purple-700/15"
                    >
                        <p className="leading-relaxed">{currentItem.sentence}</p>
                    </div>
                </div>
            </div>

            <AudioPlayback
                audioSrc={currentItem.soundSrc}
                className="bg-muted/40 shadow-inner"
                title={t('Global.listenToAudio')}
            />
        </CustomAccordion>
    );
};

export default ExamplesCard;
