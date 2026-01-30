import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { ComponentProps, FC } from 'react';
type Props = ComponentProps<typeof Loader2>;
const Spinner: FC<Props> = ({ className, ...props }) => {
  return (
    <Loader2 className={cn('mx-auto animate-spin', className)} {...props} />
  );
};

export default Spinner;
