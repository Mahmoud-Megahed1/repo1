'use client';
import { useRouter } from '@/components/shared/smooth-navigation';
import { getMe } from '@/services/auth';
import { User } from '@/types/admins.types';
import { LevelId } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext } from 'react';

type ContextType = {
  user?: User;
  levelsDetails: Array<{
    levelName: LevelId;
    currentDay: number;
    isCompleted: boolean;
  }>;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  logout: () => void;
  refetch?: () => void;
};

const AuthContext = createContext<ContextType>({
  logout: () => {},
  levelsDetails: [],
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, isLoading, isSuccess, isError, isFetching, refetch } = useQuery(
    {
      queryKey: ['getMe'],
      queryFn: getMe,
      refetchOnMount: true,
      placeholderData: undefined,
    },
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    router.push('/auth/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.data.user,
        levelsDetails: data?.data.levelsDetails || [],
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
