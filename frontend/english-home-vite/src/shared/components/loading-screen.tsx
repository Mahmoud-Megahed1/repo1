import { cn } from '@lib/utils';
import type { ComponentProps, FC } from 'react';
import { useTranslation } from 'react-i18next';

const LoadingScreen: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'dark:bg-primary-foreground/50 flex h-svh flex-col items-center justify-center gap-4',
        className
      )}
      {...props}
    >
      <span
        className="loader"
        role="status"
        aria-live="polite"
        aria-label={t('Global.loading')}
      />
    </div>
  );
};

export default LoadingScreen;
