'use client';
import { useRouter } from '@/components/shared/smooth-navigation';
import { getLoggedAdmin } from '@/services/admins';
import { Admin } from '@/types/admins.types';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext } from 'react';

type ContextType = {
  user?: Admin;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  logout: () => void;
  refetch?: () => void;
};

const AuthContext = createContext<ContextType>({
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, isLoading, isSuccess, isError, isFetching, refetch } = useQuery(
    {
      queryKey: ['getLoggedAdmin'],
      queryFn: getLoggedAdmin,
      refetchOnMount: true,
      placeholderData: undefined,
    },
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    router.push('/admin/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.data,
        isLoading: isLoading || isFetching,
        isSuccess,
        isError,
        logout,
        refetch,
      }}
    >
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
