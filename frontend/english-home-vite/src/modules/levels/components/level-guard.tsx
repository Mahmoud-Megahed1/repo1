import { useAuth } from '@components/contexts/auth-context';
import LoadingScreen from '@components/loading-screen';
import { cn } from '@lib/utils';
import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import { KeyRound } from 'lucide-react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayment } from '../mutations';

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
  const { mutate, isPending } = usePayment(levelId);

  return (
    <div
      className={cn(
        'flex h-svh w-full flex-col items-center justify-center',
        className
      )}
      {...props}
    >
      <img
        src="/secure-web.png"
        alt="Level Locked"
        className="mx-auto my-8 w-56"
      />
      <h1 className="text-2xl font-bold">{t('Global.lockedLevel.title')}</h1>
      <p className="text-muted-foreground mt-2">
        {t('Global.lockedLevel.description')}
      </p>
      <Button onClick={() => mutate()} disabled={isPending} className="mt-6">
        {isPending ? t('Global.processing') : t('Global.lockedLevel.cta')}
        <KeyRound />
      </Button>
    </div>
  );
};

export default LevelGuard;
