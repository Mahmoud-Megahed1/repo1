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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayment } from '../mutations';
import { useDiscountEligibility, useActiveCourse } from '../queries';
import PurchaseAgreementModal from './purchase-agreement-modal';
import ActiveCourseConflictModal from './active-course-conflict-modal';

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
  originalPrice?: number;
  variant?: 'unlocked' | 'locked' | 'coming-soon' | 'expired';
  isCompleted?: boolean;
  expiresAt?: string;
  previousLevelCompleted?: boolean;
  daysCount?: number;
};

const LevelCard: FC<LevelCardProps> = ({
  description,
  levelId,
  levelLabel,
  price,
  originalPrice,
  title,
  variant = 'locked',
  isCompleted = false,
  expiresAt,
  previousLevelCompleted = false,
  daysCount = 50,
}) => {
  const { t } = useTranslation();
  const {
    cta,
    badge,
    content,
    className,
  } = useComponentVariant({
    levelId,
    price,
    originalPrice,
    expiresAt,
    variant,
    isCompleted,
    previousLevelCompleted,
    daysCount,
  });

  const getGradient = (id: string) => {
    switch (id) {
      case 'LEVEL_A1': return 'from-[#279B5A] via-[#279B5A]/20 to-transparent';
      case 'LEVEL_A2': return 'from-[#E27625] via-[#E27625]/20 to-transparent';
      case 'LEVEL_B1': return 'from-[#D4A346] via-[#D4A346]/20 to-transparent';
      case 'LEVEL_B2': return 'from-[#D94579] via-[#D94579]/20 to-transparent';
      case 'LEVEL_C1': return 'from-[#297BCE] via-[#297BCE]/20 to-transparent';
      case 'LEVEL_C2': return 'from-[#8A21C6] via-[#8A21C6]/20 to-transparent';
      default: return 'from-gray-600 via-gray-900/20 to-transparent';
    }
  };

  return (
    <Card className={cn('relative overflow-hidden border-none bg-[#1C1C1E] text-white', className)}>
      <div className={cn("absolute inset-0 h-2/3 bg-gradient-to-b opacity-80 pointer-events-none", getGradient(levelId))} />
      
      {/* Top Days Badge */}
      <div className="absolute top-4 rtl:left-4 ltr:right-4 z-10">
        <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          {t('Global.forDays', { count: daysCount })}
        </span>
      </div>

      <CardHeader className="relative z-10 pt-10 text-center pb-2">
        <div className="text-lg font-medium mb-1 drop-shadow-md">(Track {levelLabel})</div>
        <CardTitle className="text-2xl font-bold drop-shadow-md">{title}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Pricing Area */}
        <div className="flex flex-col items-center justify-center pt-2">
          {content}
        </div>

        {/* Features List */}
        <div className="w-fit mx-auto">
          <ul className="space-y-2.5">
            {(
              (t(`Landing.levels.${levelId}.features`, {
                returnObjects: true,
              }) as string[]) || []
            ).map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-3 text-sm text-gray-200">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 mt-auto pt-4">
        {cta}
      </CardFooter>
    </Card>
  );
};

const useComponentVariant = ({
  levelId,
  price,
  originalPrice,
  expiresAt,
  variant = 'locked',
  isCompleted = false,
  previousLevelCompleted = false,
  daysCount = 50,
}: {
  levelId: LevelId;
  price: number;
  originalPrice?: number;
  expiresAt?: string;
  variant?: 'unlocked' | 'locked' | 'coming-soon' | 'expired';
  isCompleted?: boolean;
  previousLevelCompleted?: boolean;
  daysCount?: number;
}) => {
  const { mutate, isPending } = usePayment(levelId);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showAgreement, setShowAgreement] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  
  const { data: discountData } = useDiscountEligibility();
  const { data: activeCourse } = useActiveCourse();
  const discountPercentage = discountData?.discountPercentage || 0;
  const discountedPrice = discountPercentage > 0 
    ? Math.round(price - (price * (discountPercentage / 100))) 
    : price;

  const daysLeft = expiresAt
    ? Math.ceil(
      (new Date(expiresAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  // Calculate discount prices
  const renewalPrice = Math.round(price * 0.25); // Renewal: pay 25% of original

  const variants: ComponentVariant = {
    'coming-soon': {
      iconBg: 'amber',
      labelVariant: 'amber-gradient',
      content: (
        <div className="flex flex-col items-center gap-0.5 drop-shadow-sm">
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-3xl font-bold font-sans text-white leading-none tracking-tight">{price}</span>
            <RiyalSymbol className="size-5 text-white" />
          </div>
          {originalPrice && originalPrice > price && (
            <div className="flex items-center gap-1 text-gray-300 line-through decoration-gray-400">
              <span className="text-sm font-sans">{originalPrice}</span>
              <RiyalSymbol className="size-3" />
            </div>
          )}
          {/* @ts-ignore JSX custom element */}
          {price > 0 && <div className="mt-2 w-full max-w-[200px] bg-white/10 rounded-md p-1 backdrop-blur-sm"><tamara-widget type="tamara-summary" amount={price} inline-type="2"></tamara-widget></div>}
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
        <>
          <Button
            className="w-full"
            onClick={() => {
              // Check if user has an active course that's different from this one
              if (activeCourse && activeCourse.levelName !== levelId) {
                setShowConflict(true);
              } else {
                setShowAgreement(true);
              }
            }}
            disabled={isPending}
          >
            {isPending ? t('Global.processing') : (previousLevelCompleted && discountPercentage > 0) ? t('Global.unlock') + ` (-${discountPercentage}%)` : t('Global.unlock')}
            <KeyRound />
          </Button>
          <PurchaseAgreementModal
            open={showAgreement}
            onOpenChange={setShowAgreement}
            onAccept={() => {
              setShowAgreement(false);
              mutate();
            }}
            isPending={isPending}
          />
          {activeCourse && (
            <ActiveCourseConflictModal
              open={showConflict}
              onOpenChange={setShowConflict}
              activeCourse={activeCourse}
            />
          )}
        </>
      ),
      content: (previousLevelCompleted && discountPercentage > 0) ? (
        <div className="flex flex-col items-center gap-0.5 drop-shadow-sm">
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-3xl font-bold font-sans text-white leading-none tracking-tight">{discountedPrice}</span>
            <RiyalSymbol className="size-5 text-white" />
          </div>
          <div className="flex items-center gap-1 text-gray-300 line-through decoration-gray-400">
            <span className="text-sm font-sans">{price}</span>
            <RiyalSymbol className="size-3" />
          </div>
          <p className="mt-2 flex items-center gap-2 rounded-md border-green-200 bg-green-100 px-2 py-1 text-green-800 text-xs font-semibold">
            {t('Global.loyaltyDiscountApplied', { discount: discountPercentage })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5 drop-shadow-sm">
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-3xl font-bold font-sans text-white leading-none tracking-tight">{price}</span>
            <RiyalSymbol className="size-5 text-white" />
          </div>
          {originalPrice && originalPrice > price && (
            <div className="flex items-center gap-1 text-gray-300 line-through decoration-gray-400">
              <span className="text-sm font-sans">{originalPrice}</span>
              <RiyalSymbol className="size-3" />
            </div>
          )}
          {/* @ts-ignore JSX custom element */}
          {price > 0 && <div className="mt-2 w-full max-w-[200px] bg-white/10 rounded-md p-1 backdrop-blur-sm"><tamara-widget type="tamara-summary" amount={price} inline-type="2"></tamara-widget></div>}
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
        <div className="flex w-full items-center justify-center pt-2 px-1">
          <div className="flex w-full max-w-[340px] flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-green-500/20 bg-[#0A2E16] px-3 py-2 text-green-400">
            <div className="flex items-center gap-2">
              <Clock size={16} className="shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {t('Global.validUntil')} {formatDate(oneDayBefore(expiresAt!), lang)}
              </span>
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              {daysLeft} {t('Global.daysLeft')}
            </span>
          </div>
        </div>
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
              {t('Global.expiredOn')} {formatDate(expiresAt, lang)}
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
              {t('Global.forDays', { count: daysCount })}
            </p>
            {/* @ts-ignore JSX custom element */}
            {renewalPrice > 0 && <tamara-widget type="tamara-summary" amount={renewalPrice} inline-type="2"></tamara-widget>}
          </div>
        </div>
      ),
      cta: (
        <>
          <Button
            variant={'destructive'}
            onClick={() => setShowAgreement(true)}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? t('Global.processing') : t('Global.renewSubscription')}
            <RefreshCw className="rtl:rotate-180" />
          </Button>
          <PurchaseAgreementModal
            open={showAgreement}
            onOpenChange={setShowAgreement}
            onAccept={() => {
              setShowAgreement(false);
              mutate();
            }}
            isPending={isPending}
          />
        </>
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
