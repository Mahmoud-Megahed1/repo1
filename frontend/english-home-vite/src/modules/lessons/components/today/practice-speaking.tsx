import AnalyzingSkeleton from '@components/analyzing-skeleton';
import { AudioPlayback } from '@components/audio-playback';
import CustomAccordion from '@components/custom-accordion';
import { SpeakingFeedback } from '@components/speaking-feedback';
import useLocale from '@hooks/use-locale';
import useRecorder from '@hooks/use-recorder';
import { localizedNumber } from '@lib/utils';
import { useCompareAudio, useMarkTaskAsCompleted } from '@modules/lessons/mutations';
import type { LessonId, LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Skeleton } from '@ui/skeleton';
import { Mic, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
    day: number | string;
    lessonName: LessonId;
    levelId: LevelId;
    defaultResult?: { url: string; metadata?: any };
    isLoading?: boolean;
    sentenceText: string;
};
const PracticeSpeaking: FC<Props> = ({
    day,
    levelId,
    isLoading = false,
    defaultResult,
    sentenceText,
}) => {
    const { t } = useTranslation();
    const [audioUrl, setAudioUrl] = useState<string | null | undefined>(
        defaultResult?.url
    );
    const [isReset, setIsReset] = useState(false);
    const {
        mutate: compareMutate,
        data,
        isPending,
        reset: resetMutation,
    } = useCompareAudio({
        levelName: levelId,
        day: +day,
        lessonName: 'TODAY', // Force 'TODAY' to ensure backend saves as today_audio.wav
    });

    // Initialize data from defaultResult if available, honoring manual resets
    const resultData = useMemo(() => {
        if (isReset) return data?.data;
        return data?.data || (defaultResult?.metadata ? {
            ...defaultResult.metadata,
            isPassed: defaultResult.metadata.isPassed === 'true' || defaultResult.metadata.isPassed === true,
            similarityPercentage: +defaultResult.metadata.similarityPercentage
        } : undefined);
    }, [data?.data, defaultResult?.metadata, isReset]);

    const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

    useEffect(() => {
        if (!isReset && !audioUrl && defaultResult?.url) {
            setAudioUrl(defaultResult.url);
        }
    }, [defaultResult, audioUrl, isReset]);

    useEffect(() => {
        if (resultData?.isPassed) {
            markTaskCompleted({
                levelName: levelId,
                day: +day,
                taskName: 'TODAY',
                submission: { completed: true },
                score: 100,
                feedback: 'Daily Speaking Completed',
            });
        }
    }, [resultData?.isPassed, day, levelId, markTaskCompleted]);

    const recorder = useMemo(
        () => (
            <Recorder
                defaultAudioUrl={audioUrl}
                isLoading={isLoading}
                maxDurationInSeconds={25}
                onStop={(file) => {
                    compareMutate({ audio: file, sentenceText });
                    const objectUrl = URL.createObjectURL(file);
                    setAudioUrl(objectUrl);
                    setIsReset(true); // Treat new recording as a reset of default state
                }}
            />
        ),
        [audioUrl, compareMutate, isLoading, sentenceText]
    );

    return (
        <CustomAccordion
            variant={'purple'}
            icon={Mic}
            title={t('Global.todayLesson.practiceSpeaking')}
        >
            {audioUrl ? (
                isPending ? (
                    <AnalyzingSkeleton />
                ) : resultData ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                        {resultData.isPassed && (
                            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 px-6 py-3 rounded-lg font-bold flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300 w-full justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                                <span>{t('Global.dailySpeakingSuccess' as any)}</span>
                            </div>
                        )}
                        <SpeakingFeedback
                            result={{
                                ...resultData,
                            }}
                            recordUrl={audioUrl}
                            onReset={() => {
                                setAudioUrl(null);
                                setIsReset(true);
                                resetMutation();
                            }}
                            className="w-full"
                        />
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                // "Exit" state - practically just hide the result or show a success state, 
                                // but since this is Today's lesson, scrolling or collapsing is handled by user.
                                // We'll just reset to null to 'close' the feedback if they want, or maybe just do nothing 
                                // but provide visual satisfaction. 
                                // Actually, better to just let them collapse the accordion. 
                                // But to satisfy "press x to exit", let's clear the audioUrl (and reset) BUT not start recording?
                                // No, that goes back to recorder.
                                // Let's scroll to the Next button.
                                const nextBtn = document.querySelector('a[href*="Q_A"]');
                                if (nextBtn) {
                                    nextBtn.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    // Fallback: reset to initial state (recorder) but that might be annoying.
                                    // Let's just toast?
                                    // Or simply do nothing but act as a 'Nice' button.
                                }
                            }}
                        >
                            {t('Global.done' as any)}
                        </Button>
                    </div>
                ) : (
                    recorder
                )
            ) : (
                recorder
            )}
        </CustomAccordion>
    );
};

type RecorderProps = {
    defaultAudioUrl?: string | null;
    isLoading?: boolean;
    // eslint-disable-next-line no-unused-vars
    onStop?: (file: File) => void;
    maxDurationInSeconds?: number;
};
const Recorder: FC<RecorderProps> = ({
    defaultAudioUrl,
    isLoading,
    onStop,
    maxDurationInSeconds = 20,
}) => {
    const { t } = useTranslation();
    const {
        isRecording,
        audioURL: recordUrl,
        toggleRecording,
        timer,
    } = useRecorder({
        maxDurationInSeconds,
        onStop: (file) => {
            if (!file) return;
            onStop?.(file);
        },
    });
    const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
    const [audioUrl, setAudioUrl] = useState<string | null | undefined>(
        recordUrl || defaultAudioUrl
    );
    useEffect(() => {
        setAudioUrl(recordUrl || defaultAudioUrl);
    }, [defaultAudioUrl, recordUrl]);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">
                    {t('Global.todayLesson.recordYourself')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                {isLoading && (
                    <Skeleton className="h-16 w-full rounded-xl md:max-w-lg" />
                )}
                {!isRecording && !isLoading && audioUrl && (
                    <AudioPlayback className="w-full md:max-w-lg" audioSrc={audioUrl} />
                )}
                <Button
                    onClick={toggleRecording}
                    className="w-52"
                    variant={isRecording ? 'outline-primary' : 'default'}
                    disabled={isLoading}
                >
                    {isRecording ? (
                        t('Global.todayLesson.recording') + '...'
                    ) : (
                        <>
                            <Mic /> {t('Global.todayLesson.startRecording')}
                        </>
                    )}
                </Button>
                <span className="text-muted-foreground inline-block text-sm">
                    <span
                        className="bg-destructive me-2 inline-block size-2 animate-pulse rounded-full"
                        hidden={!isRecording}
                    />
                    {t('Global.todayLesson.recording')}: {localizedNumber(timer, locale)}{' '}
                    / {localizedNumber(maxDurationInSeconds, locale)}{' '}
                    {locale === 'ar-EG' ? t('Global.second') : t('Global.seconds')}
                </span>
            </CardContent>
        </Card>
    );
};

export default PracticeSpeaking;
