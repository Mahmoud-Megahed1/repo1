import { useAuth } from '@components/contexts/auth-context';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import useLocale from '@hooks/use-locale';
import usePageTitle from '@hooks/use-page-title';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { cn, getLevelVariant } from '@lib/utils';
import LevelCard, { CardSkeleton } from '@modules/levels/components/level-card';
import { useLocalizedLevels } from '@modules/levels/queries';
import { createFileRoute } from '@tanstack/react-router';
import { useSidebar } from '@ui/sidebar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/app/levels/'
)({
  component: RouteComponent,
  onEnter: () => {
    useSidebarStore.getState().handleActiveItem('Levels');
  },
});

function RouteComponent() {
  const { open } = useSidebar();
  const locale = useLocale();
  const { localizedLevels, isLoading } = useLocalizedLevels(locale);
  const { levelsDetails } = useAuth();
  const { t } = useTranslation();
  const normalizedLevels =
    localizedLevels?.map(({ isAvailable, levelId, ...rest }) => ({
      ...rest,
      levelId,
      expiresAt: levelsDetails.find((level) => level.levelName === levelId)
        ?.expiresAt,
      isCompleted: levelsDetails.find((level) => level.levelName === levelId)
        ?.isCompleted,
      variant: getLevelVariant({
        isAvailable,
        levelId,
        userLevels: levelsDetails,
      }),
    })) || [];
  useEffect(() => {
    useBreadcrumbStore
      .getState()
      .setItems([{ label: t('Global.sidebarItems.levels'), isCurrent: true }]);
  }, [t]);
  usePageTitle(t('Global.sidebarItems.levels'));
  return (
    <div>
      <h1 className="mx-auto my-4 mb-12 w-fit text-3xl font-bold">
        {t('Global.chooseYourLevel')}
      </h1>
      <div
        className={cn('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', {
          'lg:grid-cols-4': !open,
        })}
      >
        {isLoading ? (
          <CardSkeleton />
        ) : (
          normalizedLevels.map((level) => (
            <LevelCard key={level.levelId} {...level} />
          ))
        )}
      </div>
    </div>
  );
}
