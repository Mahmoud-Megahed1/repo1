import { AudioPlayback } from '@components/audio-playback';
import { useAuth } from '@components/contexts/auth-context';
import { WithBackButton } from '@components/go-back-button';
import { XIcon } from '@components/icons';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import useLocale from '@hooks/use-locale';
import usePageTitle from '@hooks/use-page-title';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { localizedNumber } from '@lib/utils';
import { useCombineLevelAudios } from '@modules/lessons/mutations';
import { useGetCombinedLevelAudio } from '@modules/lessons/queries';
import Certification from '@modules/levels/components/certification';
import DayCard from '@modules/levels/components/day-card';
import LevelGuard from '@modules/levels/components/level-guard';
import { useLocalizedLevelById } from '@modules/levels/queries';
import type { LevelId } from '@shared/types/entities';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';
import { Progress } from '@ui/progress';
import {
  Calendar,
  Check,
  Clipboard,
  Clock,
  Facebook,
  Linkedin,
  PlayCircle,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/app/levels/$id/'
)({
  component: RouteComponent,
  onEnter: ({ params: { id } }) => {
    useSidebarStore.getState().handleActiveItem('Levels');
    useBreadcrumbStore.getState().setItems([
      { label: 'Levels', href: '/app/levels' },
      { label: `Level ${id.split('_')[1]}`, isCurrent: true },
    ]);
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const levelId = useParams({
    from: Route.id,
  }).id! as LevelId;

  const locale = useLocale();
  const { level } = useLocalizedLevelById(levelId, locale);
  const levelLabel = t('Global.level', { level: levelId.split('_')[1] });

  const { levelsDetails } = useAuth();
  const { currentDay = 0, isCompleted: isLevelCompleted = false } =
    levelsDetails?.find((level) => level.levelName === levelId) || {};

  const cards = [
    {
      id: 'totalDays',
      title: t('Global.totalDays'),
      value: localizedNumber(50, locale),
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      id: 'dailyTime',
      title: t('Global.dailyTime'),
      value:
        (locale === 'ar' ? '٤٠-٦٠' : '40-60') + ' ' + t('Global.minPerDay'),
      icon: Clock,
      color: 'text-green-600',
    },
    {
      id: 'progress',
      title: t('Global.progress'),
      value:
        locale === 'en'
          ? `${currentDay}/50`
          : `${localizedNumber(50, locale)}/${localizedNumber(currentDay, locale)}`,
      icon: Trophy,
      color: 'text-orange-400',
    },
  ] as const;

  useUpdateBreadcrumbs(levelId);
  usePageTitle(levelLabel);
  const shareUrl = `${window.location.origin}/${locale}/share-progress?${encodeURIComponent(`day=${currentDay}&level=${levelId}&name=${user?.firstName + ' ' + user?.lastName}`)}`;

  const socialShare = [
    {
      platform: 'facebook',
      icon: (
        <Facebook className="hover:text-muted-foreground text-muted-foreground/50 duration-150" />
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      platform: 'twitter',
      icon: (
        <XIcon className="hover:fill-muted-foreground fill-muted-foreground/50 duration-150" />
      ),
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      platform: 'linkedin',
      icon: (
        <Linkedin className="hover:text-muted-foreground text-muted-foreground/50 duration-150" />
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];
  return (
    <LevelGuard levelId={levelId}>
      <div className="flex h-full flex-col">
        <header className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
          <WithBackButton className="items-start">
            <div>
              <h1 className="text-2xl font-bold">{level.title}</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {level.description}
              </p>
            </div>
          </WithBackButton>
          <Certification
            levelId={levelId}
            name={user?.firstName + ' ' + user?.lastName}
            canCertificate={currentDay === 50}
          />
        </header>
        <section className="mt-4 space-y-4 md:px-12">
          <ul className="grid gap-4 md:grid-cols-3">
            {cards.map(({ icon: Icon, title, value, color, id }) => (
              <li key={title}>
                <Card>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className={`size-8 md:size-10 ${color}`} />
                      <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className={`text-lg font-bold md:text-xl ${color}`}>
                          {value}
                        </p>
                      </div>
                    </div>
                    {id === 'progress' && (
                      <ul className="text-muted-foreground/50 flex items-center gap-2 [&_svg]:size-5">
                        {socialShare.map(({ platform, icon, url }) => (
                          <li key={platform}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {icon}
                            </a>
                          </li>
                        ))}
                        <li>
                          <CopyToClipboard
                            text={decodeURIComponent(shareUrl)}
                            className="hover:text-muted-foreground duration-150"
                          />
                        </li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('Global.overallProgress')}
              </span>
              <span className="text-muted-foreground text-sm">
                {Math.round((currentDay / 50) * 100)}% {t('Global.complete')}
              </span>
            </div>
            <Progress
              value={Math.round((currentDay / 50) * 100)}
              className="h-3 rtl:rotate-180 [&_[data-slot=progress-indicator]]:bg-orange-400"
            />
            {isLevelCompleted && <GetCombinedAudio levelName={levelId} />}
            <div className="mt-4">
              <h2 className="mb-6 text-xl font-bold md:text-2xl">
                {t('Global.learning-journey-50-days')}
              </h2>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 50 }, (_, i) => (
                  <li key={i}>
                    <DayCard
                      dayNumber={i + 1}
                      levelId={levelId}
                      duration={locale === 'ar' ? '٤٠-٦٠' : '60-40'}
                      variant={
                        i + 1 < currentDay || isLevelCompleted
                          ? 'completed'
                          : i + 1 === currentDay
                            ? 'pending'
                            : 'locked'
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </LevelGuard>
  );
}

function useUpdateBreadcrumbs(levelId: LevelId) {
  const { t } = useTranslation();
  const levelLabel = t('Global.level', { level: levelId.split('_')[1] });
  useEffect(() => {
    useBreadcrumbStore.getState().setItems([
      { label: t('Global.sidebarItems.levels'), href: '/app/levels' },
      {
        label: levelLabel,
        isCurrent: true,
      },
    ]);
  }, [levelLabel, t]);
}

const GetCombinedAudio = ({ levelName }: { levelName: LevelId }) => {
  const { t } = useTranslation();
  const { isLoading, data } = useGetCombinedLevelAudio(levelName);
  const { mutate, isPending } = useCombineLevelAudios(levelName);
  return (
    <Card className="mt-8">
      <CardContent>
        <div className="flex flex-col justify-between gap-4 gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-success/10 rounded-lg p-3">
              <Trophy className="text-success h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t('Global.congratulations')} 🎉
              </h3>
              <p className="text-muted-foreground">
                {t('Global.youHaveCompletedDays')}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-auto">
            <Button
              disabled={isPending || isLoading}
              className="w-full bg-green-500/90 hover:bg-green-500 md:w-auto"
              onClick={() => mutate()}
            >
              <PlayCircle className="h-5 w-5" />
              {isLoading || isPending
                ? t('Global.generatingAudio') + '...'
                : t('Global.getCombinedAudio')}
            </Button>
          </div>
        </div>
        {data?.data && (
          <AudioPlayback
            audioSrc={data.data.url}
            className="dark:bg-accent/30 mt-8"
            download={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

const CopyToClipboard = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <a href="#" onClick={handleCopy} className={className}>
      {copied ? <Check /> : <Clipboard />}
    </a>
  );
};
