import usePageTitle from '@hooks/use-page-title';
import { SignupForm } from '@modules/auth/components/sign-up-form';
import { useNavigate } from '@shared/i18n/routing';
import { useLoggedUser } from '@shared/queries';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/$locale/_globalLayout/signup')({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { status } = useLoggedUser();
  useEffect(() => {
    if (status === 'success') {
      navigate({ to: '/app' });
      return;
    }
  }, [status, navigate]);
  usePageTitle(t('Auth.signup-form.title'));
  if (status === 'success') return null;
  return <SignupForm />;
}
