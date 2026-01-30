import { useLocale } from 'next-intl';

const useLocalizedNumber = (number: number, locale?: string) => {
  const currentLocale = useLocale();
  const myLocale = locale || currentLocale;
  const option = myLocale === 'ar' ? 'ar-EG' : 'en-US';
  return number.toLocaleString(option);
};

export default useLocalizedNumber;
