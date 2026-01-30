import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

const AnswersForm = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>();
  const {
    fields: answers,
    append: append,
    remove: remove,
  } = useFieldArray({
    name: 'answers',
    control,
  });
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Answers</h4>
      {answers.map((field, index) =>
        answers.length === 1 || index === answers.length - 1 ? (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex w-full gap-2">
              <FormField
                control={control}
                name={`answers.${index}.isCorrect`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="relative top-1/2 -translate-y-1/4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <InputFormField
                name={`answers.${index}.text`}
                control={control}
                className="flex-1"
                label="Text"
              />
            </div>
            <Button
              type="button"
              onClick={() => append({ text: ' ', isCorrect: false })}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex w-full gap-2">
              <FormField
                control={control}
                name={`answers.${index}.isCorrect`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="relative top-1/2 -translate-y-1/4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <InputFormField
                name={`answers.${index}.text`}
                control={control}
                className="flex-1"
                label="Text"
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

export default AnswersForm;
