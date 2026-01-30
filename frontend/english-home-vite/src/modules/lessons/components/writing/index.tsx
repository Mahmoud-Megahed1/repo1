import type { FC } from 'react';
import type { WritingLesson } from '../../types';
import {
  useWriting,
  WritingControls,
  WritingProgress,
  WritingProvider,
  WritingSentence,
} from './context';
import NextLessonButton from '@components/next-lesson-button';

type Props = {
  lesson: WritingLesson;
};

const Writing: FC<Props> = ({ lesson }) => {
  return (
    <WritingProvider lesson={lesson}>
      <WritingProgress />
      <WritingSentence />
      <WritingControls />
      <ButtonWrapper />
    </WritingProvider>
  );
};
const ButtonWrapper = () => {
  const { isLastItem } = useWriting();
  return isLastItem ? (
    <NextLessonButton lessonName="SPEAK" className="mt-8" />
  ) : null;
};

export default Writing;
