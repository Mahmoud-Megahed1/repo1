import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<typeof Select> & {
  placeholder?: string;
  label?: string;
  options?: {
    label: string;
    value: string;
  }[];
};
const CustomSelect: FC<Props> = ({
  placeholder = 'Select a value',
  options = [],
  label,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col gap-1', {
        contents: !label,
      })}
    >
      {label && <span>{label}</span>}
      <Select {...props}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
