import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldValues, Path } from 'react-hook-form';
import { PasswordInput } from './ui/password-input';
type InputFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<typeof Input>;
const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  ...props
}: InputFormFieldProps<T>) => {
  const Component = type === 'password' ? PasswordInput : Input;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="text-base md:text-lg">{label}</FormLabel>
          )}
          <FormControl>
            <Component {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputFormField;
