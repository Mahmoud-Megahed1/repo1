import { useLessonProgressStore } from '@hooks/use-lesson-progress-store';
import { useEffect } from 'react';
import type { FC } from 'react';

type Props = {
    currentIndex: number;
    total: number;
};

const LessonProgress: FC<Props> = ({ currentIndex, total }) => {
    const setProgress = useLessonProgressStore((s) => s.setProgress);
    const resetProgress = useLessonProgressStore((s) => s.resetProgress);

    useEffect(() => {
        setProgress(currentIndex, total);
    }, [currentIndex, total, setProgress]);

    useEffect(() => {
        return () => resetProgress();
    }, [resetProgress]);

    // Rendering is now handled by the parent route header
    return null;
};

export default LessonProgress;
