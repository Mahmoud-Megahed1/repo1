'use client';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Link } from './shared/smooth-navigation';
import { Button } from './ui/button';

const AccessDenied = () => {
  const t = useTranslations('AdminPage');
  const tGlobal = useTranslations('Global');
  useEffect(() => {
    document.title = t('accessDenied') + ' | ' + tGlobal('appName');
  }, [t, tGlobal]);
  return (
    <div className="container flex h-full flex-col items-center justify-center gap-2 text-center">
      <Lock className="size-16 text-destructive" />
      <h1 className="text-2xl font-bold text-primary md:text-3xl">
        {t('accessDenied')}
      </h1>
      <p className="mb-4 text-lg text-muted-foreground">{t('notAuthorized')}</p>
      <Button asChild>
        <Link href="/app">{t('goHome')}</Link>
      </Button>
    </div>
  );
};

export default AccessDenied;
