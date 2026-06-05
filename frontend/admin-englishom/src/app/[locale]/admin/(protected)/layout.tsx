'use client';
import { useTranslations } from 'next-intl';
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
import { MessageSquare, PenBox, Bot, Palette, Settings } from 'lucide-react';
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
  const t = useTranslations('Global.sidebar');
  const ITEMS = useMemo(
    () => [
      {
        href: '/admin/cms?lesson=READ',
        label: t('cms'),
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
              label: t('levels'),
              href: '/admin/cms/levels',
              icon: PenBox,
              isActive: pathname.startsWith('/admin/cms/levels'),
              id: 'levels' as LessonIdEnum,
              isHidden: false,
            },
          ]),
      },
    ],
    [pathname, lessonsItems, lesson, t],
  );
  const SIDEBAR_ITEMS: SidebarProps['items'] & {
    isHidden?: boolean;
  } = useMemo(
    () => [
      {
        href: '/admin/cms/chat-rules',
        label: t('chatRules'),
        icon: Bot,
        isHidden: false,
      },
      {
        href: '/admin/testimonials',
        label: t('testimonials'),
        icon: MessageSquare,
        isHidden: false,
      },
      {
        href: '/admin/overview',
        label: t('overview'),
        isActive: true,
        isHidden: adminRole === 'view' || adminRole === 'operator',
      },
      {
        href: '/admin/ai-settings',
        label: t('aiSettings'),
        icon: Bot,
        isHidden: false,
      },
      {
        href: '/admin/settings',
        label: t('settings'),
        icon: Settings,
        isHidden: adminRole !== 'super' && adminRole !== 'manager',
      },
      {
        href: '/admin/users',
        label: t('users'),
        isHidden: adminRole === 'view' || adminRole === 'operator',
      },
      {
        href: '/admin/orders',
        label: t('orders'),
        isHidden: adminRole !== 'super' && adminRole !== 'manager',
      },
      {
        href: '/admin/admins',
        label: t('admins'),
        isHidden: adminRole !== 'super',
      },
      {
        href: '/admin/cms/themes',
        label: t('themes'),
        icon: Palette,
        isHidden: false,
      },
      ...ITEMS,
    ],
    [ITEMS, adminRole, t],
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
        visibleItems?.map((item) => {
          const cleanHref = item.href.split('?')[0];
          const isCMSGroup = item.type === 'group' && cleanHref === '/admin/cms';
          let isActive = pathname.startsWith(cleanHref);

          if (isCMSGroup) {
            isActive = pathname === '/admin/cms' || pathname === '/admin/cms/' || pathname.startsWith('/admin/cms/levels');
          } else if (pathname === '/' && cleanHref === '/admin/overview') {
            isActive = true;
          }

          return {
            ...item,
            isActive,
          };
        }),
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
