import useLocale from '@hooks/use-locale';
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import i18next from 'i18next';
import { useEffect } from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';

export const Route = createFileRoute('/$locale/_globalLayout')({
  component: LayoutComponent,
  beforeLoad(ctx) {
    const locale = ctx.params.locale;
    if (locale !== 'en' && locale !== 'ar') {
      return notFound();
    } else {
      i18next.changeLanguage(locale);
    }
  },
});



function LayoutComponent() {
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);
  return (
    <DirectionProvider dir={dir}>
      <div>
        <Outlet />
      </div>

    </DirectionProvider>
  );
}
