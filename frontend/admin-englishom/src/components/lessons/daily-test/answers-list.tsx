/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React, { useCallback, useId, useState } from 'react';
type ContextType<T> = {
  selectedValues: T[];
  // eslint-disable-next-line no-unused-vars
  handleChange: (value: T) => void;
};

const AnswersGroupContext = React.createContext<ContextType<any> | undefined>(
  undefined,
);
type AnswersGroupProps<T> = React.ComponentProps<'ul'> & {
  children: React.ReactNode;
  values?: T[];
  // eslint-disable-next-line no-unused-vars
  onValuesChange?: (values: T[]) => void;
  allowMultiple?: boolean;
};
const AnswersGroup = <T,>({
  children,
  onValuesChange,
  values = [],
  className,
  allowMultiple = false,
  ...props
}: AnswersGroupProps<T>) => {
  const [selectedValues, setSelectedValues] = useState<T[]>(values || []);
  const handleChange = useCallback(
    (value: T) => {
      let newValues;
      if (allowMultiple) {
        newValues = selectedValues.includes(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value];
      } else {
        newValues = selectedValues[0] === value ? [] : [value];
      }
      setSelectedValues(newValues);
      onValuesChange?.(newValues);
    },
    [selectedValues, onValuesChange, allowMultiple],
  );

  return (
    <AnswersGroupContext.Provider value={{ selectedValues, handleChange }}>
      <ul className={cn('mt-4 space-y-4', className)} {...props}>
        {children}
      </ul>
    </AnswersGroupContext.Provider>
  );
};

const answerItemVariants = cva(
  'block rounded-lg border p-4 peer-disabled:bg-gray-100 peer-disabled:text-gray-400 peer-data-[state=checked]:border-transparent peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'text-primary',
        correct:
          'border-transparent bg-emerald-100 text-emerald-800 peer-data-[state=checked]:bg-emerald-100 peer-data-[state=checked]:text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100 peer-data-[state=checked]:dark:bg-emerald-950 peer-data-[state=checked]:dark:text-emerald-100',
        wrong:
          'border-transparent bg-red-100 text-red-800 peer-data-[state=checked]:bg-red-100 peer-data-[state=checked]:text-red-800 dark:bg-red-950 dark:text-red-100 peer-data-[state=checked]:dark:bg-red-950 peer-data-[state=checked]:dark:text-red-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type AnswerChooseProps<T> = Omit<
  React.ComponentProps<typeof Checkbox>,
  'onCheckedChange' | 'value'
> & {
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (value?: T) => void;
  value: T;
} & VariantProps<typeof answerItemVariants>;
const AnswerItem = <T,>({
  className,
  children,
  value,
  onValueChange,
  variant,
  ...props
}: AnswerChooseProps<T>) => {
  const id = useId();
  const { handleChange, selectedValues } = useAnswersGroup();
  const isSelected = selectedValues.includes(value);
  return (
    <>
      <Checkbox
        onCheckedChange={(checked) => {
          handleChange(value);
          onValueChange?.(checked ? value : undefined);
        }}
        checked={isSelected}
        id={id}
        hidden
        className="peer"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(answerItemVariants({ variant, className }))}
      >
        {children}
      </label>
    </>
  );
};

const useAnswersGroup = () => {
  const context = React.useContext(AnswersGroupContext);
  if (context === undefined) {
    throw new Error('useAnswersGroup must be used within a AnswersGroup');
  }
  return context;
};

export { AnswerItem, AnswersGroup };
