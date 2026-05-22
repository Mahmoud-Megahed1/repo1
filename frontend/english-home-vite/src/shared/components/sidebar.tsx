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
import TestimonialForm from '../../modules/insights/components/testimonial-form';

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
      <SidebarContent className="flex flex-col gap-4">
        <NavMain items={items as never} />
        <div className="px-4 mt-auto mb-4 group-data-[state=collapsed]:hidden">
          <TestimonialForm>
            <button className="flex w-full cursor-pointer flex-col rounded-xl bg-secondary p-4 text-start shadow-sm transition-all hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-center gap-3 w-full">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">
                    {t('Global.testimonial.title')}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {t('Global.testimonial.description')}
                  </span>
                </div>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-orange-500 p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </button>
          </TestimonialForm>
        </div>
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
