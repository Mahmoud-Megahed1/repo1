import { useAuth } from '@components/contexts/auth-context';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import useLocale from '@hooks/use-locale';
import {
  cn,
  formatDate,
  getInitials,
  localizedNumber,
  oneDayBefore,
} from '@lib/utils';
import Certification from '@modules/levels/components/certification';
import { usePayment } from '@modules/levels/mutations';
import { Link } from '@shared/i18n/routing';
import type { LevelId } from '@shared/types/entities';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Progress } from '@ui/progress';
import {
  AlertTriangle,
  BookOpen,
  Circle,
  CircleCheck,
  Mail,
  RefreshCcw,
  User,
} from 'lucide-react';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/app/account'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { levelsDetails, user } = useAuth();
  const {
    firstName,
    lastName,
    isVerified,
    email,
    status,
    createdAt,
    lastActivity,
  } = user!;
  const name = firstName + ' ' + lastName;
  const numberOfCompletedLevels = levelsDetails?.filter(
    (level) => level.isCompleted
  ).length;

  const normalizedLevels = levelsDetails?.map((level) => ({
    ...level,
    title: t('Global.level', { level: level.levelName.split('_')[1] }),
    progress: (level.currentDay / 50) * 100,
    levelId: level.levelName as LevelId,
  }));

  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  const progress = {
    value: (numberOfCompletedLevels! / 6) * 100,
    fraction:
      localizedNumber(numberOfCompletedLevels!, locale) +
      ' / ' +
      localizedNumber(6, locale),
    percentage: Math.round((numberOfCompletedLevels! / 6) * 100),
  };
  useEffect(() => {
    useBreadcrumbStore
      .getState()
      .setItems([{ label: t('Global.account'), isCurrent: true }]);
  }, [t]);
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-bold">{t('Global.accountOverview')}</h1>
        <p className="text-muted-foreground text-sm">
          {t('Global.accountDescription')}
        </p>
      </div>
      <Card lang="en">
        <CardHeader className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl text-white shadow-lg">
            <b>{getInitials(name)}</b>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{name}</CardTitle>
              <Badge variant={isVerified ? 'success' : 'info-yellow'}>
                {isVerified ? (
                  <>{t('Global.verified')}</>
                ) : (
                  t('Global.notVerified')
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Mail className="size-5" />
              <span>{email}</span>
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-4">
          <div className="to-primary dark:to-secondary rounded-xl bg-gradient-to-br from-[#96796e] p-3 shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">
            {t('Global.personalInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="text-muted-foreground flex items-center justify-between text-sm sm:text-base">
              <span className="font-medium">{t('Global.status')}</span>
              <Badge variant={status === 'active' ? 'success' : 'info-yellow'}>
                {status === 'active'
                  ? t('Global.active')
                  : t('Global.inactive')}
              </Badge>
            </li>
            <li className="text-muted-foreground flex items-center justify-between text-sm sm:text-base">
              <span className="font-medium">{t('Global.lastActivity')}</span>
              <span>{new Date(lastActivity).toLocaleString(locale)}</span>
            </li>
            <li className="text-muted-foreground flex items-center justify-between text-sm sm:text-base">
              <span className="font-medium">{t('Global.memberSince')}</span>
              <span>{new Date(createdAt).toLocaleDateString(locale)}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-3 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">
                {t('Global.learningProgress')}
              </CardTitle>
              <CardDescription>
                {t('Global.progressDescription')}
              </CardDescription>
            </div>
          </div>
          <div className="mx-auto flex flex-col text-center sm:mx-0 sm:text-end">
            <b className="text-3xl text-green-600">{progress.fraction}</b>
            <span className="text-muted-foreground text-sm">
              {t('Global.levelsCompleted')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('Global.overallProgress')}
              </span>
              <span className="text-sm font-medium text-green-600">
                {localizedNumber(progress.percentage, locale)}%
              </span>
            </div>
            <Progress
              value={progress.value}
              className="h-2 [&_[data-slot=progress-indicator]]:bg-green-600"
            />
          </div>
          <ul className="space-y-4">
            {normalizedLevels?.map(({ isCompleted, isExpired, ...level }) => (
              <LevelCard
                key={level.levelName}
                variants={
                  isExpired
                    ? 'expired'
                    : isCompleted
                      ? 'completed'
                      : 'inProgress'
                }
                name={name}
                {...level}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

type Props =
  | {
      variants?: 'completed';
      title: string;
      levelId: LevelId;
      name: string;
      expiresAt: string;
    }
  | {
      variants?: 'inProgress';
      title: string;
      currentDay: string | number;
      levelId: LevelId;
      progress: number;
      expiresAt: string;
    }
  | {
      variants?: 'expired';
      title: string;
      levelId: LevelId;
      expiresAt: string;
    };
const LevelCard: FC<Props> = (props = { variants: 'inProgress' } as Props) => {
  const Icon =
    props.variants === 'expired'
      ? AlertTriangle
      : props.variants === 'completed'
        ? CircleCheck
        : Circle;
  const { t } = useTranslation();
  const locale = useLocale();
  const { mutate, isPending } = usePayment(props.levelId);

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 rounded-xl border-2 p-4 sm:flex-row sm:items-center',
        {
          'border-muted-foreground/20 bg-accent/40':
            props.variants === 'inProgress',
          'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300':
            props.variants === 'completed',
          'border-destructive/50 bg-destructive/10 text-destructive':
            props.variants === 'expired',
        }
      )}
    >
      <div className="flex items-center gap-4">
        <Icon
          className={cn('shrink-0', {
            'text-muted-foreground': props.variants === 'inProgress',
          })}
        />
        <div>
          <Link
            to="/app/levels/$id"
            params={{ id: props.levelId }}
            className={cn('text-lg font-medium hover:underline', {
              'hover:no-underline': props.variants === 'expired',
            })}
            disabled={props.variants === 'expired'}
          >
            {props.title}
          </Link>
          <p
            className={cn('text-xs', {
              'text-muted-foreground': props.variants === 'inProgress',
              'dark:text-green-500': props.variants === 'completed',
            })}
          >
            {props.variants === 'completed' &&
              t('Global.completedSuccessfully')}
            {props.variants === 'inProgress' &&
              localizedNumber(+props.currentDay, locale) +
                ' / ' +
                localizedNumber(50, locale) +
                ' ' +
                t('Global.daysCompleted')}
            {props.variants === 'expired' && t('Global.expired')}
          </p>
        </div>
      </div>
      {props.variants === 'inProgress' && (
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <div className="flex items-center justify-between gap-px md:flex-col md:items-baseline">
            <span className="text-muted-foreground text-xs">
              {t('Global.expiresAt')}
            </span>
            <span className="text-sm font-semibold">
              {formatDate(props.expiresAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress
              value={props.progress}
              className="h-2 md:w-28 [&_[data-slot=progress-indicator]]:bg-blue-500"
            />
            <span className="text-muted-foreground text-xs">
              {localizedNumber(props.progress, locale)}%
            </span>
          </div>
        </div>
      )}
      {props.variants === 'completed' && (
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <div className="flex items-center justify-between gap-px md:flex-col md:items-baseline">
            <span className="text-muted-foreground text-xs">
              {t('Global.validUntil')}
            </span>
            <span className="text-sm font-semibold text-green-500">
              {formatDate(oneDayBefore(props.expiresAt))}
            </span>
          </div>
          <Certification
            levelId={props.levelId}
            name={props.name}
            canCertificate={true}
            variant={'success'}
            className="bg-green-500 text-white hover:bg-green-500/80 hover:text-white dark:bg-green-600 dark:font-medium dark:text-white dark:hover:bg-green-600/80 dark:hover:text-white"
          />
        </div>
      )}
      {props.variants === 'expired' && (
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <div className="flex items-center justify-between gap-px md:flex-col md:items-baseline">
            <span className="text-muted-foreground text-xs">
              {t('Global.expiredOn')}
            </span>
            <span className="text-destructive text-sm font-semibold">
              {formatDate(props.expiresAt)}
            </span>
          </div>
          <Button
            variant={'destructive'}
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? t('Global.processing') : t('Global.renew')}{' '}
            <RefreshCcw />
          </Button>
        </div>
      )}
    </div>
  );
};
