import { LandingPage } from '@modules/landing/components/landing-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/')({
  component: Home,
});

export function Home() {
  return <LandingPage />;
}
