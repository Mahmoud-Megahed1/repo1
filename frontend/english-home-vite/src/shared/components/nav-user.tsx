import {
  BadgeCheck,
  ChevronsUpDown,
  ExternalLink,
  Globe,
  LogOut,
  Moon,
  Sun,
  MessageCircle,
  Bot,
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
import { useChatStore } from '@hooks/use-chat-store';
import { useAiChatStore } from '@hooks/use-ai-chat-store';

type Props = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout?: () => void;
};

export function NavUser({ user, onLogout }: Props) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  const locale = useLocale();
  const { dynamicTheme } = useTheme();
  const { setIsOpen: setOpenChat } = useChatStore();
  const { setIsOpen: setOpenAiChat } = useAiChatStore();

  const showAiReview = true; // Always show as per user request
  const showSupportChat = dynamicTheme?.showSupportChat !== false;

  if (!showAiReview && !showSupportChat) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mb-4 group-data-[state=collapsed]:hidden">
        <div className="px-2">

          {showSupportChat && (
            <Button
              onClick={() => {
                setOpenChat(true);
                if (isMobile) setOpenMobile(false);
              }}
              className="h-14 flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-[#EFBF04] via-[#f5d44a] to-[#d9ad04] hover:opacity-90 shadow-lg text-black p-0 transition-transform active:scale-95 border-none w-full"
              title={t('Global.chatbot.title' as any)}
            >
              <MessageCircle size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {t('Global.chatbot.title' as any)}
              </span>
            </Button>
          )}

          {showAiReview && (
            <Button
              onClick={() => {
                setOpenAiChat(true);
                if (isMobile) setOpenMobile(false);
              }}
              className="h-14 mt-2 flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg text-white p-0 transition-transform active:scale-95 border-none w-full"
              title={t('Global.aiReview.title' as any)}
            >
              <Bot size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {t('Global.aiReview.title' as any, { defaultValue: 'AI Review' })}
              </span>
            </Button>
          )}
        </div>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Button
          variant={'default'}
          className="mb-2 w-full bg-primary hover:bg-primary/90"
          asChild
        >
          <Link
            to="/user-guide"
            onClick={() => {
              if (isMobile) setOpenMobile(false);
            }}
          >
            <span className="group-data-[state=collapsed]:hidden">
              {t('Landing.footer.support.userGuide')}
            </span>
            <ExternalLink />
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
              <ChevronsUpDown className="ms-auto size-4" />
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
                <LanguageSwitcher
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <Globe /> {locale === 'ar' ? 'الانجليزية' : 'Arabic'}
                </LanguageSwitcher>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to="/app/account"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <BadgeCheck />
                  {t('Global.account')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onLogout?.();
                if (isMobile) setOpenMobile(false);
              }}
            >
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
