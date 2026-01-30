'use client';
import { DataTable } from '@/components/shared/data-table';
import SelectFormField from '@/components/shared/form-fields/select-form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LEVELS_ID, LEVELS_LABELS } from '@/constants';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';
import { assignCourseToUser, getUserById } from '@/services/admins';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, Calendar, IdCard, Loader2, Mail, User2 } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { coursesColumns } from './columns';

const UserDetails = () => {
  const [id] = useQueryState('id', parseAsString.withDefault(''));
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userDetails', id],
    queryFn: () => getUserById(id),
    refetchOnMount: true,
  });
  const userDetails = data?.data.user;
  const rawCourses = data?.data.levelsDetails || [];
  const courses = rawCourses.map(c => ({ ...c, userId: userDetails?._id || '' }));
  if (isLoading) return 'Loading...';
  if (!userDetails || isError) return 'User not found or error occurred';
  return (
    <div className="flex flex-col gap-4">
      <section className="box flex min-h-32 flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full border bg-primary text-xl font-bold text-primary-foreground">
            {userDetails.firstName.charAt(0).toUpperCase()}
            {userDetails.lastName.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col">
            <h1 className="heading">
              {userDetails.firstName} {userDetails.lastName}
            </h1>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} /> {userDetails.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={cn('capitalize', {
              'bg-teal-500 hover:bg-teal-500': userDetails.status === 'active',
              'bg-yellow-500 text-black hover:bg-yellow-500':
                userDetails.status === 'suspended',
              'bg-destructive text-destructive-foreground hover:bg-destructive':
                userDetails.status === 'blocked',
            })}
          >
            {userDetails.status}
          </Badge>
          <Badge
            className={cn('capitalize', {
              'bg-teal-500 hover:bg-teal-500': userDetails.isVerified,
              'bg-yellow-500 text-black hover:bg-yellow-500':
                !userDetails.isVerified,
            })}
          >
            {userDetails.isVerified ? '✔ Verified' : '❌ Unverified'}
          </Badge>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 *:px-8 *:py-6 md:grid-cols-3">
        <div className="box flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <User2 className="text-blue-500" />
            <h2 className="text-lg font-bold">Personal Info</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                First Name
              </span>
              <span className="font-bold">{userDetails.firstName}</span>
            </div>
            <DropdownMenuSeparator className="bg-muted-foreground/30" />
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Last Name
              </span>
              <span className="font-bold">{userDetails.lastName}</span>
            </div>
            <DropdownMenuSeparator className="bg-muted-foreground/30" />
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">Email</span>
              <span className="font-bold">{userDetails.email}</span>
            </div>
          </div>
        </div>
        <div className="box flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <IdCard className="text-cyan-700" />
            <h2 className="text-lg font-bold">Account Status</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Current Status
              </span>
              <Badge
                className={cn('mt-2 w-fit capitalize', {
                  'bg-teal-500 hover:bg-teal-500':
                    userDetails.status === 'active',
                  'bg-yellow-500 text-black hover:bg-yellow-500':
                    userDetails.status === 'suspended',
                  'bg-destructive text-destructive-foreground hover:bg-destructive':
                    userDetails.status === 'blocked',
                })}
              >
                {userDetails.status}
              </Badge>
            </div>
            <DropdownMenuSeparator className="bg-muted-foreground/30" />
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Verification Status
              </span>
              <Badge
                className={cn('mt-2 w-fit capitalize', {
                  'bg-teal-500 hover:bg-teal-500': userDetails.isVerified,
                  'bg-yellow-500 text-black hover:bg-yellow-500':
                    !userDetails.isVerified,
                })}
              >
                {userDetails.isVerified ? '✔ Verified' : '❌ Unverified'}
              </Badge>
            </div>
            <DropdownMenuSeparator className="bg-muted-foreground/30" />
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Registration Date
              </span>
              <span className="font-bold">
                {formatDate(userDetails.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="box flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Activity className="text-purple-700" />
            <h2 className="text-lg font-bold">Activity</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Last Activity
              </span>
              <span className="flex items-center gap-2 font-bold">
                <Calendar size={16} className="text-purple-700" />
                {formatRelativeTime(userDetails.lastActivity)}
              </span>
            </div>
            <DropdownMenuSeparator className="bg-muted-foreground/30" />
            <div className="flex flex-col">
              <span className="font-medium text-muted-foreground">
                Exact Time
              </span>
              <span className="font-bold">
                {formatDate(userDetails.lastActivity)}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="box flex flex-col gap-8 px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="subheading">Courses</h2>
          <AddCourseForm userId={userDetails._id} />
        </div>
        <section>
          {isLoading ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : (
            <DataTable columns={coursesColumns} data={courses} />
          )}
        </section>
      </section>
    </div>
  );
};

const formSchema = z.object({
  level_name: z.enum(LEVELS_ID),
});

type Props = {
  userId: string;
};
const AddCourseForm: FC<Props> = ({ userId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationKey: ['assignCourseToUser'],
    mutationFn: assignCourseToUser,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      userId,
      level_name: values.level_name,
      reason: 'Added by admin',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <ScrollArea className="flex max-h-[90vh] flex-col px-5 py-6">
          <DialogHeader className="mb-4 px-1">
            <DialogTitle className="text-xl">Add Course</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-1"
            >
              <SelectFormField
                control={form.control}
                name="level_name"
                options={LEVELS_OPTIONS}
                placeholder="Select Course"
              />
              <Button disabled={isPending} className="ms-auto">
                {isPending ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const LEVELS_OPTIONS = LEVELS_ID.map((level) => ({
  value: level,
  label: LEVELS_LABELS[level],
}));

export default UserDetails;
