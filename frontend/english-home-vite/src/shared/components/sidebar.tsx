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
import LearningPathTracker from './learning-path-tracker';

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
        <div className="px-4 mt-auto mb-2 group-data-[state=collapsed]:hidden">
          <LearningPathTracker />
        </div>
        <div className="px-4 mb-4 group-data-[state=collapsed]:hidden">
          <TestimonialForm>
            <button className="relative flex w-full cursor-pointer flex-col rounded-xl bg-orange-500/10 p-4 text-start shadow-[0_0_20px_rgba(249,115,22,0.4)] border-2 border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] hover:border-orange-400 hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 overflow-hidden group/feedback">
              {/* Continuous background pulse effect */}
              <div className="absolute inset-0 bg-orange-500/10 animate-pulse pointer-events-none" />
              
              <div className="flex items-center gap-3 w-full relative z-10">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400 drop-shadow-sm transition-colors group-hover/feedback:text-orange-500">
                    {t('Global.testimonial.title')}
                  </span>
                  <span className="text-xs text-orange-700/80 dark:text-orange-200/80 font-medium line-clamp-2">
                    {t('Global.testimonial.description')}
                  </span>
                </div>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-2 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] relative">
                  {/* Aggressive pulsing rings behind icon */}
                  <span className="absolute -inset-1.5 rounded-xl bg-orange-500 opacity-50 animate-ping"></span>
                  <span className="absolute inset-0 rounded-lg bg-orange-400 opacity-40 animate-pulse"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 drop-shadow-lg scale-110 group-hover/feedback:scale-125 transition-transform duration-300"
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
