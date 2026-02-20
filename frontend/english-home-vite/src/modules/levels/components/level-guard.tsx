import { useAuth } from '@components/contexts/auth-context';
import LoadingScreen from '@components/loading-screen';
import { cn } from '@lib/utils';
import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import { KeyRound } from 'lucide-react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayment, useTamaraPayment } from '../mutations';

const LevelGuard = ({
  levelId,
  children,
}: {
  levelId: LevelId;
  children: React.ReactNode;
}) => {
  const { levelsDetails, isLoading } = useAuth();
  const canAccess = levelsDetails?.some(
    ({ levelName, isExpired }) => levelName === levelId && !isExpired
  );
  if (isLoading) return <LoadingScreen className="flex-1" />;
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
  const { mutate: tamaraPay, isPending: isTamaraPending } = useTamaraPayment(
    levelId,
    userData
  );

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
          onClick={() => payNow()}
          disabled={isPayPending || isTamaraPending}
          className="h-12 w-full text-lg font-semibold"
        >
          {isPayPending ? t('Global.processing') : t('Global.lockedLevel.cta')}
          <KeyRound className="ml-2 h-5 w-5" />
        </Button>

        {/* Tamara Button */}
        <Button
          onClick={() => tamaraPay()}
          disabled={isPayPending || isTamaraPending}
          variant="secondary"
          className="h-auto w-full flex-col items-center justify-center gap-1 border-2 border-primary/10 bg-zinc-50 py-3 hover:bg-zinc-100 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">اشتر عبر تمارا</span>
            <img
              src="/images/svgs/tamara.svg"
              alt="Tamara"
              className="h-4 object-contain"
            />
          </div>
          <span className="text-muted-foreground text-xs">
            قسمها على ٤ دفعات بقيمة ٢٧٢.٢٥ ر.س بدون فوائد
          </span>
        </Button>
      </div>
    </div>
  );
};

export default LevelGuard;
