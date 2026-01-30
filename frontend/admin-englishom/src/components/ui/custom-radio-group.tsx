'use client';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import React, { FC, useEffect } from 'react';
type CustomRadioGroupProps = React.ComponentProps<typeof RadioGroup> & {
  options: {
    label: string;
    value: string;
  }[];
};
const CustomRadioGroup: FC<CustomRadioGroupProps> = ({
  defaultValue,
  value,
  options,
  onValueChange,
  className,
  ...props
}) => {
  const [selected, setSelected] = React.useState(defaultValue || value);
  useEffect(() => {
    setSelected(defaultValue || value);
  }, [defaultValue, value]);
  return (
    <RadioGroup
      defaultValue={selected ?? undefined}
      onValueChange={(value) => {
        setSelected(value);
        onValueChange?.(value);
      }}
      className={cn('flex gap-4', className)}
      {...props}
    >
      {options.map(({ label, value }) => (
        <div key={value}>
          <Button
            variant={selected === value ? 'default' : 'outline'}
            className="button rounded-sm font-medium leading-none"
            asChild
          >
            <label htmlFor={value} className="cursor-pointer">
              {label}
            </label>
          </Button>
          <RadioGroupItem tabIndex={-1} value={value} id={value} hidden />
        </div>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
