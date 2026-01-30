import { useSidebarStore } from '@hooks/use-sidebar-store';
import DailyTest from '@modules/lessons/components/daily-test';
import Grammar from '@modules/lessons/components/grammar';
import Idioms from '@modules/lessons/components/idioms';
import Listening from '@modules/lessons/components/listening';
import PhrasalVerbs from '@modules/lessons/components/phrasal-verbs';
import Pictures from '@modules/lessons/components/pictures';
import Q_A from '@modules/lessons/components/q_a';
import Reading from '@modules/lessons/components/reading';
import Speaking from '@modules/lessons/components/speaking';
import Today from '@modules/lessons/components/today';
import Writing from '@modules/lessons/components/writing';
import { useLessonContext, withLessonProvider } from '@modules/lessons/context';
import { LESSONS_IDS } from '@shared/constants';
import { createFileRoute, notFound, useParams } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName/'
)({
  component: withLessonProvider(RouteComponent),
  onEnter: ({ params: { lessonName } }) => {
    useSidebarStore.getState().handleActiveItem(lessonName as never);
  },
  beforeLoad: ({ params: { lessonName } }) => {
    if (!LESSONS_IDS.includes(lessonName as never)) return notFound();
  },
});

function RouteComponent() {
  const { lesson } = useLessonContext();
  const { day, id, lessonName } = useParams({ from: Route.id });
  return (
    <>
      {lesson.type === 'READ' && <Reading lesson={lesson.data.at(0)!} />}
      {lesson.type === 'LISTEN' && <Listening lesson={lesson.data.at(0)!} />}
      {lesson.type === 'PICTURES' && <Pictures lesson={lesson.data} />}
      {lesson.type === 'GRAMMAR' && <Grammar lesson={lesson.data.at(0)!} />}
      {lesson.type === 'Q_A' && <Q_A lesson={lesson.data} />}
      {lesson.type === 'PHRASAL_VERBS' && <PhrasalVerbs lesson={lesson.data} />}
      {lesson.type === 'IDIOMS' && <Idioms lesson={lesson.data.at(0)!} />}
      {lesson.type === 'TODAY' && (
        <Today
          lesson={lesson.data.at(0)!}
          levelId={id as never}
          day={day}
          lessonName={lessonName as never}
        />
      )}
      {lesson.type === 'WRITE' && <Writing lesson={lesson.data.at(0)!} />}
      {lesson.type === 'SPEAK' && <Speaking lesson={lesson.data.at(0)!} />}
      {lesson.type === 'DAILY_TEST' && (
        <DailyTest lesson={lesson.data} day={day} levelId={id as never} />
      )}
    </>
  );
}
