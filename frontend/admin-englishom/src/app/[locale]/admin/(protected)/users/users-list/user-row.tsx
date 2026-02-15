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
import { adminPauseUser, adminResumeUser, updateUserStatus } from '@/services/admins';
import { User } from '@/types/admins.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BadgeInfo,
  BadgeX,
  MoreHorizontalIcon,
  VerifiedIcon,
  Snowflake,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';

const UserRow: FC<User> = ({
  _id: id,
  lastActivity,
  status,
  lastName,
  firstName,
  isVoluntaryPaused,
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

  const { mutate: pause, isPending: isPausing } = useMutation({
    mutationKey: ['adminPauseUser'],
    mutationFn: adminPauseUser,
    onSuccess() {
      toast.success('Account frozen successfully for 20 days');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const { mutate: resume, isPending: isResuming } = useMutation({
    mutationKey: ['adminResumeUser'],
    mutationFn: adminResumeUser,
    onSuccess() {
      toast.success('Account resumed successfully');
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
        <div className="flex items-center gap-2">
          <span
            className={cn({
              'text-teal-500': status === 'active',
              'text-destructive': status === 'blocked',
              'text-yellow-500': status === 'suspended',
            })}
          >
            {status}
          </span>
          {isVoluntaryPaused && (
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none px-2 py-0 h-5 text-[10px] font-bold">
              FROZEN
            </Badge>
          )}
        </div>
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

                {/* Freeze/Resume Subscription */}
                {isVoluntaryPaused ? (
                  <DropdownMenuItem
                    onClick={() => resume(id)}
                    disabled={isResuming}
                    className="gap-2 text-blue-600 focus:text-blue-600"
                  >
                    <Play className="size-6" />
                    Resume Subscription
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => pause({ userId: id, durationDays: 20 })}
                    disabled={isPausing}
                    className="gap-2 text-indigo-600 focus:text-indigo-600"
                  >
                    <Snowflake className="size-6" />
                    Freeze Account (20d)
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
