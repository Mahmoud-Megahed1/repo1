'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import ImageFormField from '@/components/shared/form-fields/image-form-field';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
export const formSchema = z.object({
  pictureSrc: z.any().refine((val) => !!val, {
    message: 'Picture is required',
  }),
  soundSrc: z.any().refine((val) => !!val, {
    message: 'Sound file is required',
  }),
  exampleAr: z.string().min(4),
  exampleEn: z.string().min(4),
  sentence: z.string().min(4),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const PhrasalVerbForm = ({ form, className, ...props }: Props) => {
  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...props}>
        <DayLevelPicker control={form.control} />
        <div className="flex gap-4">
          <InputFormField
            name="exampleAr"
            control={form.control}
            label="Example(AR)"
          />
          <InputFormField
            name="exampleEn"
            control={form.control}
            label="Example(EN)"
          />
        </div>
        <InputFormField
          name="sentence"
          control={form.control}
          label="Sentence"
        />
        <SelectSeparator className="bg-primary/50" />
        <ImageFormField form={form} name="pictureSrc" />
        <Input
          type="file"
          accept="audio/mp3"
          onChange={(e) => {
            form.setValue('soundSrc' as never, e.target.files![0] as never);
          }}
        />
      </form>
    </Form>
  );
};

export default PhrasalVerbForm;
