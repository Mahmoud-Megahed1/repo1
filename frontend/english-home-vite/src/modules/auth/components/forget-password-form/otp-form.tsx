import InputOTPFormField from '@components/form-fields/input-otp-form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import usePageTitle from '@hooks/use-page-title';
import { useVerifyForgetPasswordOtp } from '@modules/auth/mutations';
import { Button } from '@ui/button';
import { Form } from '@ui/form';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const formSchema = z.object({
  otp: z.string().min(6, {
    message: 'OTP must be 6 digits',
  }),
});

type Props = {
  email: string;
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (resetToken: string) => void;
  onBack?: () => void;
};
const OTPForm: FC<Props> = ({ email, onSuccess, onBack }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useVerifyForgetPasswordOtp();
  const { t } = useTranslation();

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(
      { data: { ...data, email } },
      {
        onSuccess(data) {
          onSuccess?.(data.data.resetToken);
        },
      }
    );
  }

  usePageTitle(t('Auth.forget-password-form.otpForm.title'));
  return (
    <Form {...form}>
      <div>
        <h2 className="mb-2 text-2xl font-semibold md:mt-16 md:text-3xl">
          {t('Auth.forget-password-form.otpForm.title')}
        </h2>
        <p
          className="mb-8 text-sm md:text-base"
          dangerouslySetInnerHTML={{
            __html: t('Auth.forget-password-form.otpForm.description', {
              email: `<b class="text-sm" lang="en">${email}</b>`,
            }),
          }}
        ></p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputOTPFormField
          control={form.control}
          name="otp"
          label={t('Auth.otp-form.label')}
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
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="inline size-4 rtl:rotate-180" />
          <span>{t('Auth.forget-password-form.back')}</span>
        </Button>
      </form>
    </Form>
  );
};

export default OTPForm;
