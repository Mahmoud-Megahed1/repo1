import { cn } from '@lib/utils';
import type { ComponentProps, FC } from 'react';
import { useTranslation } from 'react-i18next';
import BookLoader from '@ui/book-loader';

const LoadingScreen: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'dark:bg-primary-foreground/50 flex h-svh flex-col items-center justify-center gap-4 bg-background',
        className
      )}
      {...props}
    >
      <BookLoader className="text-primary" />
      <span className="sr-only">{t('Global.loading')}</span>
      <span className="text-muted-foreground animate-pulse font-medium">
        {t('Global.loading')}...
      </span>
    </div>
  );
};

export default LoadingScreen;
