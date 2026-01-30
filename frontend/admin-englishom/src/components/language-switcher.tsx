'use client';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { FC, Suspense } from 'react';
type Props = Omit<React.ComponentProps<typeof Link>, 'href' | 'locale'>;
const LanguageSwitcher: FC<Props> = ({ className, children, ...props }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  return (
    <Link
      href={`${pathname}?${searchParams}`}
      locale={locale === 'en' ? 'ar' : 'en'}
      className={className}
      {...props}
    >
      {children || `${locale === 'en' ? 'Ar' : 'En'}`}
    </Link>
  );
};

const Wrapper: FC<Props> = (props) => (
  <Suspense>
    <LanguageSwitcher {...props} />
  </Suspense>
);

export default Wrapper;
