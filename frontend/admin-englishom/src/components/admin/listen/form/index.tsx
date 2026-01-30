'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import TextEditorFormField from '@/components/shared/form-fields/text-editor-form-field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import DefinitionsForm from './definitions-form';

export const formSchema = z
  .object({
    soundSrc: z.any().refine((val) => !!val, {
      message: 'Audio file is required.',
    }),
    transcript: z.string().min(10),
    definitions: z.array(
      z.object({
        word: z.string().min(2),
        definition: z.string().min(10),
        soundSrc: z.any().refine((val) => !!val, {
          message: 'Audio file is required.',
        }),
      }),
    ),
    levelId: z.enum(LEVELS_ID),
    day: z.string(),
  })
  .refine((data) => data.definitions.length > 0, {
    message: 'At least one definition is required.',
    path: ['definitions'],
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
          <TextEditorFormField
            form={form}
            name="transcript"
            label="Transcript"
            placeholder="Enter the transcript here..."
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
          <DefinitionsForm />
        </form>
      </Form>
    </FormProvider>
  );
};

export default ListenForm;
