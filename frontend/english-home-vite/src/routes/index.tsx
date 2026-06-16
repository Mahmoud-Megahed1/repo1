import { LandingPage } from '@modules/landing/components/landing-page';
import { createFileRoute } from '@tanstack/react-router';
import i18next from 'i18next';
import { useEffect } from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';

export const Route = createFileRoute('/')({
  component: RootLandingPage,
  beforeLoad: () => {
    i18next.changeLanguage('ar');
  },
});

function RootLandingPage() {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  return (
    <DirectionProvider dir="rtl">
      <div lang="ar" dir="rtl" className="w-full">
        <LandingPage />
      </div>
    </DirectionProvider>
  );
}

