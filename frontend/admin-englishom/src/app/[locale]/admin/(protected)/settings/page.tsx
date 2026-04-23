'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSettings, updateSettings } from '@/services/settings';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const settingsSchema = z.object({
  repurchaseDiscounts: z.array(
    z.object({
      value: z.coerce.number().min(0).max(100),
    })
  ),
});

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['globalSettings'],
    queryFn: getSettings,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalSettings'] });
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: {
      repurchaseDiscounts: data?.data?.repurchaseDiscounts?.map((v) => ({ value: v })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'repurchaseDiscounts',
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    mutate({
      repurchaseDiscounts: values.repurchaseDiscounts.map((item) => item.value),
    });
  }

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Global Settings</h1>
      </div>

      <div className="box flex max-w-2xl flex-col gap-6 p-6">
        <div>
          <h2 className="text-lg font-bold">Repurchase Discounts</h2>
          <p className="text-sm text-muted-foreground">
            Configure the percentage discount applied automatically when a user purchases subsequent courses.
            The first item is for the 2nd course, the second item is for the 3rd course, and so on.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`repurchaseDiscounts.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex items-end gap-4">
                      <div className="flex-1">
                        <FormLabel>Course {index + 2} Discount (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => append({ value: 0 })}
            >
              <Plus size={16} className="mr-2" />
              Add Discount Level
            </Button>

            <Button type="submit" disabled={isPending} className="mt-4 self-end">
              {isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsPage;
