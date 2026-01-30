import { useNavigate } from '@shared/i18n/routing';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/auth/callback')({
  component: RouteComponent,
});

function RouteComponent() {
  const token = (useSearch({ from: Route.id }) as { token?: string })?.token;
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      navigate({ to: '/app', replace: true });
    } else {
      navigate({ to: '/login', replace: true });
    }
  }, [navigate, token]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
