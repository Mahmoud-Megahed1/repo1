import { Link } from '@/shared/i18n/routing';
import InputFormField from '@components/form-fields/input-form-field';
import { FacebookIcon, GoogleIcon } from '@components/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Form } from '@ui/form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import Layout from './layout';
import { useSignup } from '../mutations';
import { Checkbox } from '@ui/checkbox';
import { useState } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { facebookAuth, googleAuth } from '../services';

const useLocalizedSchema = () => {
  const { t } = useTranslation();
  return z.object({
    firstName: z
      .string(t('Global.form-fields.required-error'))
      .min(1, t('Global.form-fields.required-error')),
    lastName: z
      .string(t('Global.form-fields.required-error'))
      .min(1, t('Global.form-fields.required-error')),
    email: z.email(t('Global.form-fields.email.error')),
    password: z
      .string({ error: t('Global.form-fields.password.required-error') })
      .min(6, t('Global.form-fields.password.min-error', { min: 6 }))
      .max(20, t('Global.form-fields.password.max-error', { max: 20 })),
  });
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const formSchema = useLocalizedSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isAcceptTerms, setIsAcceptTerms] = useState<CheckedState>(false);
  const { mutate, isPending } = useSignup();
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      { data: values },
      {
        onError(error) {
          // Email already exists
          if (error.status === 409) {
            form.setError('email', {
              message: t('Global.form-fields.email.alreadyExists'),
            });
          }
        },
      }
    );
  }

  const { t } = useTranslation();
  return (
    <Layout>
      <Form {...form}>
        <form
          className={cn('flex flex-col gap-6', className)}
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
              {t('Auth.signup-form.title')}
            </h1>
            <p className="text-muted-foreground text-balance text-sm">
              {t('Auth.signup-form.description')}
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <InputFormField
                name="firstName"
                label={t('Auth.signup-form.first-name-label')}
                placeholder={t('Auth.signup-form.first-name-placeholder')}
                control={form.control}
              />
              <InputFormField
                name="lastName"
                label={t('Auth.signup-form.last-name-label')}
                placeholder={t('Auth.signup-form.last-name-placeholder')}
                control={form.control}
              />
            </div>
            <InputFormField
              name="email"
              label={t('Global.form-fields.email.label')}
              placeholder={t('Global.form-fields.email.placeholder')}
              control={form.control}
            />
            <InputFormField
              name="password"
              label={t('Global.form-fields.password.label')}
              placeholder={t('Global.form-fields.password.placeholder')}
              control={form.control}
              type="password"
            />
            <div className="flex items-center gap-2">
              <Checkbox id="terms" onCheckedChange={setIsAcceptTerms} />
              <label htmlFor="terms" className="text-muted-foreground text-sm">
                {t('Auth.signup-form.accept-terms')}{' '}
                <Link
                  to="/terms-and-conditions"
                  className="font-medium underline underline-offset-4"
                >
                  {t('TermsAndConditions.title')}
                </Link>
                {' & '}
                <Link
                  to="/privacy-policy"
                  className="font-medium underline underline-offset-4"
                >
                  {t('PrivacyPolicy.title')}
                </Link>
              </label>
            </div>
          </div>
          <div className="grid gap-3">
            <Button
              type="submit"
              disabled={isPending || !isAcceptTerms}
              className="w-full"
            >
              {isPending
                ? t('Global.loading') + '...'
                : t('Auth.signup-form.signup-button')}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                {t('Auth.or-continue')}
              </span>
            </div>
            <div>
              <Button
                variant="outline"
                type="button"
                onClick={googleAuth}
                className="w-full"
              >
                <GoogleIcon />
                {t('Auth.signup-form.signup-with-google')}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={facebookAuth}
                className="mt-3 w-full"
              >
                <FacebookIcon />
                {t('Auth.signup-form.signup-with-facebook')}
              </Button>
            </div>
          </div>
          <div className="text-center text-sm">
            {t('Auth.signup-form.has-account')}{' '}
            <Link to="/login" className="underline underline-offset-4">
              {t('Auth.signup-form.login-link')}
            </Link>
          </div>
        </form>
      </Form>
    </Layout>
  );
}
