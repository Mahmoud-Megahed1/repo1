import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent',
        destructive:
          'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        success:
          'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
        'info-pink':
          'border-pink-200 bg-pink-100 text-pink-800 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300',
        'info-blue':
          'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
        'info-yellow':
          'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
        'info-purple':
          'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
        'info-gray':
          'border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
        'amber-gradient':
          'border-none bg-gradient-to-br from-amber-500 to-amber-700 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export { Badge, badgeVariants, type BadgeVariant };
