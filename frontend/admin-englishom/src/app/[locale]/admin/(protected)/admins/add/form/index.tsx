import RadioFormField from '@/components/shared/form-fields/radio-form-field';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FormInputsType } from '@/types/global.types';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import AccountDetailsForm, { FORM_INPUTS } from './account-details';
import { schema } from './schema';

type Props = Omit<React.HTMLProps<HTMLFormElement>, 'form'> & {
  form: UseFormReturn<z.infer<typeof schema>>;
  formInputs?: FormInputsType[];
};
const AdminForm = ({
  form,
  className,
  formInputs = FORM_INPUTS,
  ...props
}: Props) => {
  return (
    <Form {...form}>
      <form
        className={cn(
          'flex flex-col gap-6 md:flex-row md:items-start',
          className,
        )}
        noValidate
        {...props}
      >
        <section className="flex flex-1 flex-col gap-4">
          <AccountDetailsForm form={form} formInputs={formInputs} />
          <div className="box flex flex-col gap-4">
            <h2 className="subheading">Account Type</h2>
            <RadioFormField
              control={form.control}
              name={'adminRole'}
              options={[
                { value: 'super', label: 'Super Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'operator', label: 'Operator' },
                { value: 'view', label: 'Viewer' },
              ]}
            />
          </div>
        </section>
      </form>
    </Form>
  );
};

export default AdminForm;
