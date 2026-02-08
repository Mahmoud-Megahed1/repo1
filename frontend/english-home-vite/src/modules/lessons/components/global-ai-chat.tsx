import { useAiChatStore } from '@hooks/use-ai-chat-store';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { Bot, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AIReviewChat from './today/ai-review-chat';
import type { LessonId, LevelId } from '@shared/types/entities';

type Props = {
    isLessonCompleted?: boolean;
};

export function GlobalAiChat({ isLessonCompleted = false }: Props) {
    const { t } = useTranslation();
    const { isOpen, setIsOpen } = useAiChatStore();
    const params = useParams({ strict: false });

    // Only show if we have valid lesson context
    if (!params.id || !params.day || !params.lessonName) return null;

    return (
        <>
            {/* Floating Action Button - Only show if lesson is completed */}
            {!isOpen && isLessonCompleted && (
                <div className="fixed bottom-28 start-6 z-40 group">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:scale-110 transition-all duration-300 animate-bounce-slow ring-4 ring-white/20 dark:ring-black/20"
                        onClick={() => setIsOpen(true)}
                    >
                        <Bot className="h-7 w-7 text-white" />

                        {/* Pulsing "New" effect */}
                        <span className="absolute -top-1 -end-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500 text-[10px] font-bold text-white items-center justify-center shadow-sm border border-white dark:border-gray-900">
                                AI
                            </span>
                        </span>
                    </Button>

                    {/* Tooltip on hover */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-popover text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {t('Global.aiReview.title', 'AI Review')}
                        <Sparkles className="w-3 h-3 text-yellow-500 inline-block ms-1" />
                    </div>
                </div>
            )}

            <AIReviewChat
                open={isOpen}
                onOpenChange={setIsOpen}
                levelName={params.id as LevelId}
                day={params.day as string}
                lessonName={params.lessonName as LessonId}
            />
        </>
    );
}
