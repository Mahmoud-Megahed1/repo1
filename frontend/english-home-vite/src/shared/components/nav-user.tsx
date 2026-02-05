import {
  BadgeCheck,
  ChevronsUpDown,
  ExternalLink,
  Globe,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@components/contexts/theme-context';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@ui/sidebar';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './language-switcher';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';

type Props = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout?: () => void;
};

export function NavUser({ user, onLogout }: Props) {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();
  const locale = useLocale();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          variant={'default'}
          className="mb-2 w-full text-base font-bold py-5 bg-primary hover:bg-primary/90"
          asChild
        >
          <Link to="/user-guide">
            <span className="group-data-[state=collapsed]:hidden">
              {t('Landing.footer.support.userGuide')}
            </span>
            <ExternalLink className="h-5 w-5" />
          </Link>
        </Button>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <ModeToggle />
              <DropdownMenuItem asChild>
                <LanguageSwitcher>
                  <Globe /> {locale === 'ar' ? 'الانجليزية' : 'Arabic'}
                </LanguageSwitcher>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/app/account">
                  <BadgeCheck />
                  {t('Global.account')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              {t('Global.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <DropdownMenuItem onClick={toggleTheme}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      {theme === 'light' ? t('Global.dark') : t('Global.light')}
    </DropdownMenuItem>
  );
}
