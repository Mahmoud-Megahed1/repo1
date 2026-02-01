import AnalyzingSkeleton from '@components/analyzing-skeleton';
import { AudioPlayback } from '@components/audio-playback';
import CustomAccordion from '@components/custom-accordion';
import { SpeakingFeedback } from '@components/speaking-feedback';
import useLocale from '@hooks/use-locale';
import useRecorder from '@hooks/use-recorder';
import { localizedNumber } from '@lib/utils';
import { useCompareAudio, useUploadAudio } from '@modules/lessons/mutations';
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
    defaultAudioUrl?: string | null;
    isLoading?: boolean;
    sentenceText: string;
};
const PracticeSpeaking: FC<Props> = ({
    day,
    lessonName,
    levelId,
    isLoading = false,
    defaultAudioUrl,
    sentenceText,
}) => {
    const { t } = useTranslation();
    const [audioUrl, setAudioUrl] = useState<string | null | undefined>(
        defaultAudioUrl
    );
    const {
        mutate: compareMutate,
        data,
        isPending,
    } = useCompareAudio({
        levelName: levelId,
        day: +day,
    });
    useEffect(() => {
        setAudioUrl(defaultAudioUrl);
    }, [defaultAudioUrl]);
    const recorder = useMemo(
        () => (
            <Recorder
                day={day}
                lessonName={lessonName}
                levelId={levelId}
                defaultAudioUrl={audioUrl}
                isLoading={isLoading}
                maxDurationInSeconds={25}
                onStop={(file) => {
                    compareMutate({ audio: file, sentenceText });
                    const objectUrl = URL.createObjectURL(file);
                    setAudioUrl(objectUrl);
                }}
            />
        ),
        [audioUrl, compareMutate, day, isLoading, lessonName, levelId, sentenceText]
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
                ) : data?.data ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                        {data.data.isPassed && (
                            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 px-6 py-3 rounded-lg font-bold flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300 w-full justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                                <span>{t('Global.dailySpeakingSuccess')}</span>
                            </div>
                        )}
                        <SpeakingFeedback
                            result={{
                                ...data!.data,
                            }}
                            recordUrl={audioUrl}
                            onReset={() => {
                                setAudioUrl(null);
                            }}
                            className="w-full"
                        />
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
    day: number | string;
    lessonName: LessonId;
    levelId: LevelId;
    // eslint-disable-next-line no-unused-vars
    onStop?: (file: File) => void;
    maxDurationInSeconds?: number;
};
const Recorder: FC<RecorderProps> = ({
    defaultAudioUrl,
    isLoading,
    day,
    lessonName,
    levelId,
    onStop,
    maxDurationInSeconds = 20,
}) => {
    const { t } = useTranslation();
    const { mutate: uploadMutate } = useUploadAudio({
        day: `${day}`,
        lesson_name: lessonName,
        level_name: levelId,
    });
    const {
        isRecording,
        audioURL: recordUrl,
        toggleRecording,
        timer,
    } = useRecorder({
        maxDurationInSeconds,
        onStop: (file) => {
            if (!file) return;
            uploadMutate(file);
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
