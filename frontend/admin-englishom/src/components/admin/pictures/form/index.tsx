'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import ImageFormField from '@/components/shared/form-fields/image-form-field';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import TextareaFormField from '@/components/shared/form-fields/textarea-form-field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import ExamplesForm from './examples-form';

export const formSchema = z.object({
  pictureSrc: z.any().refine((val) => !!val, {
    message: 'Picture is required',
  }),
  soundSrc: z.any().refine((val) => !!val, { message: 'Sound is required' }),
  wordAr: z.string().min(2),
  wordEn: z.string().min(2),
  definition: z.string(),
  examples: z.array(z.string().trim().min(10)),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const PictureForm = ({ form, className, ...props }: Props) => {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className={cn('space-y-4', className)} {...props}>
          <DayLevelPicker control={form.control} />
          <div className="flex gap-4">
            <InputFormField
              name={'wordAr'}
              control={form.control}
              label="Word (AR)"
            />
            <InputFormField
              name={'wordEn'}
              control={form.control}
              label="Word (EN)"
            />
          </div>
          <TextareaFormField
            name={'definition'}
            control={form.control}
            label="Definition"
          />
          <SelectSeparator className="bg-primary/50" />
          <ExamplesForm />
          <ImageFormField form={form} name="pictureSrc" />
          <div>
            <Input
              type="file"
              accept="audio/mp3"
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
        </form>
      </Form>
    </FormProvider>
  );
};

export default PictureForm;
