import { useNavigate } from '@shared/i18n/routing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  forgotPassword,
  login,
  register,
  resendOtp,
  resendPasswordOTP,
  resetPassword,
  verifyForgetPasswordOtp,
  verifyOtp,
} from './services';
import { toast } from 'sonner';

export function useSignup() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['signup'],
    mutationFn: register,
    onSuccess(data) {
      const {
        user: { isVerified },
        access_token,
      } = data.data;
      //Store access token in local storage
      localStorage.setItem('token', access_token);
      if (!isVerified) {
        navigate({ to: '/verify-email', replace: true });
      }
    },
    onError: undefined, // remove global error handling
  });
}

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess(data) {
      const {
        user: { isVerified },
        access_token,
      } = data.data;
      localStorage.setItem('token', access_token);
      if (isVerified) {
        navigate({ to: '/app' });
      } else {
        navigate({
          to: '/verify-email',
        });
      }
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['verifyOtp'],
    mutationFn: verifyOtp,
    onSuccess(data) {
      localStorage.setItem('token', data.data.access_token);
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      // navigate('/app');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: forgotPassword,
  });
}

export function useResendPasswordOTP() {
  return useMutation({
    mutationKey: ['resendPasswordOTP'],
    mutationFn: resendPasswordOTP,
  });
}

export function useVerifyForgetPasswordOtp() {
  return useMutation({
    mutationKey: ['verifyForgetPasswordOtp'],
    mutationFn: verifyForgetPasswordOtp,
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
    onSuccess() {
      toast.success('Password reset successfully');
      navigate({ to: '/login' });
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationKey: ['resendOtp'],
    mutationFn: resendOtp,
  });
}
