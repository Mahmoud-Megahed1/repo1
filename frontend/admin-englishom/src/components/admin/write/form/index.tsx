'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import { Form } from '@/components/ui/form';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import SentencesForm from './sentences-form';

export const formSchema = z
  .object({
    sentences: z.array(z.string().min(10)),
    levelId: z.enum(LEVELS_ID),
    day: z.string(),
  })
  .refine((data) => data.sentences.length > 0, {
    message: 'At least one sentence is required.',
    path: ['sentences'],
  });

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const WriteForm = ({ form, className, ...props }: Props) => {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className={cn('space-y-4', className)} {...props}>
          <DayLevelPicker control={form.control} />
          <p>
            <span className="text-sm text-muted-foreground">
              Add answer between curly brackets. For example:{' '}
              <b>{`I am a {student}`}.</b>
            </span>
          </p>

          <SentencesForm />
        </form>
      </Form>
    </FormProvider>
  );
};

export default WriteForm;
