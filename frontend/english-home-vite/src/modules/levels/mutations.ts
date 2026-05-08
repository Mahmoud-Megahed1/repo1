import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payment, terminateActiveCourse } from './services';
import type { LevelId } from '@shared/types/entities';
import useLocale from '@hooks/use-locale';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function usePayment(levelId: LevelId, userData?: { city?: string; country?: string; phone?: string }) {
  const locale = useLocale();

  return useMutation({
    mutationKey: ['payment', levelId],
    mutationFn: () =>
      payment({
        data: {
          level_name: levelId,
          city: userData?.city || 'Riyadh',
          country: userData?.country || 'Saudi Arabia',
          phone_number: userData?.phone || '966500000000',
          locale: locale || 'en',
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.data.clientURL;
    },
    onError: (error: AxiosError<{ message?: string; messageEn?: string }>) => {
      const data = error.response?.data;
      if (data) {
        const msg = locale === 'ar' ? (data.message || data.messageEn) : (data.messageEn || data.message);
        toast.error(msg || error.message);
      } else {
        toast.error(error.message);
      }
    },
  });
}

export function useTerminateActiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['terminate-active-course'],
    mutationFn: () => terminateActiveCourse(),
    onSuccess: () => {
      // Invalidate auth/user data to refresh levels
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['active-course'] });
    },
  });
}
