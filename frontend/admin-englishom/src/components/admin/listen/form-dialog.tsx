import CreateDialog from '@/components/shared/create-dialog';
import useCreateLesson from '@/hooks/use-create-lesson';
import { LevelId } from '@/types/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ListenForm, { formSchema } from './form';
import { useMutation } from '@tanstack/react-query';
import { uploadMedia } from '@/services/lessons';
type Props = {
  levelId: LevelId;
  day: string;
};
const FormDialog: FC<Props> = ({ day, levelId }) => {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      levelId,
      day,
      definitions: [{ definition: '' }],
    },
  });
  const { mutate, isPending } = useCreateLesson({
    day: form.getValues('day'),
    levelId: form.getValues('levelId'),
    lessonName: 'LISTEN',
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });
  const { mutateAsync } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: uploadMedia,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const urls = await Promise.all(
      values.definitions.map(async ({ soundSrc }) => {
        const response = await mutateAsync({
          file: soundSrc,
          day,
          level_name: levelId,
          lesson_name: 'LISTEN',
        });
        return response.data.url;
      }),
    );
    mutate({
      ...values,
      definitions: values.definitions.map((def, index) => ({
        ...def,
        soundSrc: urls[index],
      })),
    } as never);
  }

  useEffect(() => {
    form.setValue('levelId', levelId);
    form.setValue('day', day);
  }, [levelId, day, form]);
  return (
    <CreateDialog
      open={open}
      onOpenChange={setOpen}
      formId={formId}
      isPending={isPending}
    >
      <ListenForm
        className="px-1"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id={formId}
      />
    </CreateDialog>
  );
};

export default FormDialog;
