'use client';
import GoBack from '@/components/shared/go-back';
import { useRouter } from '@/components/shared/smooth-navigation';
import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { getAdminById, updateAdmin } from '@/services/admins';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import AdminForm from '../add/form';
import { FORM_INPUTS } from '../add/form/account-details';
import { schema } from '../add/form/schema';

const updateSchema = schema.partial();

const UpdateAdmin = () => {
  const router = useRouter();
  const [id] = useQueryState('id', parseAsString.withDefault(''));
  const formId = useId();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', id],
    queryFn: () => getAdminById(id),
    refetchOnMount: true,
  });

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['updateAdmin'],
    mutationFn: updateAdmin,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['admins'],
      });
      router.push('/admin/admins');
      toast.success('Admin updated successfully');
    },
  });

  function onSubmit(values: z.infer<typeof updateSchema>) {
    const { password, ...rest } = values;

    const updateData = { ...rest };
    // Only include password if it's not empty string
    if (password && password.trim() !== '') {
      Object.assign(updateData, { password });
    }

    mutate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: updateData as any,
      id,
    });
  }

  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sourceData = data.data as any;
      const resetData = { ...sourceData };
      // Ensure password is removed from the reset data to prevent pre-filling hash
      delete resetData.password;
      form.reset(resetData);
    }
  }, [data?.data, form]);

  if (isLoading) return 'Loading...';
  if (!data?.data) return 'Admin not found';

  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GoBack />
          <h1 className="capitalize heading">Update Admin</h1>
        </div>
        <Button form={formId} disabled={isPending}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Updating...
            </span>
          ) : (
            'Update Admin'
          )}
        </Button>
      </header>
      <AdminForm
        id={formId}
        form={form as never}
        formInputs={FORM_INPUTS.map((item) => {
          // Keep email disabled as it typically serves as identifier
          if (item.name === 'email') return { ...item, disabled: true };
          return item;
        })}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default UpdateAdmin;
