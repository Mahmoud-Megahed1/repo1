import { useAiChatStore } from '@hooks/use-ai-chat-store';
import { useTheme } from '@components/contexts/theme-context';
import { useParams } from '@tanstack/react-router';
import AIReviewChat from './today/ai-review-chat';
import type { LessonId, LevelId } from '@shared/types/entities';

type Props = {
    isLessonCompleted?: boolean;
};

export function GlobalAiChat({ }: Props) {
    const { isOpen, setIsOpen } = useAiChatStore();
    const { dynamicTheme } = useTheme();
    const params = useParams({ strict: false });

    // Only show if we have valid lesson context
    if (!params.id || !params.day || !params.lessonName) return null;

    // Respect admin visibility toggle
    if (dynamicTheme?.showAIReviewChat === false) return null;

    return (
        <AIReviewChat
            open={isOpen}
            onOpenChange={setIsOpen}
            levelName={params.id as LevelId}
            day={params.day as string}
            lessonName={params.lessonName as LessonId}
        />
    );
}
