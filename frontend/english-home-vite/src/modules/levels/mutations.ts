import { useMutation } from '@tanstack/react-query';
import { payment, tamaraPayment } from './services';
import type { LevelId } from '@shared/types/entities';

export function usePayment(levelId: LevelId) {
  return useMutation({
    mutationKey: ['payment', levelId],
    mutationFn: () =>
      payment({
        data: {
          level_name: levelId,
          city: 'Riyadh',
          country: 'Saudi Arabia',
          phone_number: '01201920346',
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.data.clientURL;
      // window.open(data.data.clientURL, '_blank');
    },
  });
}

export function useTamaraPayment(levelId: LevelId) {
  return useMutation({
    mutationKey: ['tamaraPayment', levelId],
    mutationFn: () =>
      tamaraPayment({
        data: {
          level_name: levelId,
          city: 'Riyadh',
          country: 'Saudi Arabia',
          phone_number: '01201920346',
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.data.checkoutUrl;
    },
  });
}
