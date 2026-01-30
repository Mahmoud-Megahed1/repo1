import ForgetPasswordForm from '@modules/auth/components/forget-password-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/forget-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ForgetPasswordForm />;
}
