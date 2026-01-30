import { useAuth } from '@components/contexts/auth-context';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import useInsights from '@hooks/use-insights';
import usePageTitle from '@hooks/use-page-title';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import Achievements from '@modules/insights/components/achievements';
import CurrentLevelProgress from '@modules/insights/components/current-level-progress';
import LevelsOverview from '@modules/insights/components/levels-overview';
import QuickAccess from '@modules/insights/components/quick-access';
import ReadyToStart from '@modules/insights/components/ready-to-start';
import StatsOverview from '@modules/insights/components/stats-overview';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Constants
const ROUTE_PATH = '/$locale/_globalLayout/_auth/app/' as const;
const HOME_SIDEBAR_ID = 'Home' as const;

export const Route = createFileRoute(ROUTE_PATH)({
  component: RouteComponent,
  onEnter: () => {
    useSidebarStore.getState().handleActiveItem(HOME_SIDEBAR_ID);
  },
});

export function RouteComponent() {
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    useBreadcrumbStore
      .getState()
      .setItems([{ label: t('Global.sidebarItems.home'), isCurrent: true }]);
  }, [t]);

  usePageTitle(t('Global.sidebarItems.home'));

  const { currentLevel } = useInsights();
  return (
    <div className="container space-y-8 pt-4">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('App.dashboard.welcome', {
            name: user?.firstName || t('App.dashboard.defaultName'),
          })}
        </h1>
        <p className="text-muted-foreground">{t('App.dashboard.subtitle')}</p>
      </div>

      <StatsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {currentLevel ? <CurrentLevelProgress /> : <ReadyToStart />}
          <QuickAccess />
        </div>

        <div className="space-y-6">
          <Achievements />
          <LevelsOverview />
        </div>
      </div>
    </div>
  );
}
