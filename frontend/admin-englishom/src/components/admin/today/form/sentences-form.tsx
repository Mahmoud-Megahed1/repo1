import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';

const SentencesForm = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove } = useFieldArray({
    name: 'sentences',
    control,
  });
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Sentences</h4>
      {fields.map((field, index) =>
        fields.length === 1 || index === fields.length - 1 ? (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField name={`sentences.${index}`} control={control} />
            <Button type="button" onClick={() => append(' ')}>
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField name={`sentences.${index}`} control={control} />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      )}
    </div>
  );
};

export default SentencesForm;
