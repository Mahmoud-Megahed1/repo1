import { useMutation } from '@tanstack/react-query';
import { payment } from './services';
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
      window.open(data.data.clientURL, '_blank');
    },
  });
}
