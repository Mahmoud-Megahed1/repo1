import { Link } from '@shared/i18n/routing';
import type { LocalizedRouteType } from '@shared/types/utils';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@ui/sidebar';
import { type LucideIcon, CircleCheck } from 'lucide-react';

export default function NavMain({
  items,
}: {
  items: {
    title: string;
    url: LocalizedRouteType;
    icon?: LucideIcon;
    isActive?: boolean;
    isCompleted?: boolean;
  }[];
}) {
  const { setOpenMobile, openMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.isActive}
              tooltip={item.title}
              asChild
            >
              <Link
                preload={false}
                viewTransition
                onClick={() => {
                  setOpenMobile(!openMobile);
                }}
                to={item.url}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.isCompleted && (
                  <CircleCheck className="ms-auto size-4 text-green-500" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

