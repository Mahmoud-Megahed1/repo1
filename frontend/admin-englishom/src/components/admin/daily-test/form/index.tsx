'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import SelectFormField from '@/components/shared/form-fields/select-form-field';
import { Form } from '@/components/ui/form';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import AnswersForm from './answers-form';
import QuestionForm from './question-form';

export const formSchema = z
  .object({
    type: z.enum(['text', 'audio', 'image']),
    question: z.any().refine((val) => !!val, {
      message: 'Question is required.',
    }),
    answers: z.array(
      z.object({
        text: z.string().trim().min(1, { message: 'Answer text is required.' }),
        isCorrect: z.boolean().default(false),
      }),
    ),
    levelId: z.enum(LEVELS_ID),
    day: z.string(),
  })
  .refine(
    (data) => {
      const correctAnswers = data.answers.filter((answer) => answer.isCorrect);
      return correctAnswers.length > 0;
    },
    {
      message: 'At least one answer must be marked as correct.',
      path: ['answers.0.text'], // errors in the answers array
    },
  )
  .refine(
    (data) => {
      return data.answers.length > 2;
    },
    {
      message: 'At least three answers are required.',
      path: ['answers.0.text'], // errors in the answers array
    },
  );

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const DailyTestForm = ({ form, className, ...props }: Props) => {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className={cn('space-y-4', className)} {...props}>
          <DayLevelPicker control={form.control} />
          <SelectFormField
            name="type"
            control={form.control}
            label="Type"
            options={[
              { value: 'text', label: 'Text' },
              { value: 'audio', label: 'Audio' },
              { value: 'image', label: 'Image' },
            ]}
            defaultValue="text"
          />
          <QuestionForm />
          <SelectSeparator className="bg-primary/50" />
          <AnswersForm />
        </form>
      </Form>
    </FormProvider>
  );
};

export default DailyTestForm;
