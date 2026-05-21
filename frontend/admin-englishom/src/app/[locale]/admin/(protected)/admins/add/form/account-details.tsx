import InputFormField from '@/components/shared/form-fields/input-form-field';
import { FormInputsType } from '@/types/global.types';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { schema } from './schema';
import { useTranslations } from 'next-intl';
type Props = {
  form: UseFormReturn<z.infer<typeof schema>>;
  formInputs: FormInputsType[];
};

const AccountDetailsForm = ({ form, formInputs }: Props) => {
  const t = useTranslations('Admin.adminForm');
  return (
    <div className="box flex flex-col gap-4">
      <h2 className="subheading">{t('accountDetails')}</h2>
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

export function getFormInputs(t: (key: string) => string): FormInputsType[] {
  return [
    {
      label: t('firstName'),
      name: 'firstName',
      placeholder: t('firstName'),
      required: true,
    },
    {
      label: t('lastName'),
      name: 'lastName',
      placeholder: t('lastName'),
      required: true,
    },
    {
      label: t('email'),
      name: 'email',
      placeholder: t('email'),
      type: 'email',
      id: 'email',
    },
    {
      label: t('password'),
      name: 'password',
      placeholder: t('password'),
      required: true,
      type: 'password',
    },
  ];
}

// Keep FORM_INPUTS for backward compatibility but with English defaults
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
