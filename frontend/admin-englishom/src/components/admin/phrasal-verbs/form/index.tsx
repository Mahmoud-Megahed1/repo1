'use client';
import DayLevelPicker from '@/components/shared/day-level-picker';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import { Form } from '@/components/ui/form';
import { SelectSeparator } from '@/components/ui/select';
import { LEVELS_ID } from '@/constants';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import UseCases from './use-cases';
import Examples from './examples';

import { formSchema } from './schema';

export { formSchema };

type Props = {
    form: UseFormReturn<z.infer<typeof formSchema>>;
} & React.ComponentProps<'form'>;

const PhrasalVerbForm = ({ form, className, ...props }: Props) => {
    return (
        <Form {...form}>
            <form className={cn('space-y-4', className)} {...props}>
                <DayLevelPicker control={form.control} />
                <InputFormField
                    name="definitionAr"
                    control={form.control}
                    label="Definition (Arabic)"
                />
                <InputFormField
                    name="definitionEn"
                    control={form.control}
                    label="Definition (English)"
                />
                <UseCases />
                <SelectSeparator className="bg-primary/50" />
                <Examples />
            </form>
        </Form>
    );
};

export default PhrasalVerbForm;
