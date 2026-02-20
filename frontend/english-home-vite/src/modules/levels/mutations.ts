import { useMutation } from '@tanstack/react-query';
import { payment, tamaraPayment } from './services';
import type { LevelId } from '@shared/types/entities';

export function usePayment(levelId: LevelId, userData?: { city?: string; country?: string; phone?: string }) {
  return useMutation({
    mutationKey: ['payment', levelId],
    mutationFn: () =>
      payment({
        data: {
          level_name: levelId,
          city: userData?.city || 'Riyadh',
          country: userData?.country || 'Saudi Arabia',
          phone_number: userData?.phone || '966500000000',
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.data.clientURL;
    },
  });
}

export function useTamaraPayment(levelId: LevelId, userData?: { city?: string; country?: string; phone?: string }) {
  return useMutation({
    mutationKey: ['tamaraPayment', levelId],
    mutationFn: () =>
      tamaraPayment({
        data: {
          level_name: levelId,
          city: userData?.city || 'Riyadh',
          country: userData?.country || 'Saudi Arabia',
          phone_number: userData?.phone || '966500000000',
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.data.checkoutUrl;
    },
  });
}
