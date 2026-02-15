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

    // Respect admin visibility toggle
    if (dynamicTheme?.showAIReviewChat === false) return null;

    return (
        <AIReviewChat
            open={isOpen}
            onOpenChange={setIsOpen}
            levelName={params.id as LevelId || 'A1'}
            day={params.day as string || '1'}
            lessonName={params.lessonName as LessonId || 'vocabulary'}
        />
    );
}
