'use client';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { useLocale, useTranslations } from 'next-intl';

const Grammar = () => {
  const locale = useLocale() as 'en' | 'ar';
  const [{ day, levelId }] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty } = useLesson({
    day,
    levelId,
    lessonName: 'GRAMMAR',
  });
  const grammar = lesson.at(0);
  const tGlobal = useTranslations('Global');
  if (isLoading) return 'Loading...';
  if (isEmpty || !grammar) return 'Coming Soon';
  const definition =
    locale === 'ar' ? grammar.definitionAr : grammar.definitionEn;
  const name = locale === 'ar' ? grammar.nameAr : grammar.nameEn;
  return (
    <div className="flex size-full flex-col gap-8 text-primary">
      <h3 className="text-lg font-bold md:text-xl">{name}</h3>
      <p className="w-full max-w-2xl rounded-lg bg-secondary p-4 text-center font-inter text-xl font-semibold shadow-md md:mx-auto">
        {definition}
      </p>
      <ul className="w-full max-w-2xl list-disc ps-4 font-inter md:mx-auto">
        {grammar.useCases[locale].map((useCase, index) => (
          <li key={index} className="text-lg font-semibold">
            {useCase}
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-8 pb-8 md:mx-auto md:flex-row">
        <section className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">{tGlobal('words')}</h4>
          <ul
            lang="en"
            className="w-full list-decimal rounded-lg bg-secondary px-8 py-4 ps-12 font-inter shadow-md"
          >
            {grammar.words?.map((word, index) => (
              <li key={index} className="text-xl font-semibold">
                {word}
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">{tGlobal('examples')}</h4>
          <ul
            lang="en"
            className="w-full list-decimal rounded-lg bg-secondary px-8 py-4 ps-12 font-inter shadow-md"
          >
            {grammar.examples.map((example, index) => (
              <li key={index} className="text-xl font-semibold">
                {example}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Grammar;
