import InputOTPFormField from '@components/form-fields/input-otp-form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import { Form } from '@ui/form';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useResendOtp, useVerifyOtp } from '../mutations';
import Layout from './layout';
import usePageTitle from '@hooks/use-page-title';

const formSchema = z.object({
  otp: z.string().min(6, {
    message: 'OTP must be 6 digits',
  }),
});

type Props = {
  email: string;
};
const OTPForm: FC<Props> = ({ email }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { t } = useTranslation();
  const { mutate, isPending } = useVerifyOtp();

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(
      {
        data: {
          otp: data.otp,
          email,
        },
      },
      {
        onError(error) {
          if (error.response?.status === 409 || error.response?.status === 400)
            form.setError('otp', {
              message: t('Auth.otp-form.invalidOtp'),
            });
        },
      }
    );
  }

  // p*****6@gmail.com
  const hashedEmail = email.replace(
    /^(.)(.*)(@.*)$/,
    (_, first, middle, domain) => first + '*'.repeat(middle.length) + domain
  );

  usePageTitle(t('Auth.otp-form.title'));

  return (
    <Layout>
      <Form {...form}>
        <div>
          <h2 className="mb-2 text-2xl font-semibold md:mt-16 md:text-3xl">
            {t('Auth.otp-form.title')}
          </h2>
          <p className="mb-8 text-sm md:text-base">
            {t('Auth.otp-form.optSendSuccessfully', {
              email: hashedEmail,
            })}
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputOTPFormField
            control={form.control}
            name="otp"
            label={t('Auth.otp-form.label')}
          />

          <div className="mt-4 flex items-center">
            <p>{t('Auth.otp-form.dontReceiveCode')}</p>
            <ResendOtpComponent email={email} isSending={isPending} />
          </div>

          <Button
            className="mt-14 w-full shadow-md"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t('Auth.otp-form.verify-button')
            )}
          </Button>
          <p className="mt-4 text-center text-sm">
            {t('Auth.otp-form.haveNotAccount')}{' '}
            <Link
              to="/signup"
              onClick={() => localStorage.removeItem('token')}
              className="underline underline-offset-4"
            >
              {t('Auth.otp-form.signUpButton')}
            </Link>
          </p>
        </form>
      </Form>
    </Layout>
  );
};

const ResendOtpComponent = ({
  isSending,
  email,
}: {
  isSending: boolean;
  email: string;
}) => {
  const { t } = useTranslation();
  const [timer, setTimer] = useState(0);
  const { mutate, isPending } = useResendOtp();
  const handleResend = () => {
    mutate(email, {
      onSuccess() {
        setTimer(30);
      },
    });
  };
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);
  return (
    <>
      <Button
        onClick={handleResend}
        className="ms-1 p-0 font-semibold underline underline-offset-2"
        disabled={isSending || isPending || timer > 0}
        variant="link"
        type="button"
      >
        {t('Auth.otp-form.resendCode')}
        {isPending && <LoaderCircle className="animate-spin" />}
      </Button>
      {timer > 0 && <span className="ms-2 text-sm">({timer}s)</span>}
    </>
  );
};

export default OTPForm;
