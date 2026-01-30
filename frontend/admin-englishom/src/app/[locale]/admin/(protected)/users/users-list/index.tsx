import Spinner from '@/components/shared/spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn, formatDate } from '@/lib/utils';
import { User } from '@/types/admins.types';
import React, { FC } from 'react';
import UserRow from './user-row';
type Props = React.HTMLAttributes<HTMLDivElement> & {
  users: User[];
  isLoading?: boolean;
};
const UsersList: FC<Props> = ({ className, isLoading, users }) => {
  const isEmpty = users.length === 0;
  return (
    <ScrollArea
      className={cn(
        'box h-[calc(100vh-300px)] md:h-[calc(100vh-204px)]',
        {
          'h-fit md:h-fit': isLoading || isEmpty || users.length < 6,
        },
        className,
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <main className="h-full overflow-auto font-bold">
          <div className="flex w-full items-center gap-2">
            <div className="grid w-full grid-cols-4 gap-2 px-3 pb-4 pt-2">
              <span>Name</span>
              <span>Last Activity</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {isEmpty ? (
              <h4 className="self-center text-3xl">Not found</h4>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  {...user}
                  lastActivity={formatDate(user.lastActivity)}
                />
              ))
            )}
          </div>
        </main>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default UsersList;
