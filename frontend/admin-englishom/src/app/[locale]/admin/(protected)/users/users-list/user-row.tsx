'use client';
import PermissionWrapper from '@/components/permission-wrapper';
import { Link } from '@/components/shared/smooth-navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { updateUserStatus } from '@/services/admins';
import { User } from '@/types/admins.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BadgeInfo,
  BadgeX,
  MoreHorizontalIcon,
  VerifiedIcon,
} from 'lucide-react';
import { FC } from 'react';

const UserRow: FC<User> = ({
  _id: id,
  lastActivity,
  status,
  lastName,
  firstName,
}) => {
  const isSuper = true;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['updateUserStatus'],
    mutationFn: updateUserStatus,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="flex w-full items-center gap-2 text-sm">
      <div className="grid h-14 w-full grid-cols-4 items-center gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-background/20">
        <span>
          {firstName} {lastName}
        </span>
        <span>{lastActivity}</span>
        <span
          className={cn({
            'text-teal-500': status === 'active',
            'text-destructive': status === 'blocked',
            'text-yellow-500': status === 'suspended',
          })}
        >
          {status}
        </span>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant={'outline'}
            className="border border-gray-500/20 bg-white/80 dark:bg-secondary dark:hover:bg-secondary-foreground/10"
          >
            <Link href={`/admin/users/user-details?id=${id}`}>Details</Link>
          </Button>
          <PermissionWrapper permission={isSuper ? 'Edit' : 'Hidden'}>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <MoreHorizontalIcon className="size-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="*:text-sm *:font-medium"
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
                  <VerifiedIcon className="size-6" />
                  Activate
                </DropdownMenuItem>
                <DropdownMenuSeparator
                  className={cn({
                    hidden: status === 'active',
                  })}
                />
                <DropdownMenuItem
                  onClick={() => {
                    mutate({ userId: id, status: 'suspended' });
                  }}
                  disabled={isPending}
                  className={cn('gap-2 text-yellow-500 focus:text-yellow-500', {
                    hidden: status === 'suspended',
                  })}
                >
                  <BadgeInfo className="size-6" />
                  Suspend
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
                  <BadgeX className="size-6" />
                  Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionWrapper>
        </div>
      </div>
    </div>
  );
};

export default UserRow;
