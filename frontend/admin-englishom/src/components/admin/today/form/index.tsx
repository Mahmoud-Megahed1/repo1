'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import TextareaFormField from '@/components/shared/form-fields/textarea-form-field';
import { Form } from '@/components/ui/form';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import InstructionsForm from './instructions-form';
import SentencesForm from './sentences-form';
import { Input } from '@/components/ui/input';

export const formSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().min(10),
    soundSrc: z.any().refine((val) => !!val, {
      message: 'Audio file is required.',
    }),
    instructions: z.array(
      z.object({
        word: z.string().min(2),
        definition: z.string().min(10),
      }),
    ),
    sentences: z.array(z.string().min(2)),
    levelId: z.enum(LEVELS_ID),
    day: z.string(),
  })
  .refine((data) => data.instructions.length > 0, {
    message: 'At least one instruction is required.',
    path: ['instructions'],
  });

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const ListenForm = ({ form, className, ...props }: Props) => {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className={cn('space-y-4', className)} {...props}>
          <DayLevelPicker control={form.control} />
          <InputFormField
            name="title"
            control={form.control}
            label="Title"
            placeholder="Title"
          />
          <TextareaFormField
            name="description"
            control={form.control}
            label="Description"
            placeholder="Description"
          />
          <div className="mt-4">
            <label htmlFor="soundSrc">Audio</label>
            <Input
              type="file"
              accept="audio/mp3"
              id="soundSrc"
              onChange={(e) => {
                form.setValue('soundSrc', e.target.files![0]);
                form.trigger('soundSrc');
              }}
            />
            {form.formState.errors.soundSrc && (
              <p className="text-sm font-semibold text-destructive">
                {form.formState.errors.soundSrc.message as string}
              </p>
            )}
          </div>
          <SelectSeparator className="bg-primary/50" />
          <InstructionsForm />
          <SentencesForm />
        </form>
      </Form>
    </FormProvider>
  );
};

export default ListenForm;
