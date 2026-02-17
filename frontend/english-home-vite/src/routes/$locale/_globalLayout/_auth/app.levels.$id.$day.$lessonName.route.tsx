import ComingSoon from '@components/coming-soon';
import { useAuth } from '@components/contexts/auth-context';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import usePageTitle from '@hooks/use-page-title';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { useLessonContext, withLessonProvider } from '@modules/lessons/context';
import DayAccessError from '@modules/levels/components/day-access-error';
import LevelGuard from '@modules/levels/components/level-guard';
import { getCompletedTasks } from '@modules/levels/services';
import { LESSONS_SIDEBAR_DEFAULT_ITEMS, LESSONS_IDS } from '@shared/constants';
import type { LevelId } from '@shared/types/entities';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import BookLoader from '@ui/book-loader';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollArrows from '@components/scroll-arrows';
import { GlobalAiChat } from '@modules/lessons/components/global-ai-chat';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName'
)({
  component: withLessonProvider(RouteComponent),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { id: levelId, day, lessonName } = useParams({ from: Route.id });
  const { isEmpty, isFetching } = useLessonContext();
  const { levelsDetails } = useAuth();
  const currentDay =
    levelsDetails?.find(({ levelName }) => levelName === levelId)?.currentDay ||
    1;
  const canAccessDay = +day <= currentDay;

  // Fetch completed tasks for this day
  const { data: completedTasks, refetch } = useQuery({
    queryKey: ['completedTasks', levelId, +day],
    queryFn: () => getCompletedTasks(levelId as LevelId, +day),
  });

  // Force refetch when navigating between lessons to ensure latest status
  useEffect(() => {
    refetch();
  }, [lessonName, refetch]);

  // Handle Sidebar Lifecycle (Update)
  useEffect(() => {
    const defaultItems = LESSONS_SIDEBAR_DEFAULT_ITEMS(levelId as LevelId, day, t as never);
    const completed = completedTasks?.data || [];

    const updatedItems = defaultItems.map((item) => ({
      ...item,
      isCompleted: completed.includes(item.id),
    }));

    useSidebarStore.getState().setItems(updatedItems);
  }, [completedTasks?.data, levelId, day, t]);

  // Separate effect for unmount cleanup
  useEffect(() => {
    return () => {
      useSidebarStore.getState().resetItems();
    };
  }, []);

  useUpdateBreadcrumb({ levelId, day, lessonName });
  usePageTitle(t(`Global.sidebarItems.${lessonName}` as never));
  if (!canAccessDay)
    return (
      <LevelGuard levelId={levelId as LevelId}>
        <DayAccessError
          day={+day}
          levelId={levelId as LevelId}
          currentDay={currentDay}
          lessonName={lessonName}
        />
      </LevelGuard>
    );
  // Calculate if all prerequisite tasks are completed (excluding DAILY_TEST and TODAY itself)
  const areAllTasksCompleted = LESSONS_IDS
    .filter(id => id !== 'DAILY_TEST' && id !== 'TODAY')
    .every(id => completedTasks?.data?.includes(id));

  return (
    <LevelGuard levelId={levelId as LevelId}>
      {isFetching ? (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 py-10">
          <BookLoader className="text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            {t('Global.loadingLesson' as any) || 'Loading Lesson...'}
          </p>
        </div>
      ) : isEmpty ? (
        <ComingSoon />
      ) : (
        <div key={lessonName} className="py-8 space-y-6">
          {completedTasks?.data?.includes(lessonName) && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <CheckCircle2 className="w-6 h-6" />
              <span>{t('Global.lessonCompleted' as any)}</span>
            </div>
          )}
          <Outlet />
        </div>
      )}
      <ScrollArrows />
      <GlobalAiChat isLessonCompleted={areAllTasksCompleted} />
    </LevelGuard>
  );
}

const useUpdateBreadcrumb = ({
  levelId,
  day,
  lessonName,
}: {
  levelId: string;
  day: string;
  lessonName: string;
}) => {
  const setItems = useBreadcrumbStore((state) => state.setItems);
  const { t } = useTranslation();
  const { levelsDetails } = useAuth();
  const currentDay =
    levelsDetails?.find(({ levelName }) => levelName === levelId)?.currentDay ||
    1;
  useEffect(() => {
    setItems([
      {
        label: t('Global.level', { level: levelId.split('_')[1] }),
        href: `/app/levels/${levelId}` as never,
        type: 'dropDownMenu',
        items: levelsDetails!.map(({ levelName }) => ({
          label: t('Global.level', { level: levelName.split('_')[1] }),
          href: `/app/levels/${levelName}/${day}/${lessonName}` as never,
          isCurrent: levelId === levelName,
        })),
      },
      {
        label: t('Global.day') + ' ' + day,
        type: 'dropDownMenu',
        items: Array.from({ length: currentDay }, (_, i) => ({
          label: t('Global.day') + ' ' + (i + 1),
          href: `/app/levels/${levelId}/${i + 1}/${lessonName}` as never,
          isCurrent: day === String(i + 1),
        })),
      },
    ]);
  }, [currentDay, day, lessonName, levelId, levelsDetails, setItems, t]);
};

