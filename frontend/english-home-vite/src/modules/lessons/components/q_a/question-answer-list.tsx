import type { QuestionAnswerLesson } from '@modules/lessons/types';
import QuestionAnswerCard from './question-answer-card';

const QuestionAnswerList = ({ lesson, onAudioPlay }: { lesson: QuestionAnswerLesson[]; onAudioPlay?: () => void }) => {
  return (
    <div className="space-y-8">
      {lesson.map((item, index) => (
        <QuestionAnswerCard key={index} index={index + 1} onAudioPlay={onAudioPlay} {...item} />
      ))}
    </div>
  );
};

export default QuestionAnswerList;
