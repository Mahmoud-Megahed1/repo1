import useLocale from '@hooks/use-locale';
import { useSessionHeartbeat } from '@hooks/use-session-heartbeat';
import { getMe } from '@shared/services';
import type { LevelDetails, UserType } from '@shared/types/entities';
import type { RouteType, RouteWithoutLocale } from '@shared/types/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createContext, useCallback, useContext, useMemo } from 'react';

type ContextType = {
  user?: UserType;
  levelsDetails: Array<LevelDetails>;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  logout: () => void;
  refetch?: () => void;
  error?: AxiosError<
    {
      message: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null;
};

const AuthContext = createContext<ContextType>({
  logout: () => { },
  levelsDetails: [],
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess, isError, refetch, error } = useQuery({
    queryKey: ['getMe'],
    queryFn: getMe,
    refetchOnMount: true,
    throwOnError: false,
  });
  const locale = useLocale();

  // Enable session heartbeat for authenticated users
  const isAuthenticated = !!(data?.data.user && !isLoading && !isError);
  useSessionHeartbeat(isAuthenticated);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    queryClient.invalidateQueries({ queryKey: ['getMe'] });
    const href: RouteWithoutLocale<RouteType> = `/login`;
    window.location.href = `/${locale}${href}`;
  }, [locale, queryClient]);

  const value = useMemo(() => ({
    user: data?.data.user,
    levelsDetails: data?.data.levelsDetails || [],
    isLoading,
    isSuccess,
    isError,
    logout,
    refetch,
    error,
  }), [data, isLoading, isSuccess, isError, logout, refetch, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
