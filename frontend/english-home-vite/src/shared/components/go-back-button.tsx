import { cn } from '@lib/utils';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { ChevronLeft } from 'lucide-react';
import React, { type FC } from 'react';

const GoBackButton: FC<React.ComponentProps<typeof Button>> = ({
  className,
  ...props
}) => {
  const router = useRouter().history;
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      size="icon"
      className={cn('shrink-0 rounded-full', className)}
      {...props}
    >
      <ChevronLeft className="size-5" />
    </Button>
  );
};

export const WithBackButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props}>
      <GoBackButton />
      {children}
    </div>
  );
};

export default GoBackButton;
