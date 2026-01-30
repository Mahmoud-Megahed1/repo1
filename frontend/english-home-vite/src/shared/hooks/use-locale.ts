import { useParams } from '@tanstack/react-router';
import i18next from 'i18next';

const useLocale = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = useParams({ strict: false }) as any;
  const locale =
    (params?.locale as string) ||
    i18next.language ||
    'en';
  return locale;
};

export default useLocale;
