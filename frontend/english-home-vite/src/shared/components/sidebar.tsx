import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@ui/sidebar';
import * as React from 'react';
import NavMain from './nav-main';
import { NavUser } from './nav-user';
import { useAuth } from './contexts/auth-context';
import type { SidebarItem } from '@shared/types/entities';
import { useTranslation } from 'react-i18next';
import { useTheme } from './contexts/theme-context';

type Props = {
  items?: Array<SidebarItem>;
  user?: {
    name: string;
    email: string;
    photo?: string;
  };
} & React.ComponentProps<typeof Sidebar>;
export default function AppSidebar({ items = [], user, ...props }: Props) {
  const locale = useLocale();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { dynamicTheme } = useTheme();

  return (
    <Sidebar
      collapsible="icon"
      side={locale === 'ar' ? 'right' : 'left'}
      {...props}
    >
      <SidebarHeader>
        <Link
          to="/app"
          className="ms-2 flex items-center gap-2 py-2 font-medium group-data-[state=collapsed]:mx-auto"
        >
          <img
            src="/logo.jpeg"
            alt="Englishom"
            className="h-8 w-auto rounded-md"
          />
          {dynamicTheme?.assets?.logo && (
            <img
              src={dynamicTheme.assets.logo}
              alt={dynamicTheme.name}
              className="h-8 w-auto group-data-[state=collapsed]:hidden"
            />
          )}
          <b className="group-data-[state=collapsed]:hidden">
            {t('Global.englishom')}
          </b>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items as never} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.photo || '',
            }}
            onLogout={logout}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
