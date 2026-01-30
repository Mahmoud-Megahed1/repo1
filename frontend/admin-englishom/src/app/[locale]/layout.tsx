import '@/app/globals.css';
import DirectionProvider from '@/components/direction-provider';
import MyQueryClientProvider from '@/components/query-client-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { ViewTransitions } from 'next-view-transitions';
import { cn, getDirection } from '@/lib/utils';
import { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from '@/components/ui/sonner';

import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
// import { Cairo, Inter } from 'next/font/google';
import React from 'react';

// Mocking fonts to avoid build errors due to network issues
const ARABIC_FONT = {
  className: 'font-arabic', // You might need to ensure this class exists or just use a generic sans-serif
};

const ENGLISH_FONT = {
  className: 'font-english',
};

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Global' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: {
      default: t('appName'),
      template: '%s | ' + t('appName'),
    },
    description: t('description'),
    alternates: {
      canonical: process.env.NEXT_PUBLIC_BASE_URL + '/en',
      languages: {
        ar: process.env.NEXT_PUBLIC_BASE_URL + '/ar',
        en: process.env.NEXT_PUBLIC_BASE_URL + '/en',
      },
    },
    openGraph: {
      images: [
        {
          url: `/images/og/${locale}/login.webp`,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ViewTransitions>
      <html lang={locale} dir={getDirection(locale)}>
        <body>
          <NextIntlClientProvider messages={messages}>
            <MyQueryClientProvider>
              <DirectionProvider dir={getDirection(locale)}>
                <ThemeProvider attribute="class" defaultTheme="light">
                  <div
                    className={cn('text-primary antialiased', {
                      [ARABIC_FONT.className]: locale === 'ar',
                      [ENGLISH_FONT.className]: locale !== 'ar',
                    })}
                  >
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </div>
                </ThemeProvider>
              </DirectionProvider>
            </MyQueryClientProvider>
          </NextIntlClientProvider>
          <Toaster
            richColors
            position={locale === 'en' ? 'bottom-left' : 'bottom-right'}
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
