import InputFormField from '@/components/shared/form-fields/input-form-field';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';
import { PlusIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstructionsForm = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove } = useFieldArray({
    name: 'instructions',
    control,
  });
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Instructions</h4>
      {fields.map((field, index) =>
        fields.length === 1 || index === fields.length - 1 ? (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex flex-1 gap-2">
              <InputFormField
                name={`instructions.${index}.word`}
                control={control}
                className="w-[100px] flex-none"
                label="Word"
              />
              <InputFormField
                name={`instructions.${index}.definition`}
                control={control}
                className="flex-1"
                label="Instruction"
              />
            </div>
            <Button
              type="button"
              onClick={() =>
                append({
                  word: '',
                  definition: '',
                })
              }
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex flex-1 gap-2">
              <InputFormField
                name={`instructions.${index}.word`}
                control={control}
                className="w-[100px] flex-none"
                label="Word"
              />
              <InputFormField
                name={`instructions.${index}.definition`}
                control={control}
                className="flex-1"
                label="Instruction"
              />
            </div>
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

export default InstructionsForm;
