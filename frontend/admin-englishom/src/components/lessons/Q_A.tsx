import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { useLocale } from 'next-intl';
import EarSound from '../shared/ear-sound';
import { cn } from '@/lib/utils';

const Q_A = () => {
  const [{ day, levelId }] = useLessonQueryParams();
  const {
    isLoading,
    lesson: questionAnswerList,
    isEmpty,
  } = useLesson({
    day,
    levelId,
    lessonName: 'Q_A',
  });
  const locale = useLocale();
  const title = locale === 'en' ? 'Q&A' : 'أسئلة وأجوبة';

  if (isLoading) return 'Loading...';
  if (isEmpty) return 'Coming Soon';
  return (
    <div>
      <h3 className="text-lg font-bold md:text-xl">{title}</h3>
      <section
        lang="en"
        className="mt-4 flex w-full flex-col gap-4 rounded-xl text-xl font-bold text-primary *:bg-secondary md:gap-0 [&>*:first-child]:rounded-t-[inherit] [&>*:last-child]:rounded-b-[inherit] [&>*:nth-child(odd)]:bg-primary [&>*:nth-child(odd)]:text-secondary"
      >
        {questionAnswerList.map(
          ({ answer, question, answerSrc, questionSrc }, index) => (
            <div
              key={index}
              className="flex flex-col *:flex-1 *:shrink-0 *:p-4 md:flex-row"
            >
              <div className="flex items-center gap-2 md:bg-transparent md:text-current">
                <EarSound
                  className={cn('[&_svg]:size-4', {
                    'bg-primary-foreground text-primary': index % 2 === 0,
                  })}
                  soundSrc={questionSrc}
                />
                <p>{question}</p>
              </div>
              <div className="flex items-center gap-2 md:bg-transparent md:text-current">
                <EarSound
                  className={cn('[&_svg]:size-4', {
                    'bg-primary-foreground text-primary': index % 2 === 0,
                  })}
                  soundSrc={answerSrc}
                />
                <p>{answer}</p>
              </div>
            </div>
          ),
        )}
      </section>
    </div>
  );
};

export default Q_A;
