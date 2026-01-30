import { useQuery, type QueryOptions } from '@tanstack/react-query';
import { getMe } from './services';

export function useLoggedUser(
  options?: QueryOptions<Awaited<ReturnType<typeof getMe>>>
) {
  return useQuery({
    queryKey: ['getLoggedUser'],
    queryFn: getMe,
    throwOnError: false,
    refetchOnMount: true,
    ...options,
  });
}
