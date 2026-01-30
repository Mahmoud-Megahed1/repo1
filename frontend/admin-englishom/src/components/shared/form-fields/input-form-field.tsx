import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path } from 'react-hook-form';
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<typeof Input>;
const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full flex-1 space-y-0', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputFormField;
