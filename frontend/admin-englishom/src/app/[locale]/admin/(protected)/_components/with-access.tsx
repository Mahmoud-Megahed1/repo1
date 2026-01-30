import NotFound from '@/app/[locale]/not-found';
import { useAuth } from './auth-provider';
type Role = 'super' | 'manager' | 'operator' | 'view';
export const withAccess = <P extends object>(
  Component: React.ComponentType<P>,
  role: Role[],
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const { user } = useAuth();
    if (!role.includes(user!.adminRole)) {
      return <NotFound />;
    }
    return <Component {...props} />;
  };
};
