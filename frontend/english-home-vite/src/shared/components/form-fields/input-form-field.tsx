import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { PasswordInput } from '@ui/password-input';
import { type Control, type FieldValues, type Path } from 'react-hook-form';
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<typeof Input>;

const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: Props<T>) => {
  const Comp = props.type === 'password' ? PasswordInput : Input;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-1 flex-col gap-2 space-y-0">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Comp {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputFormField;
