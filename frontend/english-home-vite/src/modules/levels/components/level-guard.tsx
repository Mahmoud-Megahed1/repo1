import { useAuth } from '@components/contexts/auth-context';
import LoadingScreen from '@components/loading-screen';
import { cn } from '@lib/utils';
import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import { KeyRound } from 'lucide-react';
import * as React from 'react';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';


import { usePayment } from '../mutations';
import PurchaseAgreementModal from './purchase-agreement-modal';

const LevelGuard = ({
  levelId,
  children,
  day,
  lessonName,
}: {
  levelId: LevelId;
  children: React.ReactNode;
  day?: string;
  lessonName?: string;
}) => {
  const { levelsDetails, isLoading } = useAuth();
  const canAccess = levelsDetails?.some(
    ({ levelName, isExpired }) => levelName === levelId && !isExpired
  );
  if (isLoading) return <LoadingScreen className="flex-1" />;

  // Full access - user owns the level
  if (canAccess) return <>{children}</>;

  // Trial mode: Allow Day 1 access (except DAILY_TEST)
  // If no day is specified (days list page), allow through
  if (!day) return <>{children}</>;

  // For lesson pages: only allow Day 1, and block DAILY_TEST
  if (day === '1' && lessonName !== 'DAILY_TEST') {
    return <>{children}</>;
  }

  // Block access for Day 2+ or DAILY_TEST in trial
  if (!isLoading && !canAccess)
    return <LockedLevel levelId={levelId} className="flex-1" />;
  return <>{children}</>;
};

type LockedLevelProps = React.HTMLAttributes<HTMLDivElement> & {
  levelId: LevelId;
};
const LockedLevel: FC<LockedLevelProps> = ({
  className,
  levelId,
  ...props
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userData = {
    city: user?.country || 'Riyadh',
    country: user?.country || 'Saudi Arabia',
    phone: user?.phone || '966500000000',
  };

  const { mutate: payNow, isPending: isPayPending } = usePayment(
    levelId,
    userData
  );
  const [showAgreement, setShowAgreement] = useState(false);

  return (
    <div
      className={cn(
        'flex h-svh w-full flex-col items-center justify-center p-4 text-center',
        className
      )}
      {...props}
    >
      <img
        src="/secure-web.png"
        alt="Level Locked"
        className="mx-auto my-8 w-56 transform transition hover:scale-105 duration-300"
      />
      <h1 className="text-2xl font-bold">{t('Global.lockedLevel.title')}</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        {t('Global.lockedLevel.description')}
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-4">
        {/* Standard Pay Button */}
        <Button
          onClick={() => setShowAgreement(true)}
          disabled={isPayPending}
          className="h-12 w-full text-lg font-semibold"
        >
          {isPayPending ? t('Global.processing') : t('Global.lockedLevel.cta')}
          <KeyRound className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <PurchaseAgreementModal
        open={showAgreement}
        onOpenChange={setShowAgreement}
        onAccept={() => {
          setShowAgreement(false);
          payNow();
        }}
        isPending={isPayPending}
      />
    </div>
  );
};

export default LevelGuard;

