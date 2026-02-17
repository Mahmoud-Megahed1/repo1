import useLocale from '@hooks/use-locale';
import OTPForm from '@modules/auth/components/otp-form';
import { useNavigate } from '@shared/i18n/routing';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/auth-context';
import LoadingScreen from './loading-screen';
import BlockedAccountPage from './blocked-account-page';
import SuspendedAccountPage from './suspended-account-page';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError, user, error } = useAuth();
  const navigate = useNavigate();
  const locale = useLocale();
  const isOTPRoute = window.location.pathname.includes('verify-email');
  useEffect(() => {
    if (isOTPRoute && user?.isVerified) {
      navigate({ to: '/app' });
    }
    if (isError && error && error?.status === 401) {
      localStorage.removeItem('token');
      navigate({ to: '/login' });
    }
  }, [user, isError, navigate, locale, isOTPRoute, error]);
  if (isLoading) return <LoadingScreen className="h-svh" />;
  if (!user && !isLoading) return null;
  return user?.isVerified ? children : <OTPForm email={user!.email} />;
};

const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <AuthProvider>
      <ProtectedRoute>
        <CheckStatus>
          <Component {...props} />
        </CheckStatus>
      </ProtectedRoute>
    </AuthProvider>
  );
};

const CheckStatus = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const status = user!.status;
  if (status === 'blocked')
    return (
      <BlockedAccountPage
        userEmail={user?.email}
        blockDate={new Date(user!.lastActivity).toLocaleDateString()}
      />
    );
  if (status === 'suspended' || user?.isVoluntaryPaused)
    return (
      <SuspendedAccountPage
        userName={user?.firstName}
        suspensionReason={user?.suspensionReason}
      />
    );
  return <>{children}</>;
};

export { ProtectedRoute, withProtectedRoute };
