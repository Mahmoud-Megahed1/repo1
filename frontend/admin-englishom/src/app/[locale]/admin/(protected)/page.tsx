'use client';
import { useRouter } from '@/components/shared/smooth-navigation';
import { isClient } from '@/lib/utils';
import { useAuth } from './_components/auth-provider';
import Overview from './overview/page';

const MainPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.adminRole;
  if ((role === 'operator' || role === 'view') && isClient()) {
    router.push('/admin/cms');
    return null;
  }
  return <Overview />;
};

export default MainPage;
