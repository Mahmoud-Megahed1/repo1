'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { FC, useState } from 'react';

const SentenceWithInput = ({ sentence }: { sentence: string }) => {
  const parts = sentence.split(/({[^}]*})/g).filter(Boolean);
  return (
    <div lang="en" className="flex w-full flex-wrap items-center gap-2">
      {parts.map((part, index) =>
        part.match(/{[^}]*}/) ? (
          <Input
            className={`answers max-w-[200px] border-none bg-secondary text-lg font-bold`}
            key={index}
          />
        ) : (
          <span className="text-nowrap" key={index}>
            {part}
          </span>
        ),
      )}
    </div>
  );
};

const Write: FC = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const [result, setResult] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isEmpty, lesson, isLoading } = useLesson({
    day,
    levelId,
    lessonName: 'WRITE',
  });
  const write = lesson.at(0);

  if (isLoading) return 'Loading...';
  if (isEmpty || !write) return 'Coming Soon';

  const answers = Array.from(
    write.sentences.flatMap((item) =>
      Array.from(item.matchAll(/{(.*?)}/g)).map((match) => match[1]),
    ),
  );
  const correct = () => {
    const inputs = document.querySelectorAll(
      '.answers',
    ) as NodeListOf<HTMLInputElement>;
    const values = Array.from(inputs).map((input) => input.value);
    if (values.length !== answers.length) throw new Error('Error');
    const numOfCorrectAns = values.reduce((acc, value, index) => {
      if (value.trim().toLowerCase() === answers[index].toLowerCase())
        return ++acc;
      else {
        inputs[index].value = answers[index];
        inputs[index].classList.add('border-destructive', 'border');
        return acc;
      }
    }, 0);
    setResult(numOfCorrectAns);
    setIsSubmitted(true);
  };
  const reset = () => {
    setIsSubmitted(false);
    setResult(0);
    const inputs = document.querySelectorAll(
      '.answers',
    ) as NodeListOf<HTMLInputElement>;
    Array.from(inputs).forEach((input) => {
      input.value = '';
      input.classList.remove('error');
    });
  };
  const isPassed = result >= Math.floor(answers.length / 2);
  return (
    <div className="flex size-full flex-col gap-8 text-primary">
      <h3 className="text-lg font-bold md:text-xl">Write</h3>
      <ul lang="en" className="flex list-disc flex-col gap-10 px-8 text-2xl">
        {write.sentences.map((item, index) => (
          <li key={index} className="w-full">
            <SentenceWithInput sentence={item} />
          </li>
        ))}
      </ul>

      <Dialog>
        <div className="flex items-center gap-4">
          <DialogTrigger asChild>
            <Button className="w-fit" onClick={correct} disabled={isSubmitted}>
              Correct
            </Button>
          </DialogTrigger>
          {isSubmitted && (
            <Button variant="secondary" onClick={reset}>
              Retry
            </Button>
          )}
        </div>
        <DialogContent className="text-center">
          <DialogHeader className="mx-auto">
            <DialogTitle className="text-2xl font-bold">
              {isPassed ? 'Congratulations!' : 'Try Again!'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium">
              You got {`${result} / ${answers.length}`}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Write;
