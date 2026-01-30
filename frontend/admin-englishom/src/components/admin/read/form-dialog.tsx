import CreateDialog from '@/components/shared/create-dialog';
import useCreateLesson from '@/hooks/use-create-lesson';
import { LevelId } from '@/types/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ReadForm, { formSchema } from './form';
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
    },
    mode: 'onChange',
  });
  const { mutate, isPending } = useCreateLesson({
    day: form.getValues('day'),
    levelId: form.getValues('levelId'),
    lessonName: 'READ',
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values as never);
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
      <ReadForm
        className="px-1"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id={formId}
      />
    </CreateDialog>
  );
};

export default FormDialog;
