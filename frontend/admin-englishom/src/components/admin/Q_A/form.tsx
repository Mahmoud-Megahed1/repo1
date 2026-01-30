'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
export const formSchema = z.object({
  question: z.string(),
  answer: z.string(),
  questionSrc: z.any().refine((val) => !!val, {
    message: 'Question audio is required',
  }),
  answerSrc: z.any().refine((val) => !!val, {
    message: 'Answer audio is required',
  }),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type QAndAFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const QAndAForm = ({ form, className, ...props }: QAndAFormProps) => {
  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...props}>
        <DayLevelPicker control={form.control} />
        <InputFormField
          name="question"
          control={form.control}
          label="Question"
        />
        <div className="space-y-1">
          <Input
            type="file"
            accept="audio/mp3"
            onChange={(e) => {
              form.setValue('questionSrc', e.target.files![0]);
              form.trigger('questionSrc');
            }}
          />
          {form.formState.errors.questionSrc && (
            <p className="text-sm text-destructive">
              {form.formState.errors.questionSrc.message as unknown as string}
            </p>
          )}
        </div>
        <SelectSeparator className="bg-primary/50" />
        <InputFormField name="answer" control={form.control} label="Answer" />
        <div className="space-y-1">
          <Input
            type="file"
            accept="audio/mp3"
            onChange={(e) => {
              form.setValue('answerSrc', e.target.files![0]);
              form.trigger('answerSrc');
            }}
          />
          {form.formState.errors.answerSrc && (
            <p className="text-sm text-destructive">
              {form.formState.errors.answerSrc.message as unknown as string}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default QAndAForm;
