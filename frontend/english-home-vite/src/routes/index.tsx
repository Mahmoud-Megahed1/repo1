import { LandingPage } from '@modules/landing/components/landing-page';
import { createFileRoute } from '@tanstack/react-router';
import i18next from 'i18next';
import { DirectionProvider } from '@radix-ui/react-direction';

export const Route = createFileRoute('/')({
  component: RootLandingPage,
  beforeLoad: () => {
    i18next.changeLanguage('ar');
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  },
});

function RootLandingPage() {
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="w-full">
        <LandingPage />
      </div>
    </DirectionProvider>
  );
}
