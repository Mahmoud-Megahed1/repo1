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
import ExamplesForm from './examples-form';
import UseCases from './use-cases';
import WordForm from './words-form';
import TextEditorFormField from '@/components/shared/form-fields/text-editor-form-field';

export const formSchema = z.object({
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  useCasesAr: z.array(z.string().trim().min(10)),
  useCasesEn: z.array(z.string().trim().min(10)),
  definitionAr: z.string().min(10),
  definitionEn: z.string().min(10),
  examples: z.array(z.string().min(10)),
  words: z.array(z.string().trim().or(z.literal(''))),
  notes: z.string().trim().or(z.literal('')).optional(),
  levelId: z.enum(LEVELS_ID),
  day: z.string(),
});

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const GrammarForm = ({ form, className, ...props }: Props) => {
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className={cn('space-y-4', className)} {...props}>
          <DayLevelPicker control={form.control} />
          <div className="flex gap-4">
            <InputFormField
              name="nameAr"
              control={form.control}
              label="Name (AR)"
            />
            <InputFormField
              name="nameEn"
              control={form.control}
              label="Name (EN)"
            />
          </div>
          <TextareaFormField
            name="definitionAr"
            control={form.control}
            label="Definition (AR)"
          />
          <TextareaFormField
            name="definitionEn"
            control={form.control}
            label="Definition (EN)"
          />
          <TextEditorFormField
            form={form}
            name="notes"
            label="Notes"
            placeholder="Enter any additional notes here..."
          />
          <UseCases />
          <SelectSeparator className="bg-primary/50" />
          <ExamplesForm />
          <SelectSeparator className="bg-primary/50" />
          <WordForm />
        </form>
      </Form>
    </FormProvider>
  );
};

export default GrammarForm;
