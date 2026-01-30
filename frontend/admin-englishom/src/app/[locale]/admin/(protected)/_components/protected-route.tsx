'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import LoginPage from '@/app/[locale]/admin/login/page';
import { AuthProvider, useAuth } from './auth-provider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, user } = useAuth();
  if (isLoading) return <LoadingComponent />;
  return user ? children : <LoginPage />;
};

const LoadingComponent = () => {
  const t = useTranslations('Global');
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4 bg-primary-foreground dark:bg-primary-foreground/50">
      <span
        className="loader"
        role="status"
        aria-live="polite"
        aria-label={t('loading')}
      />
    </div>
  );
};

const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: P) => (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export { ProtectedRoute, withProtectedRoute };
