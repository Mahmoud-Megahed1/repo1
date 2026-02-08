import { useAuth } from '@components/contexts/auth-context';
import Header from '@components/header';
import AppSidebar from '@components/sidebar';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { MAIN_SIDEBAR_ITEMS } from '@shared/constants';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@ui/sidebar';
import BookLoader from '@components/ui/book-loader';

import { Bot } from 'lucide-react';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (user?.role === 'admin') {
      const defaultItems = MAIN_SIDEBAR_ITEMS();
      // Check if already added to prevent duplicates
      // Casting 'AI_SETTINGS' to any to avoid strict type collision with SidebarItem.id
      if (!sidebarItems.find(i => (i.id as any) === 'AI_SETTINGS')) {
        setSidebarItems([
          ...defaultItems,
          {
            title: 'AI Settings',
            url: '/app/admin/ai-settings' as any,
            icon: Bot,
            id: 'AI_SETTINGS' as any,
          } as any,
        ]);
      }
    }
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
