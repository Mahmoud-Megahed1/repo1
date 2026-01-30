import { UserGuidePage } from '@modules/landing/components/user-guide-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/user-guide')({
  component: UserGuidePage,
});
