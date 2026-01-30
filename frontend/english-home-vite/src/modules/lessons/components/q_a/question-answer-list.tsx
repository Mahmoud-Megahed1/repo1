import type { QuestionAnswerLesson } from '@modules/lessons/types';
import QuestionAnswerCard from './question-answer-card';

const QuestionAnswerList = ({ lesson }: { lesson: QuestionAnswerLesson[] }) => {
  return (
    <div className="space-y-8">
      {lesson.map((item, index) => (
        <QuestionAnswerCard index={index + 1} {...item} />
      ))}
    </div>
  );
};

export default QuestionAnswerList;
