import React from 'react';
import { formSchema } from './schema';
import { z } from 'zod';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import ImageFormField from '@/components/shared/form-fields/image-form-field';
import { Input } from '@/components/ui/input';
import InputFormField from '@/components/shared/form-fields/input-form-field';

const Examples = () => {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove } = useFieldArray({
    name: 'examples',
    control: form.control,
  });
  return (
    <div className="flex flex-col">
      <h4 className="font-bold">Examples</h4>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2">
            <div>
              <ImageFormField
                name={`examples.${index}.pictureSrc`}
                form={form}
              />
              {form.formState.errors.examples?.[index]?.pictureSrc?.message && (
                <p className="text-sm font-semibold text-destructive">
                  {
                    form.formState.errors.examples?.[index]?.pictureSrc
                      ?.message as string
                  }
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <InputFormField
                name={`examples.${index}.exampleAr`}
                control={form.control}
                label="Arabic"
              />
              <InputFormField
                name={`examples.${index}.exampleEn`}
                control={form.control}
                label="English"
              />
            </div>
            <div>
              <label htmlFor="soundSrc">Audio</label>
              <Input
                type="file"
                accept="audio/mp3"
                id="soundSrc"
                onChange={(e) => {
                  form.setValue(
                    `examples.${index}.soundSrc`,
                    e.target.files![0],
                  );
                  form.trigger(`examples.${index}.soundSrc`);
                }}
              />
              {form.formState.errors.examples?.[index]?.soundSrc?.message && (
                <p className="text-sm font-semibold text-destructive">
                  {
                    form.formState.errors.examples?.[index]?.soundSrc
                      ?.message as string
                  }
                </p>
              )}
            </div>
            <InputFormField
              name={`examples.${index}.sentence`}
              control={form.control}
              label="Sentence"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="w-fit self-end"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({} as never)}>
          <PlusIcon /> Add Example
        </Button>
      </div>
    </div>
  );
};

export default Examples;
