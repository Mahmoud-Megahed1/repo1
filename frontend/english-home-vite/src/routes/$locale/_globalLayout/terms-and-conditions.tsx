import { TermsAndConditionsPage } from '@modules/landing/components/terms-and-conditions-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/$locale/_globalLayout/terms-and-conditions'
)({
  component: TermsAndConditionsPage,
});
