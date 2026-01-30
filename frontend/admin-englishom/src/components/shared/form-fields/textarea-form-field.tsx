import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path } from 'react-hook-form';
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<typeof Textarea>;
const TextareaFormField = <T extends FieldValues>({
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
        <FormItem className={cn('space-y-0', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea className="resize-none" {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaFormField;
