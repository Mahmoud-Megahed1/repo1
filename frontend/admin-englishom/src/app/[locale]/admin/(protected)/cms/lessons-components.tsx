import { LessonIdEnum } from '@/constants';
import dynamic from 'next/dynamic';

const loadLessonComponent = (
  componentName: keyof typeof import('@/components/admin'),
) =>
  dynamic(
    () => import('@/components/admin').then((module) => module[componentName]),
    { loading: () => <p>Loading...</p> },
  );

export const lessonComponents = {
  [LessonIdEnum.READ]: loadLessonComponent('Read'),
  [LessonIdEnum.WRITE]: loadLessonComponent('Write'),
  [LessonIdEnum.LISTEN]: loadLessonComponent('Listen'),
  [LessonIdEnum.SPEAK]: loadLessonComponent('Speak'),
  [LessonIdEnum.DAILY_TEST]: loadLessonComponent('DailyTest'),
  [LessonIdEnum.IDIOMS]: loadLessonComponent('Idioms'),
  [LessonIdEnum.PICTURES]: loadLessonComponent('Pictures'),
  [LessonIdEnum.PHRASAL_VERBS]: loadLessonComponent('PhrasalVerbs'),
  [LessonIdEnum.Q_A]: loadLessonComponent('Q_A'),
  [LessonIdEnum.TODAY]: loadLessonComponent('Today'),
  [LessonIdEnum.GRAMMAR]: loadLessonComponent('Grammar'),
};
