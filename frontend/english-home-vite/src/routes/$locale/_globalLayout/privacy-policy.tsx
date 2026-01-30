import { PrivacyPolicyPage } from '@modules/landing/components/privacy-policy-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/privacy-policy')({
  component: PrivacyPolicyPage,
});
