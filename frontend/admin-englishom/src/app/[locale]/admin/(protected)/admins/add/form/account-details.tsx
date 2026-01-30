import InputFormField from '@/components/shared/form-fields/input-form-field';
import { FormInputsType } from '@/types/global.types';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { schema } from './schema';
type Props = {
  form: UseFormReturn<z.infer<typeof schema>>;
  formInputs: FormInputsType[];
};

const AccountDetailsForm = ({ form, formInputs }: Props) => {
  return (
    <div className="box flex flex-col gap-4">
      <h2 className="subheading">Account Details</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formInputs.map(({ name, ...props }) => (
          <InputFormField
            control={form.control}
            name={name as never}
            key={name}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export const FORM_INPUTS: FormInputsType[] = [
  {
    label: 'First Name',
    name: 'firstName',
    placeholder: 'First Name',
    required: true,
  },
  {
    label: 'Last Name',
    name: 'lastName',
    placeholder: 'Last Name',
    required: true,
  },
  {
    label: 'Email',
    name: 'email',
    placeholder: 'Email',
    type: 'email',
    id: 'email',
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Password',
    required: true,
    type: 'password',
  },
];

export default AccountDetailsForm;
