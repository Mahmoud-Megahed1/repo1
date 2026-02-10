import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './schema';

const UseCases = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>();
  const {
    fields: fieldsAr,
    append: appendAr,
    remove: removeAr,
  } = useFieldArray({
    name: 'useCasesAr',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
  });
  const { append: appendEn, remove: removeEn } = useFieldArray({
    name: 'useCasesEn',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
  });

  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-sm font-bold">Use Cases</h4>
      {fieldsAr.map((field, index) =>
        fieldsAr.length === 1 || index === fieldsAr.length - 1 ? (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField
              label="Arabic"
              name={`useCasesAr.${index}`}
              control={control}
            />
            <InputFormField
              label="English"
              name={`useCasesEn.${index}`}
              control={control}
            />
            <Button
              type="button"
              onClick={() => {
                appendAr(' ');
                appendEn(' ');
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <div key={field.id} className="flex items-end gap-2">
            <InputFormField
              label="Arabic"
              name={`useCasesAr.${index}`}
              control={control}
            />
            <InputFormField
              label="English"
              name={`useCasesEn.${index}`}
              control={control}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                removeAr(index);
                removeEn(index);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      )}
    </div>
  );
};

export default UseCases;
