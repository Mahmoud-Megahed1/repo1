'use client';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransitionRouter } from 'next-view-transitions';
import React, { FC } from 'react';

const GoBack: FC<React.HTMLAttributes<HTMLButtonElement>> = ({
  className,
  onClick,
  ...props
}) => {
  const router = useTransitionRouter();

  return (
    <button
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-foreground dark:bg-neutral-100',
        className,
      )}
      onClick={(e) => {
        if (onClick) return onClick(e);
        router.back();
      }}
      {...props}
    >
      <ArrowLeftIcon className="text-neutral-500" />
    </button>
  );
};
export default GoBack;
