'use client';
import { Link } from '@/components/shared/smooth-navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import useIsMobile from '@/hooks/use-mobile';
import { usePathname } from '@/i18n/routing';
import { cn, isClient } from '@/lib/utils';
import {
  ArrowLeftIcon,
  CircleUserRound,
  LogOut,
  LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import NavLink from './nav-link';
import NavLinksGroup from './nav-links-group';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type NavItem = {
  href: string;
  icon?: LucideIcon;
  label: string;
  isActive?: boolean;
};

export type SidebarProps = {
  items?: Array<
    | (NavItem & { type?: 'default' })
    | (NavItem & {
      type: 'group';
      children: NavItem[];
    })
  >;
} & ProfileComponentProps;
const Sidebar: FC<SidebarProps> = ({ items = [], name, email, onLogout }) => {
  const t = useTranslations('Global');
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(
    () => isClient() && window.innerWidth > 780,
  );
  const pathname = usePathname();
  useEffect(() => {
    window.setIsOpen = setIsOpen;
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={cn(
            'fixed inset-0 z-40 w-full bg-black/50 transition-[width] duration-200 ease-linear',
            {
              'w-0': !isOpen,
            },
          )}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'max-w-[290px] shrink-0 overflow-hidden bg-primary text-primary-foreground dark:bg-[#23161F] dark:text-primary',
          isMobile ? 'fixed bottom-0 top-0 z-50' : 'sticky top-0 h-screen',
          isOpen ? 'w-full' : 'w-0',
        )}
      >
        <nav className="flex h-full flex-col gap-6 pt-10">
          <div className="flex items-center justify-between pe-6 ps-10">
            <Link
              href="/admin"
              className="text-xl font-bold uppercase md:text-2xl"
            >
              {t('appName')}
            </Link>

            {isMobile && (
              <button onClick={() => setIsOpen((prev) => !prev)}>
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="size-7" />
              </button>
            )}
          </div>
          <ScrollArea className="flex-1 ps-10 [&_.scroll-thumb]:bg-primary-foreground dark:[&_.scroll-thumb]:bg-primary">
            <ul className="flex-1 space-y-2 pe-3">
              {items.map((item, i) =>
                item?.type === 'group' ? (
                  <li key={i}>
                    <NavLinksGroup item={item} />
                  </li>
                ) : (
                  <li key={i}>
                    <NavLink
                      className="flex items-center gap-3"
                      href={item.href}
                      isActive={item.isActive}
                    >
                      {item.icon && <item.icon />}
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </ScrollArea>
          <ProfileComponent name={name} email={email} onLogout={onLogout} />
        </nav>
      </aside>
    </>
  );
};

type ProfileComponentProps = {
  name: string;
  email: string;
  onLogout?: () => void;
};
const ProfileComponent: FC<ProfileComponentProps> = ({
  email,
  name,
  onLogout,
}) => {
  const t = useTranslations('Global');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-4 border border-t p-4 text-start hover:bg-muted/10 dark:hover:bg-muted-foreground/10',
            'border-primary/20 bg-primary/5 dark:border-primary-foreground/10 dark:bg-primary-foreground/5',
          )}
        >
          <CircleUserRound className="size-10 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary-foreground dark:text-primary">
              {name}
            </span>
            <p className="max-w-[200px] overflow-hidden text-ellipsis text-xs text-primary-foreground/70 dark:text-primary">
              {email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] bg-primary dark:bg-[#23161F]">
        <DropdownMenuItem
          onClick={onLogout}
          className="text-primary-foreground focus:bg-secondary/10 focus:text-primary-foreground dark:text-primary dark:focus:bg-secondary/50"
        >
          <LogOut /> {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Sidebar;
