import { useParams } from '@tanstack/react-router';

const useLocale = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = useParams({ strict: false }) as any;
  const locale =
    (params?.locale as string) ||
    'ar';
  return locale;
};

export default useLocale;
