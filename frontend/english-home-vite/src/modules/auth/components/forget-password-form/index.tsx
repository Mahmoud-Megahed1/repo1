import { useState } from 'react';
import Layout from '../layout';
import EmailForm from './email-form';
import OTPForm from './otp-form';
import ResetPasswordForm from './reset-password-form';

const ForgetPasswordForm = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>(
    'email'
  );
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  return (
    <Layout>
      {currentStep === 'email' && (
        <EmailForm
          defaultValue={email}
          onSuccess={(email) => {
            setEmail(email);
            setCurrentStep('otp');
          }}
        />
      )}
      {currentStep === 'otp' && (
        <OTPForm
          email={email}
          onSuccess={(resetToken) => {
            setResetToken(resetToken);
            setCurrentStep('reset');
          }}
          onBack={() => setCurrentStep('email')}
        />
      )}
      {currentStep === 'reset' && <ResetPasswordForm resetToken={resetToken} />}
    </Layout>
  );
};

export default ForgetPasswordForm;
