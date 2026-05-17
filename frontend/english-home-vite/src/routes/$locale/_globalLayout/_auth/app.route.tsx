import { useAuth } from '@components/contexts/auth-context';
import Header from '@components/header';
import AppSidebar from '@components/sidebar';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { MAIN_SIDEBAR_ITEMS } from '@shared/constants';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@ui/sidebar';
import BookLoader from '@components/ui/book-loader';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/$locale/_globalLayout/_auth/app')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex bg-background h-screen w-full items-center justify-center">
      <BookLoader className="text-primary" />
    </div>
  ),
  onEnter() {
    useSidebarStore.getState().setItems(MAIN_SIDEBAR_ITEMS());
  },
});

export function RouteComponent() {
  const breadcrumbItems = useBreadcrumbStore((state) => state.items);
  const sidebarItems = useSidebarStore((state) => state.items);
  const setSidebarItems = useSidebarStore((state) => state.setItems);
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Re-translate the sidebar items whenever translation function 't' or language changes
    const currentItems = useSidebarStore.getState().items;
    if (currentItems.length > 0) {
      const updatedItems = currentItems.map((item) => {
        let key = '';
        if (item.id === 'Home' || item.id === 'Levels' || item.id === 'Report') {
          key = `Global.sidebarItems.${item.id.toLowerCase()}`;
        } else {
          key = `Global.sidebarItems.${item.id}`;
        }
        return {
          ...item,
          title: t(key as never) as string,
        };
      });
      
      const hasChanged = updatedItems.some(
        (item, index) => item.title !== currentItems[index]?.title
      );
      if (hasChanged) {
        setSidebarItems(updatedItems);
      }
    }
  }, [i18n.language, t, setSidebarItems, sidebarItems]);

  useEffect(() => {
    // Admin specific sidebar items can be added here if needed in the future
  }, [user, setSidebarItems, sidebarItems]);

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          email: user?.email || 'user@example.com',
          name: user?.firstName + ' ' + user?.lastName,
        }}
        items={sidebarItems}
      />
      <SidebarInset>
        <Header breadcrumbItems={breadcrumbItems} />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
