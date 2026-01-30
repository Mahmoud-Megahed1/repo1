import { useAuth } from '@components/contexts/auth-context';
import Header from '@components/header';
import AppSidebar from '@components/sidebar';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import { useSidebarStore } from '@hooks/use-sidebar-store';
import { MAIN_SIDEBAR_ITEMS } from '@shared/constants';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@ui/sidebar';
import { BookTransition } from '@components/book-transition';

export const Route = createFileRoute('/$locale/_globalLayout/_auth/app')({
  component: RouteComponent,
  onEnter() {
    useSidebarStore.getState().setItems(MAIN_SIDEBAR_ITEMS());
  },
});

export function RouteComponent() {
  const breadcrumbItems = useBreadcrumbStore((state) => state.items);
  const sidebarItems = useSidebarStore((state) => state.items);
  const { user } = useAuth();

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
        <div className="flex flex-1 flex-col gap-4 p-4 perspective-[1500px]">
          <BookTransition>
            <Outlet />
          </BookTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
