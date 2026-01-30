import { ShareProgressPage } from '@modules/landing/components/share-progress-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/share-progress')({
  component: ShareProgressPage,
});
