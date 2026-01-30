import CreateDialog from '@/components/shared/create-dialog';
import useCreateLesson from '@/hooks/use-create-lesson';
import { LevelId } from '@/types/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import GrammarForm, { formSchema } from './form';

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
      useCasesAr: [' '],
      useCasesEn: [' '],
      examples: [' '],
      words: [' '],
    },
  });

  const { mutate, isPending } = useCreateLesson({
    day: form.getValues('day'),
    levelId: form.getValues('levelId'),
    lessonName: 'GRAMMAR',
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { words, useCasesAr, useCasesEn, ...rest } = values;
    const filteredWords = words?.filter((word) => word?.trim() !== '');
    const finalValues = {
      ...rest,
      useCases: {
        en: useCasesEn,
        ar: useCasesAr,
      },
      ...(filteredWords?.length ? { words: filteredWords } : {}),
    };
    mutate(finalValues);
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
      <GrammarForm
        className="px-1"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id={formId}
      />
    </CreateDialog>
  );
};

export default FormDialog;
