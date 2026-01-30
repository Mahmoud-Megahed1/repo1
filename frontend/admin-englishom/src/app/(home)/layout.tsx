import React from 'react';
import RootLayout, { generateMetadata as gn } from '../[locale]/layout';

export async function generateMetadata() {
  return gn({
    params: {
      locale: 'en',
    },
  });
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <RootLayout params={{ locale: 'en' }}>{children}</RootLayout>;
};

export default Layout;
