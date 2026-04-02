import { accordionVariants } from '@components/custom-accordion';
import { RiyalSymbol } from '@components/icons';
import { cn, formatDate, oneDayBefore } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import type { LevelId } from '@shared/types/entities';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Skeleton } from '@ui/skeleton';
import {
  AlertTriangle,
  CircleCheck,
  Clock,
  KeyRound,
  type LucideIcon,
  MoveRight,
  RefreshCw,
} from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayment } from '../mutations';
type ComponentVariant = Record<
  'coming-soon' | 'locked' | 'unlocked' | 'expired',
  {
    iconBg: 'green' | 'default' | 'amber' | 'destructive';
    badge?: React.ReactNode;
    iconClassname?: string;
    labelVariant: 'success' | 'default' | 'amber-gradient' | 'destructive';
    content?: React.ReactNode;
    cta: React.ReactNode;
    className?: string;
    descriptionClassName?: string;
  }
>;

export type LevelCardProps = {
  levelId: LevelId;
  title: string;
  description: string;
  levelLabel: string;
  icon: LucideIcon;
  price: number;
  variant?: 'unlocked' | 'locked' | 'coming-soon' | 'expired';
  isCompleted?: boolean;
  expiresAt?: string;
  previousLevelCompleted?: boolean;
};

const LevelCard: FC<LevelCardProps> = ({
  description,
  icon: Icon,
  levelId,
  levelLabel,
  price,
  title,
  variant = 'locked',
  isCompleted = false,
  expiresAt,
  previousLevelCompleted = false,
}) => {
  const {
    cta,
    iconBg,
    badge,
    labelVariant,
    content,
    className,
    descriptionClassName,
    iconClassname,
  } = useComponentVariant({
    levelId,
    price,
    expiresAt,
    variant,
    isCompleted,
    previousLevelCompleted,
  });
  return (
    <Card className={cn('relative', className)}>
      {badge}
      <CardHeader>
        <div
          className={cn(
            accordionVariants({
              variant: iconBg,
              className: 'mx-auto w-fit',
            })
          )}
        >
          <Icon className={cn('size-16 text-white', iconClassname)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          </div>
          <Badge variant={labelVariant}>{levelLabel}</Badge>
        </div>
        <CardDescription
          className={cn('text-muted-foreground', descriptionClassName)}
        >
          {description}
        </CardDescription>
        {content}
      </CardContent>
      <CardFooter className="mt-auto">{cta}</CardFooter>
    </Card>
  );
};

const useComponentVariant = ({
  levelId,
  price,
  expiresAt,
  variant = 'locked',
  isCompleted = false,
  previousLevelCompleted = false,
}: {
  levelId: LevelId;
  price: number;
  expiresAt?: string;
  variant?: 'unlocked' | 'locked' | 'coming-soon' | 'expired';
  isCompleted?: boolean;
  previousLevelCompleted?: boolean;
}) => {
  const { mutate, isPending } = usePayment(levelId);
  const { t } = useTranslation();

  const daysLeft = expiresAt
    ? Math.ceil(
      (new Date(expiresAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  // Calculate discount prices
  const renewalPrice = Math.round(price * 0.25); // Renewal: pay 25% of original
  const upgradePrice = Math.round(price * 0.85); // Upgrade: 15% off

  const variants: ComponentVariant = {
    'coming-soon': {
      iconBg: 'amber',
      labelVariant: 'amber-gradient',
      content: (
        <div className="space-y-2">
          <p className="flex items-center">
            <span className="text-muted-foreground pe-2 text-sm">
              {t('Global.price')}
            </span>
            <span className="inline-flex items-center gap-1 font-bold">
              <RiyalSymbol className="size-4" />
              {price}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            <Clock size={14} />
            {t('Global.forSixtyDays')}
          </p>
          {/* @ts-ignore JSX custom element */}
          {price > 0 && <tamara-widget type="tamara-summary" amount={price} inline-type="2"></tamara-widget>}
        </div>
      ),
      cta: (
        <Button
          className={cn(
            accordionVariants({
              variant: 'amber',
              className: 'w-full cursor-not-allowed dark:text-white',
            })
          )}
        >
          {t('Global.comingSoon')}
        </Button>
      ),
    },
    locked: {
      iconBg: 'default',
      labelVariant: 'default',
      cta: (
        <Button
          className="w-full"
          onClick={() => mutate()}
          disabled={isPending}
        >
          {isPending ? t('Global.processing') : previousLevelCompleted ? t('Global.unlock') + ' (-15%)' : t('Global.unlock')}
          <KeyRound />
        </Button>
      ),
      content: previousLevelCompleted ? (
        <div className="space-y-2">
          <p className="flex items-center gap-2 rounded-md border-green-200 bg-green-100 px-3 py-1.5 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300 text-sm font-semibold">
            {t('Global.upgradeDiscount')}
          </p>
          <p className="flex items-center">
            <span className="text-muted-foreground pe-2 text-sm">
              {t('Global.originalPrice')}
            </span>
            <span className="inline-flex items-center gap-1 font-bold line-through opacity-50">
              <RiyalSymbol className="size-4" />
              {price}
            </span>
          </p>
          <p className="flex items-center">
            <span className="text-muted-foreground pe-2 text-sm">
              {t('Global.price')}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-green-600 dark:text-green-400">
              <RiyalSymbol className="size-4" />
              {upgradePrice}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            <Clock size={14} />
            {t('Global.forSixtyDays')}
          </p>
          {/* @ts-ignore JSX custom element */}
          {upgradePrice > 0 && <tamara-widget type="tamara-summary" amount={upgradePrice} inline-type="2"></tamara-widget>}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="flex items-center">
            <span className="text-muted-foreground pe-2 text-sm">
              {t('Global.price')}
            </span>
            <span className="inline-flex items-center gap-1 font-bold">
              <RiyalSymbol className="size-4" />
              {price}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            <Clock size={14} />
            {t('Global.forSixtyDays')}
          </p>
          {/* @ts-ignore JSX custom element */}
          {price > 0 && <tamara-widget type="tamara-summary" amount={price} inline-type="2"></tamara-widget>}
        </div>
      ),
    },
    unlocked: {
      className: 'border border-green-500/50',
      iconBg: 'green',
      labelVariant: 'success',
      badge: isCompleted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-br from-green-500 to-green-700 px-3 py-1 text-xs font-semibold">
            <CircleCheck className="h-3 w-3" />
            {t('Global.completed')}
          </span>
        </div>
      ),
      content: (
        <p className="flex items-center gap-2 rounded-md border-green-200 bg-green-100 px-3 py-2 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          <Clock size={20} />
          <span className="flex w-full flex-wrap items-center justify-between text-sm font-semibold">
            {t('Global.validUntil')} {formatDate(oneDayBefore(expiresAt!))}
            <span className="text-xs">
              {daysLeft} {t('Global.daysLeft')}
            </span>
          </span>
        </p>
      ),
      cta: (
        <Button variant={'success'} className="w-full" asChild>
          <Link
            to="/app/levels/$id"
            params={{ id: levelId }}
            className="flex items-center gap-2"
          >
            {t('Global.startLearning')}
            <MoveRight className="rtl:rotate-180" />
          </Link>
        </Button>
      ),
    },
    expired: {
      className: 'text-destructive',
      descriptionClassName: 'text-destructive',
      iconBg: 'destructive',
      labelVariant: 'destructive',
      badge: (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-destructive dark:bg-destructive/60 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white">
            <AlertTriangle className="h-3 w-3" />
            {t('Global.expired')}
          </span>
        </div>
      ),
      content: (
        <div className="space-y-2">
          <p className="border-destructive/20 bg-destructive/20 text-destructive dark:border-destructive dark:bg-destructive/20 flex items-center gap-2 rounded-md px-3 py-2">
            <Clock size={20} />
            <span className="text-sm font-semibold">
              {t('Global.expiredOn')} {formatDate(expiresAt)}
            </span>
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <p className="flex items-center">
              <span className="text-muted-foreground pe-2 text-sm">
                <b>{t('Global.originalPrice')}:</b>
              </span>
              <span className="inline-flex items-center gap-1 font-bold line-through opacity-50">
                <RiyalSymbol className="size-4" />
                {price}
              </span>
            </p>
            <p className="flex items-center">
              <span className="text-muted-foreground pe-2 text-sm">
                <b>{t('Global.renewalPrice')}:</b>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-green-600 dark:text-green-400">
                <RiyalSymbol className="size-4" />
                {renewalPrice}
              </span>
            </p>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              <Clock size={14} />
              {t('Global.forSixtyDays')}
            </p>
            {/* @ts-ignore JSX custom element */}
            {renewalPrice > 0 && <tamara-widget type="tamara-summary" amount={renewalPrice} inline-type="2"></tamara-widget>}
          </div>
        </div>
      ),
      cta: (
        <Button
          variant={'destructive'}
          onClick={() => mutate()}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? t('Global.processing') : t('Global.renewSubscription')}
          <RefreshCw className="rtl:rotate-180" />
        </Button>
      ),
    },
  };
  return variants[variant];
};

export const CardSkeleton = () =>
  Array.from({ length: 6 }, (_, i) => (
    <Card key={i}>
      <CardHeader>
        <Skeleton className="mx-auto size-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="mt-auto">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  ));

export default LevelCard;
