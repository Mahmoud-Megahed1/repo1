'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Form } from '@/components/ui/form';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import UseCases from './use-cases';
import Examples from './examples';

export const formSchema = z.object({
  useCasesAr: z.array(z.string().trim().min(10)),
  useCasesEn: z.array(z.string().trim().min(10)),
  examples: z.array(
    z.object({
      pictureSrc: z.any().refine((val) => !!val, {
        message: 'Picture is required',
      }),
      soundSrc: z.any().refine((val) => !!val, {
        message: 'Sound file is required',
      }),
      exampleAr: z.string().min(4),
      exampleEn: z.string().min(4),
      sentence: z.string().min(4),
    }),
  ),
  definitionAr: z.string().min(10),
  definitionEn: z.string().min(10),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const IdiomForm = ({ form, className, ...props }: Props) => {
  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...props}>
        <DayLevelPicker control={form.control} />
        <InputFormField
          name="definitionAr"
          control={form.control}
          label="Definition (Arabic)"
        />
        <InputFormField
          name="definitionEn"
          control={form.control}
          label="Definition (English)"
        />
        <UseCases />
        <SelectSeparator className="bg-primary/50" />
        <Examples />
      </form>
    </Form>
  );
};

export default IdiomForm;
