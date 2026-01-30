import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & Partial<
  Pick<React.ComponentProps<typeof InputOTP>, 'maxLength' | 'pattern'>
>;

const InputOTPFormField = <T extends FieldValues>({
  control,
  name,
  label,
  maxLength = 6,
  pattern = REGEXP_ONLY_DIGITS,
}: Props<T>) => {
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
            <InputOTP maxLength={maxLength} pattern={pattern} {...field}>
              <InputOTPGroup lang="en">
                {Array.from({ length: maxLength }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputOTPFormField;
