import type { FC } from 'react';
import type { WritingLesson } from '../../types';
import {
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
      <WritingControls
        nextLessonButton={<NextLessonButton lessonName="SPEAK" />}
      />
    </WritingProvider>
  );
};

export default Writing;
