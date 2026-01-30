'use client';
import GoBack from '@/components/shared/go-back';
import { useRouter } from '@/components/shared/smooth-navigation';
import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { createAdmin } from '@/services/admins';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import AdminForm from './form';
import { schema } from './form/schema';

const AddAdmin = () => {
  const router = useRouter();
  const id = useId();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['createAdmin'],
    mutationFn: createAdmin,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['admins'],
      });
      router.push('/admin/admins');
      toast.success('Admin added successfully');
    },
  });
  function onSubmit(values: z.infer<typeof schema>) {
    mutate(values);
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GoBack />
          <h1 className="capitalize heading">Add Admin</h1>
        </div>
        <Button form={id} disabled={isPending}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Adding...
            </span>
          ) : (
            'Add Admin'
          )}
        </Button>
      </header>
      <AdminForm id={id} form={form} onSubmit={form.handleSubmit(onSubmit)} />
    </div>
  );
};

export default AddAdmin;
