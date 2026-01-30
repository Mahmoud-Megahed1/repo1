import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';
import { Input } from '@/components/ui/input';

const SentencesForm = () => {
  const { control, ...form } = useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove } = useFieldArray({
    name: 'sentences',
    control,
  });
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">Sentences</h4>
      <div className="flex flex-col gap-8">
        {fields.map((field, index) =>
          fields.length === 1 || index === fields.length - 1 ? (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <InputFormField
                  name={`sentences.${index}.sentence`}
                  control={control}
                />
                <div>
                  <Input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => {
                      form.setValue(
                        `sentences.${index}.soundSrc`,
                        e.target.files![0],
                      );
                      form.trigger(`sentences.${index}.soundSrc`);
                    }}
                  />
                  {form.formState.errors.sentences?.[index]?.soundSrc
                    ?.message && (
                    <p className="text-sm text-red-400">
                      {
                        form.formState.errors.sentences?.[index]?.soundSrc
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => append({ sentence: '', soundSrc: '' })}
              >
                <PlusIcon />
              </Button>
            </div>
          ) : (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <InputFormField
                  name={`sentences.${index}.sentence`}
                  control={control}
                />
                <div>
                  <Input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => {
                      form.setValue(
                        `sentences.${index}.soundSrc`,
                        e.target.files![0],
                      );
                      form.trigger(`sentences.${index}.soundSrc`);
                    }}
                  />
                  {form.formState.errors.sentences?.[index]?.soundSrc
                    ?.message && (
                    <p className="text-sm text-red-400">
                      {
                        form.formState.errors.sentences?.[index]?.soundSrc
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
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
    </div>
  );
};

export default SentencesForm;
