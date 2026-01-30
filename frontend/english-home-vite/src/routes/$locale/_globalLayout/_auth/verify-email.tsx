import { useAuth } from '@components/contexts/auth-context';
import usePageTitle from '@hooks/use-page-title';
import OTPForm from '@modules/auth/components/otp-form';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute(
  '/$locale/_globalLayout/_auth/verify-email'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  usePageTitle(t('Auth.otp-form.title'));
  return <OTPForm email={user!.email} />;
}
