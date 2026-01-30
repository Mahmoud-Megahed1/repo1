import CustomRadioGroup from '@/components/ui/custom-radio-group';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import React, { useId } from 'react';
import { FieldValues, Control, Path } from 'react-hook-form';

type RadioFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<typeof CustomRadioGroup>;
const RadioFormField = <T extends FieldValues>({
  control,
  name,
  label,
  onValueChange,
  required,
  ...props
}: RadioFormFieldProps<T>) => {
  const id = useId();
  return (
    <div
      className={cn({
        contents: !label,
        'flex flex-col gap-1': label,
      })}
    >
      {label && (
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormControl>
              <CustomRadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  onValueChange?.(value);
                }}
                value={field.value}
                id={id}
                {...props}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RadioFormField;
