import Spinner from '@/components/shared/spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import AdminRow from './admin-row';
import { Admin } from '@/types/admins.types';
type Props = React.HTMLAttributes<HTMLDivElement> & {
  admins: Admin[];
  isLoading?: boolean;
};
const AdminsList: FC<Props> = ({ className, isLoading, admins }) => {
  const isEmpty = admins.length === 0;
  return (
    <ScrollArea
      className={cn(
        'box h-[calc(100vh-300px)] md:h-[calc(100vh-204px)]',
        {
          'h-fit md:h-fit': isLoading || isEmpty || admins.length < 6,
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
              <span>Role</span>
              <span>Status</span>
              <span className="pl-10">Permission</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {isEmpty ? (
              <h4 className="self-center text-3xl">Not found</h4>
            ) : (
              admins.map((admin) => <AdminRow key={admin._id} {...admin} />)
            )}
          </div>
        </main>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default AdminsList;
