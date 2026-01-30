'use client';
import {
  useHeaderTitle,
  withHeaderTitleProvider,
} from '@/components/header-title-provider';
import Header from '@/components/layouts/header';
import Sidebar, { SidebarProps } from '@/components/layouts/sidebar';
import {
  useSidebarItems,
  withSidebarItemsProvider,
} from '@/components/sidebar-items-provider';
import { LessonIdEnum } from '@/constants';
import useLessonsItems from '@/hooks/useLessonsItems';
import { usePathname } from '@/i18n/routing';
import { MessageSquare, PenBox, Bot } from 'lucide-react';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import React, { useEffect, useMemo } from 'react';
import { useAuth } from './_components/auth-provider';
import { withProtectedRoute } from './_components/protected-route';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { items, title } = useAdminLayoutSetup();
  const { logout, user } = useAuth();
  return (
    <div className="flex min-h-screen">
      <Sidebar
        name={user?.firstName || 'Admin'}
        email={user?.email || 'admin@example.com'}
        onLogout={logout}
        items={items}
      />
      <div className="flex w-full flex-col bg-primary-foreground dark:bg-transparent">
        <Header title={title} />
        <main className="container flex-1 overflow-hidden py-4 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const useAdminLayoutSetup = () => {
  const pathname = usePathname();
  const lessonsItems = useLessonsItems();
  const { user } = useAuth();
  const adminRole = user?.adminRole || 'view';
  const [lesson] = useQueryState(
    'lesson',
    parseAsStringEnum<LessonIdEnum>(Object.values(LessonIdEnum)),
  );
  const ITEMS = useMemo(
    () => [
      {
        href: '/admin/cms?lesson=READ',
        label: 'CMS',
        isActive: pathname === '/admin/cms/',
        type: 'group' as const,
        isHidden: false,
        children: lessonsItems
          .map((item) => ({
            ...item,
            href: `/admin/cms?lesson=${item.id}`,
            isActive: lesson === item.id,
            isHidden: false,
          }))
          .concat([
            {
              label: 'Levels',
              href: '/admin/cms/levels',
              icon: PenBox,
              isActive: pathname.startsWith('/admin/cms/levels'),
              id: 'levels' as LessonIdEnum,
              isHidden: false,
            },
          ]),
      },
    ],
    [pathname, lessonsItems, lesson],
  );
  const SIDEBAR_ITEMS: SidebarProps['items'] & {
    isHidden?: boolean;
  } = useMemo(
    () => [
      {
        href: '/admin/cms/chat-rules',
        label: 'Chat Rules',
        icon: Bot,
        isHidden: false,
      },
      {
        href: '/admin/testimonials',
        label: 'Testimonials',
        icon: MessageSquare,
        isHidden: false,
      },
      {
        href: '/admin/overview',
        label: 'Overview',
        isActive: true,
        isHidden: adminRole === 'view' || adminRole === 'operator',
      },
      {
        href: '/admin/users',
        label: 'Users',
        isHidden: adminRole === 'view' || adminRole === 'operator',
      },
      {
        href: '/admin/orders',
        label: 'Orders',
        isHidden: adminRole !== 'super' && adminRole !== 'manager',
      },
      {
        href: '/admin/admins',
        label: 'Admins',
        isHidden: adminRole !== 'super',
      },
      ...ITEMS,
    ],
    [ITEMS, adminRole],
  );
  const { title, setTitle } = useHeaderTitle();
  const { items, setItems } = useSidebarItems();
  useEffect(() => {
    const visibleItems = SIDEBAR_ITEMS.filter(
      (item) => !(item as unknown as { isHidden: boolean }).isHidden,
    );
    if (pathname === '/admin' || pathname === '/admin/') {
      setItems(visibleItems);
      setTitle('Overview');
    } else {
      setItems(
        visibleItems?.map((item) => ({
          ...item,
          isActive:
            pathname === '/' && item.href === '/admin/overview'
              ? true
              : pathname.startsWith(item.href),
        })),
      );

      const activeItem = visibleItems?.find((item) =>
        pathname.startsWith(item.href),
      );

      if (lesson || pathname.startsWith('/admin/cms')) {
        setTitle(lesson ? lesson : 'CMS');
      } else {
        setTitle(activeItem ? activeItem.label : 'Overview');
      }
    }
  }, [SIDEBAR_ITEMS, lesson, pathname, setItems, setTitle]);
  return { items, title };
};

export default withProtectedRoute(
  withSidebarItemsProvider(withHeaderTitleProvider(Layout)),
);
