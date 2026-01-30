import type { BreadcrumbItemType } from '@hooks/use-breadcrumb-store';
import { cn } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Separator } from '@ui/separator';
import { SidebarTrigger } from '@ui/sidebar';
import type { FC } from 'react';
import React from 'react';
type Props = React.ComponentProps<'header'> & {
  breadcrumbItems?: Array<BreadcrumbItemType>;
};
const Header: FC<Props> = ({ className, breadcrumbItems = [], ...props }) => {
  return (
    <header
      className={cn(
        'bg-background group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>
    </header>
  );
};

type CustomBreadcrumbProps = {
  items: Array<BreadcrumbItemType>;
};
const CustomBreadcrumb = ({ items }: CustomBreadcrumbProps) => {
  const withoutCurrent = items.filter((item) => !item.isCurrent);
  const currentItem = items.find((item) => item.isCurrent);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {withoutCurrent.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === 'dropDownMenu' ? (
              <BreadcrumbItem>
                <DropdownMenu>
                  <BreadcrumbLink asChild>
                    <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0">
                      {item.items.find((i) => i.isCurrent)?.label ?? item.label}
                      <BreadcrumbSeparator />
                    </DropdownMenuTrigger>
                  </BreadcrumbLink>
                  <DropdownMenuContent className="max-h-[200px]">
                    {item.items.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
          </React.Fragment>
        ))}
        {currentItem && (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentItem.label}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Header;
