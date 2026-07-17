'use client';
import PermissionWrapper from '@/components/permission-wrapper';
import { Link } from '@/components/shared/smooth-navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  BadgeInfo,
  BadgeX,
  MoreHorizontalIcon,
  VerifiedIcon,
  Snowflake,
  Play,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/admins.types';

export const usersColumns = (
  t: any,
  isSuper: boolean,
  mutate: (params: { userId: string; status: 'active' | 'suspended' | 'blocked' }) => void,
  pause: (params: { userId: string; durationDays: number }) => void,
  resume: (userId: string) => void,
  isPending: boolean,
  isPausing: boolean,
  isResuming: boolean,
): ColumnDef<User>[] => [
  {
    header: t('name'),
    accessorKey: 'firstName',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col justify-center">
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          {user.occupation && (
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              {user.occupation}
            </span>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.firstName} ${rowA.original.lastName}`;
      const b = `${rowB.original.firstName} ${rowB.original.lastName}`;
      return a.localeCompare(b);
    }
  },
  {
    header: t('lastActivity'),
    accessorKey: 'lastActivity',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    header: t('status'),
    accessorKey: 'status',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <span
            className={cn('capitalize font-semibold text-xs', {
              'text-teal-500': user.status === 'active',
              'text-destructive': user.status === 'blocked',
              'text-yellow-500': user.status === 'suspended',
            })}
          >
            {t(user.status) || user.status}
          </span>
          {user.isVoluntaryPaused && (
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none px-2 py-0 h-5 text-[10px] font-bold">
              {t('frozen') || 'FROZEN'}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    header: t('actions') || 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      const id = user._id;
      const status = user.status;
      const isVoluntaryPaused = user.isVoluntaryPaused;

      return (
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant={'outline'}
            className="border border-gray-500/20 bg-white/80 dark:bg-secondary dark:hover:bg-secondary-foreground/10"
          >
            <Link href={`/admin/users/user-details?id=${id}`}>{t('details') || 'Details'}</Link>
          </Button>
          <PermissionWrapper permission={isSuper ? 'Edit' : 'Hidden'}>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none" asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 *:text-sm *:font-medium"
              >
                <DropdownMenuItem
                  onClick={() => {
                    mutate({ userId: id, status: 'active' });
                  }}
                  className={cn('gap-2 text-teal-500 focus:text-teal-500', {
                    hidden: status === 'active',
                  })}
                  disabled={isPending}
                >
                  <VerifiedIcon className="size-5" />
                  {t('activate') || 'Activate'}
                </DropdownMenuItem>
                <DropdownMenuSeparator
                  className={cn({
                    hidden: status === 'active',
                  })}
                />

                {/* Freeze/Resume Subscription */}
                {isVoluntaryPaused ? (
                  <DropdownMenuItem
                    onClick={() => resume(id)}
                    disabled={isResuming}
                    className="gap-2 text-blue-600 focus:text-blue-600"
                  >
                    <Play className="size-5" />
                    {t('resumeSubscription') || 'Resume'}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => pause({ userId: id, durationDays: 20 })}
                    disabled={isPausing}
                    className="gap-2 text-indigo-600 focus:text-indigo-600"
                  >
                    <Snowflake className="size-5" />
                    {t('freezeAccount') || 'Freeze (20d)'}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    mutate({ userId: id, status: 'suspended' });
                  }}
                  disabled={isPending}
                  className={cn('gap-2 text-yellow-500 focus:text-yellow-500', {
                    hidden: status === 'suspended',
                  })}
                >
                  <BadgeInfo className="size-5" />
                  {t('suspend') || 'Suspend'}
                </DropdownMenuItem>
                <DropdownMenuSeparator
                  className={cn({
                    hidden: status === 'suspended' || status === 'blocked',
                  })}
                />
                <DropdownMenuItem
                  onClick={() => {
                    mutate({ userId: id, status: 'blocked' });
                  }}
                  disabled={isPending}
                  className={cn(
                    'gap-2 text-destructive focus:text-destructive',
                    {
                      hidden: status === 'blocked',
                    },
                  )}
                >
                  <BadgeX className="size-5" />
                  {t('block') || 'Block'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionWrapper>
        </div>
      );
    },
  },
];
