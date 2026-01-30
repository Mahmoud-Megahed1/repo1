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
import { deleteAdmin, updateAdmin } from '@/services/admins';
import { Admin } from '@/types/admins.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MoreHorizontalIcon,
  ShieldXIcon,
  Trash2,
  VerifiedIcon,
} from 'lucide-react';
import { FC, useCallback } from 'react';

const AdminRow: FC<Admin> = ({
  _id: id,
  adminRole,
  isActive,
  lastName,
  firstName,
}) => {
  const isSuper = true;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['updateAdmin', id],
    mutationFn: updateAdmin,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  const { mutate: deleteMutation, isPending: isPendingDelete } = useMutation({
    mutationKey: ['deleteAdmin', id],
    mutationFn: deleteAdmin,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  const handleToggleActive = useCallback(() => {
    mutate({
      id,
      data: {
        isActive: !isActive,
      },
    });
  }, [id, isActive, mutate]);

  return (
    <div className="flex w-full items-center gap-2 text-sm">
      <div className="grid h-14 w-full grid-cols-4 items-center gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-background/20">
        <span>
          {firstName} {lastName}
        </span>
        <span>{adminRole}</span>
        <span
          className={cn({
            'text-teal-500': isActive,
            'text-destructive': !isActive,
            'text-foreground': isPending,
          })}
        >
          {isPending ? 'Loading...' : isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant={'outline'}
            className="border border-gray-500/20 bg-white/80 dark:bg-secondary dark:hover:bg-secondary-foreground/10"
          >
            <Link href={`/admin/admins/update?id=${id}`}>
              Edit
            </Link>
          </Button>
          {adminRole !== 'super' && (
            <PermissionWrapper permission={isSuper ? 'Edit' : 'Hidden'}>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <MoreHorizontalIcon className="size-7" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="*:text-sm *:font-medium"
                >
                  {isActive ? (
                    <DropdownMenuItem
                      onClick={handleToggleActive}
                      className="gap-2"
                    >
                      <ShieldXIcon className="size-6" />
                      Inactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleToggleActive}
                      className="gap-2 text-teal-500 focus:text-teal-500"
                    >
                      <VerifiedIcon className="size-6" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={() => {
                      deleteMutation(id);
                    }}
                    disabled={isPendingDelete}
                  >
                    <Trash2 className="size-6" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRow;
