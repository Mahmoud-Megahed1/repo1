import { Link, usePathname } from '@/shared/i18n/routing';
import useLocale from '@hooks/use-locale';
import { useLocation } from '@tanstack/react-router';
import { type FC } from 'react';
type Props = Omit<
  React.ComponentProps<typeof Link>,
  'href' | 'locale' | 'preload' | 'children'
> & {
  // eslint-disable-next-line no-unused-vars
  children?: React.ReactNode | ((locale: string) => React.ReactNode);
};
const LanguageSwitcher: FC<Props> = ({ className, children, ...props }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const { searchStr } = useLocation();

  const targetLocale = locale === 'en' ? 'ar' : 'en';

  return (
    <Link
      to={`${pathname}${searchStr}` as never}
      locale={targetLocale}
      preload={false}
      className={className}
      viewTransition
      {...props}
    >
      {typeof children === 'function'
        ? children(locale)
        : children || `${locale === 'en' ? 'Ar' : 'En'}`}
    </Link>
  );
};

export default LanguageSwitcher;
