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
      <h2 className="subheading">بيانات الحساب</h2>
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
    label: 'الاسم الأول',
    name: 'firstName',
    placeholder: 'الاسم الأول',
    required: true,
  },
  {
    label: 'اسم العائلة',
    name: 'lastName',
    placeholder: 'اسم العائلة',
    required: true,
  },
  {
    label: 'البريد الإلكتروني',
    name: 'email',
    placeholder: 'البريد الإلكتروني',
    type: 'email',
    id: 'email',
  },
  {
    label: 'كلمة المرور',
    name: 'password',
    placeholder: 'كلمة المرور',
    required: true,
    type: 'password',
  },
];

export default AccountDetailsForm;
