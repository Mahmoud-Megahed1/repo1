import { useLessonQuery, type LessonName } from '@modules/lessons/queries';
import type { LevelId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { createContext, useContext } from 'react';
type Lesson = ReturnType<typeof useLessonQuery>;

const LessonContext = createContext<Lesson | undefined>(undefined);

function LessonProvider({ children }: { children: React.ReactNode }) {
  const {
    id: levelId,
    day,
    lessonName,
  } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  return (
    <LessonContext.Provider
      value={useLessonQuery({
        day,
        levelId: levelId as LevelId,
        lessonName: lessonName as LessonName,
      })}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function withLessonProvider<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P) => (
    <LessonProvider>
      <Component {...props} />
    </LessonProvider>
  );
}

export function useLessonContext() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error(
      'useLessonContext must be used within a LessonContext.Provider'
    );
  }
  return context;
}
