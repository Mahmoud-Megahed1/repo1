'use client';

import { usePathname } from '@/i18n/routing';
import { HomeIcon, NotebookText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SidebarProps } from './layouts/sidebar';

type ContextType = {
  items: SidebarProps['items'];
  setItems: Dispatch<SetStateAction<SidebarProps['items']>>;
  resetItems: () => void;
};

const SidebarItemsContext = createContext<ContextType | undefined>(undefined);

const SidebarItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('Global.sidebar');
  const pathname = usePathname();
  const defaultItems = useMemo(
    () => [
      {
        href: '/app',
        icon: HomeIcon,
        label: t('home'),
        isActive: pathname === '/app/',
      },
      {
        href: '/app/levels',
        icon: NotebookText,
        label: t('levels'),
        isActive: pathname.startsWith('/app/levels/'),
      },
    ],
    [pathname, t],
  );
  const resetItems = useCallback(() => {
    setItems(defaultItems);
  }, [defaultItems]);
  const [items, setItems] = useState<SidebarProps['items']>(defaultItems);
  return (
    <SidebarItemsContext.Provider value={{ items, setItems, resetItems }}>
      {children}
    </SidebarItemsContext.Provider>
  );
};

const useSidebarItems = () => {
  const context = useContext(SidebarItemsContext);
  if (context === undefined) {
    throw new Error(
      'useSidebarItems must be used within a SidebarItemsProvider',
    );
  }
  return context;
};

const withSidebarItemsProvider = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: P) => (
    <SidebarItemsProvider>
      <Component {...props} />
    </SidebarItemsProvider>
  );
};

const useResetSidebarItems = () => {
  const { resetItems } = useSidebarItems();
  useEffect(() => {
    resetItems();
  }, [resetItems]);
};

export {
  SidebarItemsProvider,
  useResetSidebarItems,
  useSidebarItems,
  withSidebarItemsProvider,
};
