import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import Wrapper from './wrapper';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'AdminPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;
