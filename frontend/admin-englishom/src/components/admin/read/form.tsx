'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import TextEditorFormField from '@/components/shared/form-fields/text-editor-form-field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const formSchema = z.object({
  transcript: z.string(),
  soundSrc: z.any().refine((val) => !!val),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const ReadForm = ({ form, className, ...props }: Props) => {
  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...props}>
        <DayLevelPicker control={form.control} />
        <TextEditorFormField
          form={form}
          name="transcript"
          label="Transcript"
          placeholder="Enter the transcript here..."
        />
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
            <p className="text-sm text-red-400">
              {form.formState.errors.soundSrc.message as string}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ReadForm;
