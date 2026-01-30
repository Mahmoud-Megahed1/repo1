'use client';
import { AuthProvider, useAuth } from '@/components/auth-provider';
import { useRouter } from '@/components/shared/smooth-navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isError) {
      localStorage.removeItem('access_token');
      router.push('/auth/login');
    } else if (user && !user.isVerified) {
      router.push('/auth/otp');
    }
  }, [user, isError, router]);
  if (isLoading) return <LoadingComponent />;
  return user?.isVerified ? children : null;
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
