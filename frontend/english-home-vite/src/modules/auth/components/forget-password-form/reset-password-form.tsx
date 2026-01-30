import InputFormField from '@components/form-fields/input-form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import usePageTitle from '@hooks/use-page-title';
import { cn } from '@lib/utils';
import { useResetPassword } from '@modules/auth/mutations';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import { Form } from '@ui/form';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const useLocalizedSchema = () => {
  const { t } = useTranslation();
  return z
    .object({
      password: z
        .string({ error: t('Global.form-fields.password.required-error') })
        .min(6, t('Global.form-fields.password.min-error', { min: 6 })),
      confirmPassword: z
        .string({ error: t('Global.form-fields.password.required-error') })
        .min(6, t('Global.form-fields.password.min-error', { min: 6 })),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(
        'Auth.forget-password-form.resetPasswordForm.passwordDoesNotMatch'
      ),
      path: ['confirmPassword'],
    });
};

const ResetPasswordForm = ({ resetToken }: { resetToken: string }) => {
  const { t } = useTranslation();
  const formSchema = useLocalizedSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { mutate, isPending } = useResetPassword();
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ data: { newPassword: values.password, resetToken } });
  }

  usePageTitle(t('Auth.forget-password-form.resetPasswordForm.title'));

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            {t('Auth.forget-password-form.resetPasswordForm.title')}
          </h1>
          <p className="text-muted-foreground text-balance text-sm">
            {t('Auth.forget-password-form.resetPasswordForm.description')}
          </p>
        </div>
        <div className="grid gap-6">
          <InputFormField
            name="password"
            control={form.control}
            label={t('Global.form-fields.password.label')}
            placeholder={t('Global.form-fields.password.placeholder')}
            type="password"
          />
          <InputFormField
            name="confirmPassword"
            control={form.control}
            label={t(
              'Auth.forget-password-form.resetPasswordForm.confirmPasswordLabel'
            )}
            type="password"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t('Auth.forget-password-form.resetPasswordForm.resetPassword')
            )}
          </Button>

          <Button
            variant="ghost"
            className="text-muted-foreground w-full"
            asChild
          >
            <Link to="/login">
              <ArrowLeft className="inline size-4 rtl:rotate-180" />
              <span>{t('Auth.forget-password-form.backToLogin')}</span>
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
