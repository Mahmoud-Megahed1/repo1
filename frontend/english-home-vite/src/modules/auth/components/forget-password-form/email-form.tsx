import InputFormField from '@components/form-fields/input-form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import usePageTitle from '@hooks/use-page-title';
import { useForgotPassword } from '@modules/auth/mutations';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import { Form } from '@ui/form';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const useLocalizedSchema = () => {
  const { t } = useTranslation();
  return z.object({
    email: z.email(t('Global.form-fields.email.error')),
  });
};

const EmailForm = ({
  onSuccess,
  defaultValue,
}: {
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (email: string) => void;
  defaultValue?: string;
}) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useForgotPassword();
  const formSchema = useLocalizedSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: defaultValue },
  });

  function onSubmit({ email }: z.infer<typeof formSchema>) {
    mutate(
      { data: { email } },
      {
        onSuccess() {
          onSuccess?.(email);
        },
      }
    );
  }
  usePageTitle(t('Auth.forget-password-form.emailForm.title'));
  return (
    <Form {...form}>
      <div>
        <h2 className="mb-2 text-2xl font-semibold md:mt-16 md:text-3xl">
          {t('Auth.forget-password-form.emailForm.title')}
        </h2>
        <p className="mb-8 text-sm md:text-base">
          {t('Auth.forget-password-form.emailForm.description')}
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputFormField
          name="email"
          label={t('Global.form-fields.email.label')}
          placeholder={t('Global.form-fields.email.placeholder')}
          control={form.control}
          lang="en"
          className="rtl:placeholder:font-cairo rtl:placeholder:text-right"
        />

        <Button
          className="mt-8 w-full shadow-md"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            t('Auth.forget-password-form.continue')
          )}
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground mt-4 w-full"
          asChild
        >
          <Link to="/login">
            <ArrowLeft className="inline size-4 rtl:rotate-180" />
            <span>{t('Auth.forget-password-form.backToLogin')}</span>
          </Link>
        </Button>
      </form>
    </Form>
  );
};

export default EmailForm;
