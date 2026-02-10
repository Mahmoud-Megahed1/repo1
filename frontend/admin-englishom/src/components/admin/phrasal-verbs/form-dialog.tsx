import CreateDialog from '@/components/shared/create-dialog';
import useCreateLesson from '@/hooks/use-create-lesson';
import { LevelId } from '@/types/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PhrasalVerbForm, { formSchema } from './form';
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
      useCasesAr: [' '],
      useCasesEn: [' '],
      examples: [{} as never],
      levelId,
      day,
    },
  });

  const { mutate, isPending } = useCreateLesson({
    day: form.getValues('day'),
    levelId: form.getValues('levelId'),
    lessonName: 'PHRASAL_VERBS',
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const { mutateAsync, isPending: isUploadingMedia } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: uploadMedia,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { day, levelId, ...data } = values;
    const urls = await Promise.all(
      values.examples.map(async ({ soundSrc, pictureSrc }) => {
        const response = await mutateAsync({
          file: soundSrc,
          day,
          level_name: levelId,
          lesson_name: 'PHRASAL_VERBS',
        });
        const response2 = await mutateAsync({
          file: pictureSrc,
          day,
          level_name: levelId,
          lesson_name: 'PHRASAL_VERBS',
        });
        return {
          soundSrc: response.data.url,
          pictureSrc: response2.data.url,
        };
      }),
    );
    const { useCasesAr, useCasesEn, ...rest } = data;
    mutate({
      ...rest,
      examples: values.examples.map((example, index) => ({
        ...example,
        soundSrc: urls[index].soundSrc,
        pictureSrc: urls[index].pictureSrc,
      })),
      useCases: {
        ar: useCasesAr,
        en: useCasesEn,
      },
    });
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
      isPending={isPending || isUploadingMedia}
    >
      <PhrasalVerbForm
        className="px-1"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id={formId}
      />
    </CreateDialog>
  );
};

export default FormDialog;
