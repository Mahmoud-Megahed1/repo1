import { cn } from '@lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/accordion';
import { Card, CardContent, CardDescription, CardHeader } from '@ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import React, { useId, type FC } from 'react';

export const accordionVariants = cva(
  'rounded-xl bg-gradient-to-br p-3 shadow-lg',
  {
    variants: {
      variant: {
        default: 'to-primary dark:to-secondary from-[#96796e]',
        blue: 'from-blue-500 to-blue-700',
        green: 'from-green-500 to-green-700',
        purple: 'from-purple-500 to-purple-700',
        amber: 'from-amber-500 to-amber-700',
        destructive: 'bg-destructive dark:bg-destructive/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type Props = {
  className?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  opened?: boolean;
} & VariantProps<typeof accordionVariants>;
const CustomAccordion: FC<Props> = ({
  className,
  title,
  description,
  icon: Icon,
  children,
  variant,
  opened = false,
}) => {
  const id = useId();
  return (
    <Accordion type="single" defaultValue={opened ? id : undefined} collapsible>
      <Card>
        <AccordionItem value={id} className="group">
          <CardHeader className="w-full">
            <AccordionTrigger className="flex w-full cursor-pointer items-center gap-4 py-0 text-start hover:no-underline">
              <div className="flex items-center gap-4">
                <div className={cn(accordionVariants({ variant }))}>
                  {Icon && <Icon className="h-6 w-6 text-white" />}
                </div>
                <div className="rtl:space-y-1">
                  <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
                </div>
              </div>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className={cn('mt-8', className)}>
              {children}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
};

export default CustomAccordion;
