import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React, { useId } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
} & React.ComponentProps<typeof Select>;
const SelectFormField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  options,
  placeholder,
  ...props
}: Props<T>) => {
  const id = useId();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 space-y-1">
          {label && (
            <label className="text-sm font-medium" htmlFor={id}>
              {label}
              {props.required && <span className="text-destructive">*</span>}
            </label>
          )}

          <Select
            onValueChange={(value) => value && field.onChange(value)}
            defaultValue={field.value}
            value={field.value}
            {...props}
          >
            <FormControl>
              <SelectTrigger
                id={id}
                className={cn('bg-transparent', className)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
