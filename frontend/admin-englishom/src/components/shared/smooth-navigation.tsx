'use client';
import { useLocale } from 'next-intl';
import { Link as NVLink, useTransitionRouter } from 'next-view-transitions';
import React, { FC } from 'react';
type Props = React.ComponentProps<typeof NVLink> & {
  locale?: string;
};
const Link: FC<Props> = ({ href, locale, ...props }) => {
  const currentLocale = useLocale();
  return <NVLink href={`/${locale || currentLocale}${href}`} {...props} />;
};

const useRouter = () => {
  const locale = useLocale();
  const router = useTransitionRouter();
  return {
    ...router,
    push: (href: string) => router.push(`/${locale}${href}`),
    replace: (href: string) => router.replace(`/${locale}${href}`),
  };
};

export { Link, useRouter };
