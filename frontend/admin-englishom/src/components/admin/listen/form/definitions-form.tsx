import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectSeparator } from '@/components/ui/select';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '.';
import { useEffect } from 'react';

function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || '';
}

const DefinitionsForm = () => {
  const { control, setValue, watch, formState: { errors } } =
    useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove, replace } = useFieldArray({
    name: 'definitions',
    control,
  });
  const transcript = watch('transcript') || '';
  useEffect(() => {
    const matchedWords = (transcript.match(/{(.*?)}/g) || []).map(word => 
      stripHtml(word.replace(/[{}]/g, ''))
    );
    
    // Get current definitions to merge
    const currentDefs = watch('definitions') || [];
    
    // Merge: Keep existing definition and soundSrc if word is still in the matched list
    const newDefs = matchedWords.map(word => {
      const existing = currentDefs.find(d => d && d.word === word);
      if (existing) {
        return existing;
      }
      return {
        word,
        definition: '',
        soundSrc: undefined
      };
    });
    
    // Compare newDefs with currentDefs to prevent infinite loop
    const hasChanged = newDefs.length !== currentDefs.length || 
      newDefs.some((d, idx) => {
        const cur = currentDefs[idx];
        return !cur || d.word !== cur.word || d.definition !== cur.definition || d.soundSrc !== cur.soundSrc;
      });
      
    if (hasChanged) {
      replace(newDefs as any);
    }
  }, [replace, transcript, watch]);
  if (fields.length === 0) return null;
  return (
    <>
      <SelectSeparator className="bg-primary/50" />
      <div className="flex flex-col">
        <h4 className="font-bold">Definitions</h4>
        <div className="space-y-4 divide-y divide-primary/50">
          {fields.map((field, index) =>
            fields.length === 1 || index === fields.length - 1 ? (
              <div key={field.id} className="flex items-end gap-2 pt-2">
                <div className="flex flex-1 flex-wrap gap-2">
                  <InputFormField
                    name={`definitions.${index}.word`}
                    control={control}
                    className="w-[100px] flex-none"
                    label="Word"
                  />
                  <InputFormField
                    name={`definitions.${index}.definition`}
                    control={control}
                    className="flex-1"
                    label="Definition"
                  />
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full gap-2">
                      <Input
                        type="file"
                        accept="audio/mp3"
                        className="mt-auto"
                        onChange={(e) => {
                          setValue(
                            `definitions.${index}.soundSrc`,
                            e.target.files![0],
                          );
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          append({ definition: '', word: '', soundSrc: '' })
                        }
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    {errors.definitions?.[index]?.soundSrc && (
                      <p className="text-xs font-semibold text-destructive">
                        {errors.definitions[index].soundSrc.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={field.id} className="flex items-end gap-2 pt-2">
                <div className="flex flex-1 flex-wrap gap-2">
                  <InputFormField
                    name={`definitions.${index}.word`}
                    control={control}
                    className="w-[100px] flex-none"
                    label="Word"
                  />
                  <InputFormField
                    name={`definitions.${index}.definition`}
                    control={control}
                    className="flex-1"
                    label="Definition"
                  />
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full gap-2">
                      <Input
                        type="file"
                        accept="audio/mp3"
                        className="mt-auto"
                        onChange={(e) => {
                          setValue(
                            `definitions.${index}.soundSrc`,
                            e.target.files![0],
                          );
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    {errors.definitions?.[index]?.soundSrc && (
                      <p className="text-xs font-semibold text-destructive">
                        {errors.definitions[index].soundSrc.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default DefinitionsForm;
