import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';

const ExamplesForm = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>();
  const {
    fields: examples,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    name: 'examples',
    control,
  });
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Examples</h4>
      {examples.map((field, index) =>
        examples.length === 1 || index === examples.length - 1 ? (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField name={`examples.${index}`} control={control} />
            <Button type="button" onClick={() => appendExample(' ')}>
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField name={`examples.${index}`} control={control} />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeExample(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      )}
    </div>
  );
};

export default ExamplesForm;
